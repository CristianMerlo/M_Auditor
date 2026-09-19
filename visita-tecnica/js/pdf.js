/* Informe PDF con jsPDF (vendorizado, sin CDN). Estructura del documento de dominio:
   encabezado con circulo rojo "M" + codigo, datos de cabecera, bloque cocina,
   bloque edilicio, agua (con el motivo del color), scores con barras, firmas, pie.
   Fotos ~800px de ancho, 2 por fila, objetivo <=4MB. Nombre: Visita_{clave}_{fecha}.pdf */
window.PDF=(function(){
  'use strict';
  function rgb(rol){return window.Paleta.rgb(rol);}
  function colorSem(sem){var m={verde:'verde',amarillo:'amarillo',rojo:'rojo',gris:'sinMedir'};return rgb(m[sem]||'sinMedir');}
  function blobADataURL(blob){return new Promise(function(res){var fr=new FileReader();fr.onload=function(){res(fr.result);};fr.readAsDataURL(blob);});}
  function fechaCorta(iso){var d=iso?new Date(iso):new Date();function z(n){return (n<10?'0':'')+n;}
    return z(d.getDate())+'/'+z(d.getMonth()+1)+'/'+d.getFullYear();}
  function fechaArchivo(iso){var d=iso?new Date(iso):new Date();function z(n){return (n<10?'0':'')+n;}
    return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());}

  function cargarFotos(v){ // devuelve {idFoto: dataURL}
    var ids=[]; window.Checklist.todos().forEach(function(it){var d=v.items[it.id];
      if(d&&d.fotos)d.fotos.forEach(function(f){ids.push(f);});});
    return ids.reduce(function(prom,f){return prom.then(function(mapa){
      return window.Almacen.leerBinario(f.id).then(function(reg){
        if(reg&&reg.blob)return blobADataURL(reg.blob).then(function(u){mapa[f.id]=u;return mapa;});
        return mapa;});});},Promise.resolve({}));
  }
  function cargarFirma(id){return window.Almacen.leerBinario(id).then(function(reg){
    return reg&&reg.blob?blobADataURL(reg.blob):null;});}

  function generar(){
    var v=window.Visita.actual(); if(!v)return Promise.reject(new Error('No hay visita'));
    window.Scoring.recalcular(v);
    return Promise.all([cargarFotos(v),cargarFirma(v.firmas.jefe.id),cargarFirma(v.firmas.encargado.id)])
      .then(function(res){ return construir(v,res[0],res[1],res[2]); });
  }

  function construir(v,fotos,firmaJefe,firmaEnc){
    var jsPDFctor=(window.jspdf&&window.jspdf.jsPDF)||window.jsPDF;
    if(!jsPDFctor)throw new Error('jsPDF no está cargado (vendor/jspdf.umd.min.js)');
    var doc=new jsPDFctor({unit:'mm',format:'a4'});
    var W=210,H=297,mx=14,y=0,pag=1;
    var cR=rgb('rojo'),cMarca=rgb('marca'),cTinta=rgb('tinta'),cLabel=rgb('label');

    function pie(){ doc.setFontSize(8); doc.setTextColor(150,150,150);
      doc.text(window.CONFIG.pieCorporativo,W/2,H-8,{align:'center'});
      doc.text('Página '+pag,W-mx,H-8,{align:'right'}); }
    function encabezado(){ doc.setFillColor(cR[0],cR[1],cR[2]); doc.circle(W/2,14,3.5,'F');
      doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.text('M',W/2,15.4,{align:'center'});
      doc.setTextColor(cTinta[0],cTinta[1],cTinta[2]); doc.setFontSize(13);
      doc.text('VISITA TÉCNICA',W/2,24,{align:'center'});
      doc.setFontSize(8); doc.setTextColor(cLabel[0],cLabel[1],cLabel[2]); doc.setFont('helvetica','normal');
      doc.text(fechaCorta(v.iniciada),mx,14); doc.text(v.codigo||'',W-mx,14,{align:'right'});
      doc.setDrawColor(cMarca[0],cMarca[1],cMarca[2]); doc.setLineWidth(0.8); doc.line(mx,28,W-mx,28);
      y=34; }
    function nuevaPagina(){ pie(); doc.addPage(); pag++; encabezado(); }
    function espacio(alto){ if(y+alto>H-16)nuevaPagina(); }
    function titulo(txt){ espacio(12); doc.setFont('helvetica','bold'); doc.setFontSize(12);
      doc.setTextColor(cTinta[0],cTinta[1],cTinta[2]); doc.text(txt.toUpperCase(),mx,y); y+=6;
      doc.setDrawColor(220,220,220); doc.setLineWidth(0.3); doc.line(mx,y,W-mx,y); y+=5; }
    function dato(k,val){ espacio(6); doc.setFont('helvetica','bold'); doc.setFontSize(9);
      doc.setTextColor(cLabel[0],cLabel[1],cLabel[2]); doc.text(k+':',mx,y);
      doc.setFont('helvetica','normal'); doc.setTextColor(30,30,30);
      var lines=doc.splitTextToSize(String(val==null?'—':val),W-mx*2-40); doc.text(lines,mx+40,y); y+=Math.max(5,lines.length*4.6); }
    function parrafo(txt,size){ doc.setFont('helvetica','normal'); doc.setFontSize(size||9); doc.setTextColor(50,50,50);
      var lines=doc.splitTextToSize(txt,W-mx*2); lines.forEach(function(ln){espacio(5);doc.text(ln,mx,y);y+=4.6;}); }

    encabezado();

    titulo('Datos de la visita');
    dato('Local',v.local?v.local.nombre:'—');
    if(v.local){ if(v.local.siglaSistema)dato('Sigla sistema',v.local.siglaSistema);
      if(v.local.siglaTicket)dato('Sigla ticket',v.local.siglaTicket);
      dato('Tipo',v.local.tipo+(v.local.manual?' (carga manual)':'')); }
    dato('Fecha',fechaCorta(v.iniciada));
    dato('Jefe de área',v.jefe?v.jefe.nombre:'—');
    dato('Encargado',v.encargado.nombre+(v.encargado.cargo?' — '+v.encargado.cargo:''));
    dato('Código',v.codigo);
    y+=2;

    function bloque(nombre,clave){
      titulo('Bloque '+nombre);
      var items=window.Checklist.porBloque(clave);
      var revisados=0,total=0;
      items.forEach(function(it){ if(it.tipo==='agua')return;
        var d=v.items[it.id]; if(!d)return; total++;
        if((d.declarado||d.tocado)&&!d.na)revisados++; });
      var sc=v.scores[clave];
      dato('Puntaje del bloque',(sc==null?'sin datos':sc+'/100')+'  ('+({verde:'VERDE',amarillo:'AMARILLO',rojo:'ROJO',gris:'—'})[window.Scoring.color(sc)]+')');
      dato('Revisados sin observaciones',revisados+' de '+total);
      y+=1;
      items.forEach(function(it){ var d=v.items[it.id]||window.Controles.inicial(it);
        var c=window.Controles.obtener(it.tipo); var r=c.aPdf?c.aPdf(it,d):{lineas:[]};
        espacio(10);
        doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(cTinta[0],cTinta[1],cTinta[2]);
        var nom=doc.splitTextToSize(it.nombre,W-mx*2); doc.text(nom,mx,y); y+=nom.length*4.8;
        (r.lineas||[]).forEach(function(ln){ parrafo(ln,9); });
        if(r.fotos&&r.fotos.length)ponerFotos(r.fotos);
        y+=2;
      });
    }
    function ponerFotos(lista){
      var anchoMm=(W-mx*2-6)/2; var xs=[mx,mx+anchoMm+6];
      for(var i=0;i<lista.length;i+=2){
        var altoMax=0, fila=lista.slice(i,i+2);
        var alturas=fila.map(function(f){var ar=(f.w&&f.h)?(f.h/f.w):0.75;var a=anchoMm*ar;if(a>altoMax)altoMax=a;return a;});
        espacio(altoMax+3);
        fila.forEach(function(f,j){ var du=fotos[f.id]; if(!du)return;
          try{doc.addImage(du,'JPEG',xs[j],y,anchoMm,alturas[j]);}catch(e){} });
        y+=altoMax+3;
      }
    }

    bloque('Cocina','cocina');
    bloque('Edilicio','edilicio');

    // Agua
    titulo('Sistema de filtrado de agua');
    var itAgua=window.Checklist.porId('coc-12'); var dAgua=v.items['coc-12']||window.Controles.inicial(itAgua);
    var rAgua=window.Controles.obtener('agua').aPdf(itAgua,dAgua);
    var col=colorSem(dAgua.semaforo); espacio(10);
    doc.setFillColor(col[0],col[1],col[2]); doc.circle(mx+3,y-1,3,'F'); 
    doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(cTinta[0],cTinta[1],cTinta[2]);
    doc.text(({verde:'AGUA EN RANGO',amarillo:'AGUA EN ALERTA',rojo:'AGUA CRÍTICA',gris:'AGUA SIN MEDIR'})[dAgua.semaforo],mx+9,y); y+=6;
    (rAgua.lineas||[]).forEach(function(ln){parrafo(ln,9);});
    dato('Periodicidad de medición',v.parametrosAgua.periodicidadDias+' días');
    dato('Recambio de filtro',v.parametrosAgua.recambioFiltro.valor+' '+({dias:'días',ppm:'PPM',litros:'litros'})[v.parametrosAgua.recambioFiltro.modo]);
    y+=2;

    // Scores resumen con barras
    titulo('Resumen de puntajes');
    function barra(nombre,sc){ espacio(14);
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(cTinta[0],cTinta[1],cTinta[2]);
      doc.text(nombre,mx,y); doc.text((sc==null?'—':sc+'/100'),W-mx,y,{align:'right'}); y+=3;
      var ancho=W-mx*2, val=sc==null?0:sc/100;
      doc.setFillColor(225,225,225); doc.rect(mx,y,ancho,4,'F');
      var c=colorSem(window.Scoring.color(sc)); doc.setFillColor(c[0],c[1],c[2]); doc.rect(mx,y,ancho*val,4,'F');
      y+=9; }
    barra('Cocina',v.scores.cocina);
    barra('Edilicio',v.scores.edilicio);
    barra('General',v.scores.general);
    y+=2;

    // Firmas
    titulo('Firmas');
    var fw=window.CONFIG.firmas.anchoMm, fh=window.CONFIG.firmas.altoMm;
    espacio(fh+20);
    var y0=y; var x1=mx, x2=W/2+4;
    if(firmaJefe)try{doc.addImage(firmaJefe,'PNG',x1,y0,fw,fh);}catch(e){}
    if(firmaEnc)try{doc.addImage(firmaEnc,'PNG',x2,y0,fw,fh);}catch(e){}
    var yl=y0+fh+2; doc.setDrawColor(120,120,120); doc.setLineWidth(0.3);
    doc.line(x1,yl,x1+fw,yl); doc.line(x2,yl,x2+fw,yl);
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(cLabel[0],cLabel[1],cLabel[2]);
    doc.text('FIRMA JEFE DE ÁREA',x1,yl+4); doc.text('FIRMA ENCARGADO',x2,yl+4);
    doc.setFont('helvetica','normal'); doc.setTextColor(30,30,30);
    doc.text(v.jefe?v.jefe.nombre:'',x1,yl+9);
    doc.text(v.encargado.nombre+(v.encargado.cargo?' — '+v.encargado.cargo:''),x2,yl+9);
    y=yl+14;

    pie();
    var nombre='Visita_'+((v.local&&v.local.clave)||'SIN_LOCAL')+'_'+fechaArchivo(v.iniciada)+'.pdf';
    return {doc:doc,nombre:nombre};
  }

  return {generar:generar};
})();
