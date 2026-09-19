/* ============================================================================
   Diagnóstico — panel de soporte, accesible tocando la versión en el pie.

   Su razón de existir es la auditoría de versión: compara el ?v= de cada asset
   realmente cargado contra window.VT_VERSION y muestra el resultado. Así, si
   mañana alguien reporta un comportamiento raro, se le pide esta pantalla y se
   sabe qué versión está corriendo sin abrir el inspector en un celular.
   ========================================================================= */
window.Diagnostico = (function () {
  'use strict';

  function versionDeUrl(url) {
    var m = /[?&]v=([^&]*)/.exec(url || '');
    return m ? decodeURIComponent(m[1]) : null;
  }

  function assetsCargados() {
    var lista = [];
    var vistos = {};
    function sumar(url) {
      if (!url || vistos[url]) return;
      // Solo nos interesan los assets propios del proyecto.
      if (!/\.(css|js)(\?|$)/i.test(url)) return;
      vistos[url] = true;
      var archivo = url.split('/').slice(-1)[0].split('?')[0];
      var v = versionDeUrl(url);
      lista.push({
        archivo: archivo,
        v: v,
        ok: v === window.VT_VERSION
      });
    }
    var nodos = document.querySelectorAll('link[rel="stylesheet"], script[src]');
    Array.prototype.forEach.call(nodos, function (n) { sumar(n.href || n.src); });
    if (window.performance && performance.getEntriesByType) {
      performance.getEntriesByType('resource').forEach(function (r) { sumar(r.name); });
    }
    return lista;
  }

  function auditarVersion() {
    var assets = assetsCargados();
    return {
      constante: window.VT_VERSION,
      enPantalla: (document.getElementById('btn-version') || {}).textContent || '',
      assets: assets,
      todoOk: assets.length > 0 && assets.every(function (a) { return a.ok; })
    };
  }

  function fila(clave, valor, clase) {
    return '<tr><th>' + clave + '</th><td' + (clase ? ' class="' + clase + '"' : '') + '>' + valor + '</td></tr>';
  }

  /* Escape vía DOM, sin literales de entidades HTML en el fuente. Además de
     ser más corto, es inmune a que el código pase por una cadena de
     herramientas que decodifique entidades y deje el escape roto sin avisar. */
  function escapar(t) {
    var d = document.createElement('div');
    d.textContent = (t === null || t === undefined) ? '' : String(t);
    return d.innerHTML;
  }

  function kb(bytes) {
    if (bytes === null || bytes === undefined) return '—';
    if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
  }

  function render(contenedor) {
    var aud = auditarVersion();
    var est = window.Almacen.estado;
    var v = window.Visita.actual();
    var html = '<div class="diag">';

    html += '<h3>Versión</h3><table>';
    html += fila('Constante VT_VERSION', escapar(aud.constante));
    html += fila('Texto del pie', escapar(aud.enPantalla));
    html += fila('Coinciden pie y constante',
      aud.enPantalla.replace(/^v/, '') === aud.constante ? 'SÍ' : 'NO',
      aud.enPantalla.replace(/^v/, '') === aud.constante ? 'ok' : 'mal');
    html += fila('Assets con el ?v= correcto',
      aud.assets.filter(function (a) { return a.ok; }).length + ' de ' + aud.assets.length,
      aud.todoOk ? 'ok' : 'mal');
    html += '</table>';

    html += '<table><tr><th>Archivo</th><th>?v=</th><th></th></tr>';
    aud.assets.forEach(function (a) {
      html += '<tr><td>' + escapar(a.archivo) + '</td><td>' + escapar(a.v || '(sin ?v=)') + '</td>' +
        '<td class="' + (a.ok ? 'ok' : 'mal') + '">' + (a.ok ? 'OK' : 'DISTINTO') + '</td></tr>';
    });
    html += '</table>';

    html += '<h3>Paleta leída del CSS</h3><table>';
    window.Paleta.roles.forEach(function (rol) {
      var hex = window.Paleta.hex(rol);
      var rgb = window.Paleta.rgb(rol).join(', ');
      html += '<tr><th>' + rol + '</th><td><span class="muestra" style="background:' + hex + '"></span> ' +
        escapar(hex) + '</td><td>' + escapar(rgb) + '</td></tr>';
    });
    html += '</table>';
    html += '<table>' + fila('Origen',
      window.Paleta.desdeRespaldo() ? 'respaldo de js/paleta.js (el CSSOM no estaba listo)' : 'css/app.css',
      window.Paleta.desdeRespaldo() ? 'mal' : 'ok') + '</table>';

    html += '<h3>Almacenamiento</h3><table>';
    html += fila('Texto (visita)', escapar(est.motivoTexto || '—'), est.textoPersistente ? 'ok' : 'mal');
    html += fila('Binario (fotos y firmas)', escapar(est.motivoBinario || 'sin abrir todavía'),
      est.binarioPersistente ? 'ok' : 'mal');
    html += fila('Escrituras en esta sesión', window.Almacen.estado.escrituras);
    html += fila('Última escritura', escapar(est.ultimaEscritura || '—'));
    html += '<tr><th>Espacio</th><td id="diag-espacio">midiendo…</td></tr>';
    html += '</table>';

    html += '<h3>Visita en curso</h3><table>';
    if (!v) {
      html += fila('Estado', 'sin visita iniciada');
    } else {
      html += fila('Código', escapar(v.codigo || '(se asigna al confirmar el local)'));
      html += fila('Paso', escapar(v.paso));
      html += fila('Local', escapar(v.local ? v.local.nombre : '—'));
      html += fila('Jefe', escapar(v.jefe ? v.jefe.nombre : '—'));
      html += fila('Iniciada', escapar(v.iniciada));
      html += fila('Actualizada', escapar(v.actualizada));
      html += fila('Guardados automáticos', window.Visita.guardados());
      html += fila('Esquema de datos', escapar(v.esquema));
      html += fila('Versión de la app', escapar(v.version));
    }
    html += '</table>';

    html += '<h3>Entorno</h3><table>';
    html += fila('Origen', escapar(location.protocol + '//' + location.host));
    html += fila('Conexión', navigator.onLine ? 'con red' : 'sin red',
      navigator.onLine ? 'ok' : '');
    html += fila('Pantalla', window.innerWidth + ' x ' + window.innerHeight +
      ' @ ' + (window.devicePixelRatio || 1) + 'x');
    html += '</table>';

    html += '</div>';
    contenedor.innerHTML = html;

    window.Almacen.espacio().then(function (e) {
      var celda = document.getElementById('diag-espacio');
      if (!celda) return;
      celda.textContent = e ? (kb(e.usado) + ' usados de ' + kb(e.disponible)) : 'el navegador no lo informa';
    });
  }

  return { render: render, auditarVersion: auditarVersion };
})();
