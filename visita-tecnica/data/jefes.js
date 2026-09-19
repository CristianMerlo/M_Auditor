/* PIN NO es seguridad (esta en el fuente). Previene cargar a nombre equivocado.
   REGLA: los 5 PIN deben diferir entre si en 2+ digitos. Estos difieren en 4. */
window.Jefes=(function(){
  'use strict';
  var L=[{id:'jefe-1',nombre:'Jefe 1',pin:'1834'},{id:'jefe-2',nombre:'Jefe 2',pin:'2947'},
    {id:'jefe-3',nombre:'Jefe 3',pin:'3651'},{id:'jefe-4',nombre:'Jefe 4',pin:'4126'},
    {id:'jefe-5',nombre:'Jefe 5',pin:'5390'}];
  function dist(a,b){var d=0;for(var i=0;i<4;i++)if(a.charAt(i)!==b.charAt(i))d++;return d;}
  function distMin(){var m=4;for(var i=0;i<L.length;i++)for(var j=i+1;j<L.length;j++){var d=dist(L[i].pin,L[j].pin);if(d<m)m=d;}return m;}
  function verificar(){var p=[];L.forEach(function(j){if(!/^[0-9]{4}$/.test(j.pin))p.push(j.nombre+': PIN inválido');});
    if(distMin()<2)p.push('Dos PIN difieren en 1 solo dígito');p.forEach(function(x){console.warn('data/jefes.js — '+x);});return p;}
  verificar();
  function porId(id){for(var i=0;i<L.length;i++)if(L[i].id===id)return L[i];return null;}
  return {todos:function(){return L.map(function(j){return {id:j.id,nombre:j.nombre};});},
    porId:function(id){var j=porId(id);return j?{id:j.id,nombre:j.nombre}:null;},
    pinCorrecto:function(id,pin){var j=porId(id);return !!j&&j.pin===String(pin);},
    distanciaMinima:distMin,verificar:verificar,cantidad:L.length};
})();
