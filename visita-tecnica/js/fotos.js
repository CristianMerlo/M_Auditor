/* Captura, EXIF, redimensionado, limites, acumulacion, liberacion de memoria.
   - Redimensiona a maximo 1200px lado largo con Math.min (no agranda).
   - JPEG 0.65. Corrige orientacion EXIF con createImageBitmap.
   - Acumula (no reemplaza). Tope 2/item y 20/visita. Blob en IndexedDB.
   - Libera bitmap y objectURL: nunca mas de 1 imagen grande decodificada. */
window.Fotos=(function(){
  'use strict';
  var CFG=window.CONFIG.fotos;
  function nuevoId(){return 'f-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
  function totalVisita(){var v=window.Visita.actual();if(!v)return 0;var n=0;
    Object.keys(v.items).forEach(function(id){var it=v.items[id];if(it&&it.fotos)n+=it.fotos.length;});return n;}
  function procesar(file){
    return createImageBitmap(file,{imageOrientation:'from-image'}).then(function(bmp){
      var lado=Math.min(CFG.maxLadoLargo,Math.max(bmp.width,bmp.height));
      var esc=lado/Math.max(bmp.width,bmp.height);
      var w=Math.round(bmp.width*esc),h=Math.round(bmp.height*esc);
      var c=document.createElement('canvas');c.width=w;c.height=h;
      c.getContext('2d').drawImage(bmp,0,0,w,h);
      if(bmp.close)bmp.close();
      return new Promise(function(res){c.toBlob(function(blob){res({blob:blob,w:w,h:h});},'image/jpeg',CFG.calidad);});
    });
  }
  function agregar(item,d,file,alCambiar,alTerminar){
    if(!d.fotos)d.fotos=[];
    if(d.fotos.length>=CFG.maxPorItem){window.UI.avisoTemporal('Máximo '+CFG.maxPorItem+' fotos por ítem.');alTerminar&&alTerminar();return;}
    if(totalVisita()>=CFG.maxPorVisita){window.UI.avisoTemporal('Llegaste al máximo de '+CFG.maxPorVisita+' fotos por visita.');alTerminar&&alTerminar();return;}
    procesar(file).then(function(r){
      var id=nuevoId();
      return window.Almacen.guardarBinario(id,r.blob,{w:r.w,h:r.h}).then(function(){
        d.fotos.push({id:id,orden:d.fotos.length+1,w:r.w,h:r.h,bytes:r.blob.size});
        var v=window.Visita.actual();if(v)v.fotosUsadas=totalVisita();
        alCambiar(d,{});
        if(totalVisita()>=window.CONFIG.avisarEspacioDesdeFoto)chequearEspacio();
        alTerminar&&alTerminar();
      });
    }).catch(function(e){console.error('foto',e);window.UI.avisoTemporal('No se pudo procesar la foto.');alTerminar&&alTerminar();});
  }
  function quitar(d,foto,alCambiar,alTerminar){
    window.Almacen.borrarBinario(foto.id).then(function(){
      d.fotos=(d.fotos||[]).filter(function(f){return f.id!==foto.id;});
      d.fotos.forEach(function(f,i){f.orden=i+1;});
      var v=window.Visita.actual();if(v)v.fotosUsadas=totalVisita();
      alCambiar(d,{});alTerminar&&alTerminar();
    });
  }
  function chequearEspacio(){window.Almacen.espacio().then(function(e){if(!e||!e.disponible)return;
    var libre=e.disponible-e.usado;if(libre<8*1024*1024)
      window.UI.aviso('Queda poco espacio en el teléfono. Terminá la visita y generá el PDF pronto.',true);});}
  function miniatura(img,foto){window.Almacen.leerBinario(foto.id).then(function(reg){
    if(!reg||!reg.blob)return;var url=URL.createObjectURL(reg.blob);
    img.onload=function(){URL.revokeObjectURL(url);};img.src=url;});}
  function renderItem(cont,item,d,alCambiar,mostrarBoton){
    cont.innerHTML='';
    var fila=document.createElement('div');fila.className='foto-fila';
    (d.fotos||[]).forEach(function(foto){
      var wrap=document.createElement('span');
      var img=document.createElement('img');img.className='miniatura';img.alt='foto';miniatura(img,foto);
      var q=document.createElement('button');q.type='button';q.className='foto-quitar';q.textContent='Quitar';
      q.addEventListener('click',function(){quitar(d,foto,alCambiar,function(){renderItem(cont,item,d,alCambiar,mostrarBoton);});});
      wrap.appendChild(img);wrap.appendChild(q);fila.appendChild(wrap);
    });
    cont.appendChild(fila);
    var puedeMas=(d.fotos||[]).length<CFG.maxPorItem;
    if(mostrarBoton&&puedeMas){
      var lbl=document.createElement('label');lbl.className='btn btn--bloque';lbl.style.textAlign='center';
      lbl.textContent='📷 Agregar foto ('+((d.fotos||[]).length)+'/'+CFG.maxPorItem+')';
      var inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.capture='environment';inp.style.display='none';
      inp.addEventListener('change',function(){var f=inp.files&&inp.files[0];if(!f)return;
        lbl.textContent='Procesando…';
        agregar(item,d,f,alCambiar,function(){renderItem(cont,item,d,alCambiar,mostrarBoton);});inp.value='';});
      lbl.appendChild(inp);cont.appendChild(lbl);
    } else if(mostrarBoton&&!puedeMas){
      var n=document.createElement('p');n.className='item__ayuda';n.textContent='Máximo '+CFG.maxPorItem+' fotos en este ítem.';cont.appendChild(n);
    }
  }
  return {renderItem:renderItem,totalVisita:totalVisita,agregar:agregar,quitar:quitar};
})();
