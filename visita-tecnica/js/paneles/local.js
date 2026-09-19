(function(){
  'use strict';
  var busqueda='',modoManual=false,mensaje='';
  function render(cont,v){ cont.appendChild(v.local?fichaLocal(v):buscador(v));
    if(!v.local)return; cont.appendChild(cardEncargado(v)); cont.appendChild(cardAgua(v)); }
  function buscador(v){
    var t=document.createElement('div');t.className='tarjeta';
    t.innerHTML='<span class="etiqueta">Paso 2</span><h2 class="tarjeta__titulo">¿Qué local estás visitando?</h2>';
    if(modoManual){armarManual(t);return t;}
    var p=document.createElement('p');p.className='tarjeta__texto';
    p.textContent='Buscá por nombre o por sigla. '+window.Locales.total+' locales cargados.';t.appendChild(p);
    var c=document.createElement('input');c.type='search';c.className='campo';c.placeholder='SAN JUSTO, FSJU, FCSJ3…';c.value=busqueda;
    c.setAttribute('aria-label','Buscar local');
    var lista=document.createElement('div');
    c.addEventListener('input',function(){busqueda=c.value;pintar(lista);});t.appendChild(c);t.appendChild(lista);pintar(lista);
    var man=document.createElement('button');man.type='button';man.className='btn btn--bloque';man.textContent='Otro local — carga manual';
    man.addEventListener('click',function(){modoManual=true;window.UI.render();});t.appendChild(man);return t;
  }
  function pintar(cont){cont.innerHTML='';var res=window.Locales.buscar(busqueda,12);
    if(!res.length){var p=document.createElement('p');p.className='tarjeta__texto error';
      p.textContent='Ningún local coincide. Puede ser un local propio: usá la carga manual.';cont.appendChild(p);return;}
    res.forEach(function(l){var b=document.createElement('button');b.type='button';b.className='btn btn--bloque btn--opcion';
      b.appendChild(lin(l.nombre,'opcion__nombre'));b.appendChild(lin(sig(l)+' · '+l.tipo,'opcion__detalle'));
      b.addEventListener('click',function(){elegir(l);});cont.appendChild(b);});}
  function lin(t,c){var s=document.createElement('span');s.className=c;s.textContent=t;return s;}
  function sig(l){if(l.siglaSistema&&l.siglaTicket&&l.siglaSistema!==l.siglaTicket)return 'sistema '+l.siglaSistema+' / ticket '+l.siglaTicket;
    if(l.siglaSistema)return 'sigla '+l.siglaSistema;return 'sin sigla en el padrón';}
  function armarManual(t){
    var p=document.createElement('p');p.className='tarjeta__texto';
    p.textContent='Para locales que todavía no están en el padrón. Queda asentado en el informe que la sigla se cargó a mano.';t.appendChild(p);
    var nombre=campo(t,'Nombre del local','ej. LOMAS CENTER');
    var sigla=campo(t,'Sigla (si la sabés)','ej. FLOMC');
    t.appendChild(etq('Tipo'));var tipo=document.createElement('select');tipo.className='campo';
    ['franquicia','propio'].forEach(function(o){var op=document.createElement('option');op.value=o;op.textContent=o;tipo.appendChild(op);});t.appendChild(tipo);
    if(mensaje){var e=document.createElement('p');e.className='tarjeta__texto error';e.textContent=mensaje;t.appendChild(e);}
    var ok=document.createElement('button');ok.type='button';ok.className='btn btn--principal btn--bloque';ok.textContent='Usar este local';
    ok.addEventListener('click',function(){if(!nombre.value.trim()){mensaje='Falta el nombre del local.';window.UI.render();return;}
      mensaje='';elegir(window.Locales.manual(nombre.value,sigla.value,tipo.value));});t.appendChild(ok);
    var vol=document.createElement('button');vol.type='button';vol.className='btn btn--bloque';vol.textContent='Volver al buscador';
    vol.addEventListener('click',function(){modoManual=false;mensaje='';window.UI.render();});t.appendChild(vol);
  }
  function elegir(local){window.Visita.aplicar(function(v){v.local=local;
    if(!v.codigo||v.codigo.indexOf('-'+local.clave+'-')===-1)v.codigo=nuevoCodigo(local.clave);},'local');
    modoManual=false;busqueda='';window.UI.render();}
  function nuevoCodigo(clave){var d=new Date();function z(n){return (n<10?'0':'')+n;}
    var f=''+d.getFullYear()+z(d.getMonth()+1)+z(d.getDate());
    var suf=(Date.now().toString(36)+Math.random().toString(36).slice(2)).slice(-4).toUpperCase();
    return 'VT-'+f+'-'+clave+'-'+suf;}
  function fichaLocal(v){var l=v.local;var t=document.createElement('div');t.className='tarjeta';
    t.appendChild(etq('Paso 2 · local'));var h=document.createElement('h2');h.className='tarjeta__titulo';h.style.fontSize='20px';h.textContent=l.nombre;t.appendChild(h);
    t.appendChild(dato('Sigla de sistema',l.siglaSistema||'no figura en el padrón'));
    t.appendChild(dato('Sigla de ticket',l.siglaTicket||'no figura en el padrón'));
    t.appendChild(dato('Tipo',l.tipo+(l.manual?' · cargado a mano':'')));
    t.appendChild(dato('Código de informe',v.codigo||'—'));
    var cm=document.createElement('button');cm.type='button';cm.className='btn btn--bloque';cm.textContent='Cambiar de local';
    cm.addEventListener('click',function(){window.Visita.set('local',null);window.UI.render();});t.appendChild(cm);return t;}
  function cardEncargado(v){var t=document.createElement('div');t.className='tarjeta';t.appendChild(etq('Encargado del local'));
    var p=document.createElement('p');p.className='tarjeta__texto';p.textContent='Quien firma la conformidad. El cargo es opcional: si lo dejás vacío, no se imprime.';t.appendChild(p);
    t.appendChild(etq('Nombre y apellido (obligatorio)'));var nom=document.createElement('input');nom.type='text';nom.className='campo';nom.autocomplete='off';
    nom.value=v.encargado.nombre||'';nom.placeholder='ej. Rodrigo Paz';nom.addEventListener('input',function(){window.Visita.set('encargado.nombre',nom.value);});t.appendChild(nom);
    t.appendChild(etq('Cargo (opcional)'));var car=document.createElement('input');car.type='text';car.className='campo';car.autocomplete='off';
    car.value=v.encargado.cargo||'';car.placeholder='ej. Encargado de turno';car.addEventListener('input',function(){window.Visita.set('encargado.cargo',car.value);});t.appendChild(car);return t;}
  function cardAgua(v){var t=document.createElement('div');t.className='tarjeta';t.appendChild(etq('Parámetros de agua del local'));
    var p=document.createElement('p');p.className='tarjeta__texto';p.textContent='Cada zona tiene agua distinta. Estos valores son un default nuestro, no un criterio de la empresa: cambialos si en este local es otro.';t.appendChild(p);
    t.appendChild(etq('Cada cuántos días se mide el PPM'));var dias=document.createElement('input');dias.type='number';dias.className='campo';dias.min='1';dias.max='365';dias.inputMode='numeric';dias.value=v.parametrosAgua.periodicidadDias;
    dias.addEventListener('change',function(){var nn=parseInt(dias.value,10);if(!isFinite(nn)||nn<1){nn=window.CONFIG.agua.periodicidadDiasDefault;dias.value=nn;}window.Visita.set('parametrosAgua.periodicidadDias',nn);});t.appendChild(dias);
    t.appendChild(etq('Criterio de recambio del filtro'));var modo=document.createElement('select');modo.className='campo';
    var et={dias:'por días',ppm:'por PPM alcanzado',litros:'por litros filtrados'};
    window.CONFIG.agua.modosRecambio.forEach(function(m){var op=document.createElement('option');op.value=m;op.textContent=et[m]||m;if(v.parametrosAgua.recambioFiltro.modo===m)op.selected=true;modo.appendChild(op);});
    modo.addEventListener('change',function(){window.Visita.set('parametrosAgua.recambioFiltro.modo',modo.value);window.UI.render();});t.appendChild(modo);
    var un={dias:'días',ppm:'PPM',litros:'litros'};t.appendChild(etq('Valor en '+(un[v.parametrosAgua.recambioFiltro.modo]||'')));
    var val=document.createElement('input');val.type='number';val.className='campo';val.min='1';val.inputMode='numeric';val.value=v.parametrosAgua.recambioFiltro.valor;
    val.addEventListener('change',function(){var nn=parseInt(val.value,10);if(!isFinite(nn)||nn<1){nn=window.CONFIG.agua.recambioFiltroDefault.valor;val.value=nn;}window.Visita.set('parametrosAgua.recambioFiltro.valor',nn);});t.appendChild(val);return t;}
  function etq(t){var s=document.createElement('span');s.className='etiqueta';s.textContent=t;return s;}
  function dato(k,val){var d=document.createElement('p');d.className='dato';var kk=document.createElement('span');kk.className='dato__clave';kk.textContent=k;
    var vv=document.createElement('span');vv.className='dato__valor';vv.textContent=val;d.appendChild(kk);d.appendChild(vv);return d;}
  function campo(padre,rot,ej){padre.appendChild(etq(rot));var i=document.createElement('input');i.type='text';i.className='campo';i.autocomplete='off';i.placeholder=ej;padre.appendChild(i);return i;}
  window.UI.registrarPanel('local',{render:render,puedeAvanzar:function(v){
    if(!v.local)return 'Elegí el local antes de seguir';
    if(!String(v.encargado.nombre||'').trim())return 'Falta el nombre del encargado';return true;}});
})();
