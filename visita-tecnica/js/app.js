/* ============================================================================
   app.js — arranque y cableado.
   ========================================================================= */
(function () {
  'use strict';

  function arrancar() {
    window.UI.iniciar();
    window.Visita.engancharFlush();

    // La paleta se lee del CSS una sola vez, cuando el CSSOM está listo.
    window.Paleta.listo().then(function () {
      window.Paleta.todo();
      avisarSiElGuardadoNoEsSeguro();
    });

    // Abrir IndexedDB temprano: si está bloqueada, queremos saberlo antes de la
    // primera foto, no cuando el jefe ya está adentro del local.
    window.Almacen.iniciar();

    var borrador = window.Visita.borrador();
    if (borrador) {
      preguntarPorBorrador(borrador);
    } else {
      window.UI.render();
    }

    document.addEventListener('vt:css', function () { /* la paleta ya quedó cargada */ });
  }

  /* El autosave solo sirve si el usuario sabe que ocurrió. En la herramienta
     actual guardaba bien pero nadie lo sabía, así que nadie confiaba. */
  function preguntarPorBorrador(b) {
    var cuando = new Date(b.actualizada);
    var descripcion = [
      b.local ? b.local.nombre : 'local sin elegir',
      b.jefe ? b.jefe.nombre : 'jefe sin identificar',
      'última edición ' + formatoFechaHora(cuando)
    ].join(' · ');

    window.UI.modal({
      titulo: 'Hay una visita en curso',
      html: '<p class="tarjeta__texto">' + escapar(descripcion) + '</p>' +
        '<p class="tarjeta__texto">Podés seguir donde la dejaste. Si la descartás, ' +
        'se borran también las fotos que hubiera cargado.</p>',
      acciones: [
        {
          texto: 'Continuar la visita',
          estilo: 'principal',
          accion: function () {
            window.Visita.retomar(b);
            window.UI.render();
          }
        },
        {
          texto: 'Descartar y empezar de nuevo',
          estilo: 'peligro',
          cerrar: false,
          accion: function () { confirmarDescarte(b); }
        }
      ]
    });
  }

  function confirmarDescarte(b) {
    window.UI.modal({
      titulo: '¿Descartar la visita?',
      html: '<p class="tarjeta__texto">Se pierde todo lo cargado' +
        (b.local ? ' en ' + escapar(b.local.nombre) : '') + '. No se puede recuperar.</p>',
      acciones: [
        {
          texto: 'Sí, descartar',
          estilo: 'peligro',
          accion: function () {
            window.Visita.descartar().then(function (borrados) {
              window.UI.render();
              if (borrados) window.UI.avisoTemporal('Se liberaron ' + borrados + ' archivo(s) de fotos.');
            });
          }
        },
        {
          texto: 'No, volver',
          cerrar: false,
          accion: function () { preguntarPorBorrador(b); }
        }
      ]
    });
  }

  function avisarSiElGuardadoNoEsSeguro() {
    var est = window.Almacen.estado;
    if (!est.textoPersistente) {
      window.UI.aviso('Este navegador no está guardando en disco (' + est.motivoTexto +
        '). Si cerrás la pestaña se pierde la visita.', true);
    }
  }

  function formatoFechaHora(d) {
    function dosD(n) { return (n < 10 ? '0' : '') + n; }
    return dosD(d.getDate()) + '/' + dosD(d.getMonth() + 1) + ' ' +
      dosD(d.getHours()) + ':' + dosD(d.getMinutes());
  }

  /* Ver el comentario de escapar() en diagnostico.js: sin entidades literales. */
  function escapar(t) {
    var d = document.createElement('div');
    d.textContent = (t === null || t === undefined) ? '' : String(t);
    return d.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
