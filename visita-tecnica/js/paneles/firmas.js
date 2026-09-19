(function(){
  'use strict';
  function render(cont,v){
    var intro=document.createElement('div');intro.className='tarjeta';
    intro.appendChild(etq('Paso 5'));
    var h=document.createElement('h2');h.className='tarjeta__titulo';h.textContent='Firmas';intro.appendChild(h);
    var p=document.createElement('p');p.className='tarjeta__texto';
    p.textContent='Firmá con el dedo. Tocá "Guardar firma" para fijarla. Sin las dos firmas no se puede generar el informe.';
    intro.appendChild(p);cont.appendChild(intro);
    bloqueFirma(cont,v,'jefe','FIRMA JEFE DE ÁREA',v.jefe?v.jefe.nombre:'');
    bloqueFirma(cont,v,'encargado','FIRMA ENCARGADO',v.encargado.nombre+(v.encargado.cargo?' — '+v.encargado.cargo:''));
  }
  function bloqueFirma(cont,v,clave,rotulo,aclaracion){
    var t=document.createElement('div');t.className='tarjeta';
    t.appendChild(etq(rotulo));
    if(aclaracion){var a=document.createElement('p');a.className='item__ayuda';a.textContent=aclaracion;t.appendChild(a);}
    var estado=v.firmas[clave];
    var cajaCanvas=document.createElement('div');t.appendChild(cajaCanvas);
    window.Firmas.montar(cajaCanvas,estado.id,estado,function(){
      window.Visita.aplicar(function(){},'firma:'+clave);
    });
    cont.appendChild(t);
  }
  function etq(t){var s=document.createElement('span');s.className='etiqueta';s.textContent=t;return s;}
  window.UI.registrarPanel('firmas',{render:render,puedeAvanzar:function(v){
    if(!v.firmas.jefe.guardada)return 'Falta la firma del jefe de área';
    if(!v.firmas.encargado.guardada)return 'Falta la firma del encargado';return true;}});
})();
