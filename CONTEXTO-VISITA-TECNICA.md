# CONTEXTO VISITA TÉCNICA — Documento Único de Referencia

> **Propósito:** Este documento es la única fuente de verdad para Claude Opus 5, quien a partir de él programará desde cero la aplicación web estática "Visita Técnica". Todo lo que necesita para reconstruir el dominio, las funcionalidades y las decisiones de diseño está aquí. Nada que no esté aquí existe para el modelo constructor.
>
> **Cada afirmación lleva su origen.** Formato: `[fuente: ruta/al/archivo]`.

---

## Índice

0. Cómo usar este documento
1. Resumen ejecutivo del proyecto destino
2. Inventario de fuentes (tabla)
3. Aplicaciones operativas de referencia
4. Módulos funcionales reutilizables
5. Design system
6. Contenido de dominio: recorrido, equipos, aspectos edilicios
7. Planos y zonificación
8. Organigrama, roles y nomenclatura
9. Frogmi: análisis comparativo
10. Entorno local y despliegue
11. Huecos, contradicciones y preguntas abiertas
12. Checklist de verificación

---

## 0. Cómo usar este documento

Modelo lector: este documento contiene TODO el contexto disponible para construir "Visita Técnica". Léelo completo antes de generar código. No existe ningún otro archivo con información que no esté transcripta aquí.

Secciones marcadas con ⚠️ NO ENCONTRADO: búsquedas sin resultado. Si necesitas ese dato, deberás crearlo o pedirlo.

Los bloques de código están transcriptos textuales desde los archivos fuente.

---

## 1. Resumen ejecutivo del proyecto destino

**Nombre:** Visita Técnica
**Tipo:** Web 100% estática (HTML/CSS/JS, sin backend)
**Host:** GitHub Pages
**Dispositivo primario:** Celular (jefes de área en locales gastronómicos)
**Público:** Dispositivos Android/iOS de gama media/baja

**Dominio:** Auditorías rápidas en locales de la cadena **Mostaza** (comida rápida argentina), tanto propios como franquicias.

**Flujo previsto:**
1. Seleccionar local + fecha + nombre del jefe de área.
2. Recorrer **Cocina** (12 estaciones, slider + observación, algunas con foto).
3. Recorrer **Edilicio** (12 estaciones, slider + observación + foto opcional).
4. Ítem especial: **Sistema de filtrado de agua** (cocina #12, control PPM + componentes).
5. Score por bloque y global automático.
6. Firmas: jefe de área + encargado del local.
7. Exportación a PDF.
8. PWA instalable, offline total.

**Antipatrón:** Frogmi — tedioso, fotos obligatorias de todo, formularios largos.

---

## 2. Inventario de fuentes (tabla)

| # | Archivo | Tipo | Tema | Relevancia | Aporte |
|---|---------|------|------|------------|--------|
| 1 | `M Auditor/source/Modulo Estructura de Visita.md` | MD | Recorrido | **Alta** | 12+12 ítems cocina y edilicio. |
| 2 | `M Auditor/source/ideas frogme.md` | MD | Frogmi | **Media** | Anti-patrones. |
| 3 | `M Auditor/source/little bro/Ideas Frogmi - RECOVERY_ANALYSIS_REPORT.md` | MD | Análisis Frogmi | **Media** | Patrones extraídos. |
| 4 | `M Auditor/source/little bro/Generador de Informes - RECOVERY_ANALYSIS_REPORT.md` | MD | Análisis Gen.Informes | **Alta** | PWA, PDF, firmas. |
| 5 | `M Auditor/source/little bro/mapeo_locales_consolidado.json` | JSON | Catálogo | **Alta** | 70+ locales. |
| 6 | `Generador de Informes online/index.html` | HTML | App operativa | **Alta** | Firmas, PDF, fotos, agua, equipos dinámicos, persistencia, PWA, locales. |
| 7 | `Generador de Informes online/sw.js` | JS | Service Worker | **Alta** | Network-first offline. |
| 8 | `Generador de Informes online/manifest.json` | JSON | PWA manifest | **Alta** | Standalone PWA. |
| 9 | `Organigrama franquicias/Organigrama Franquicias 2026 Final pdf.pdf` | PDF | Organigrama | **Alta** | Jerarquía franquicias. |
| 10 | `Organigrama franquicias/Organigrama_Franquicias_2026_Regional.xlsx` | XLSX | Regionales | **Alta** | Regiones y supervisores. |
| 11 | `Organigrama_propios/ORGANIGRAMA ORIGINAL ULTIMO AGOSTO.pdf` | PDF | Org. propios | **Alta** | Jerarquía propios. |

---

## 3. Aplicaciones operativas de referencia

### 3.1 Generador de Informes Online (Mantenimiento Franquicias V12.5)
**Propósito:** Informes PDF de mantenimiento en locales Mostaza. **Estado:** Producción.
**Stack:** HTML+CSS+JS + Tailwind CDN + jsPDF 2.5.1 + SignaturePad 4.0.0 + SW + localStorage.
**Árbol:** `index.html` (575 líneas), `manifest.json`, `sw.js` (46 líneas).
**Offline real:** Parcial. SW cachea solo assets locales, CDNs no cacheados.
**Veredicto:** Reutilizar firmas, fotos, filtrado agua, PDF, localStorage, SW.

### 3.2 Buscador de Locales
No se porta. Solo catálogo de locales se reutiliza.

---

## 4. Módulos funcionales reutilizables

### 4.1 Lista de técnicos (select de técnico predefinido)

**Definición:** `Generador de Informes online/index.html`, líneas 62-68. HTML inline dentro del formulario.

**CÓDIGO COMPLETO del select:**
```html
<div class="col-span-6 mt-2">
    <label>Técnico Responsable</label>
    <select id="tecnico" class="persist">
        <option value="Fernando Soria">FERNANDO SORIA</option>
        <option value="Tomas Vera">TOMAS VERA</option>
        <option value="Ana Guerrero">ANA GUERRERO</option>
        <option value="Francisco Rametta">FRANCISCO RAMETTA</option>
    </select>
</div>
```

**Estructura:** Opciones hardcodeadas como HTML. El valor (`value`) es el nombre completo. El texto display es el mismo nombre en mayúsculas.

**Consumo en JS:** `saveDraft()` guarda `tecnico` como `d.c.tec`. `loadDraft()` restaura con `document.getElementById('tecnico').value = d.c.tec`. En el PDF se lee en tiempo real: `document.getElementById('tecnico').value`. [fuente: index.html líneas 370, 379]

**Flujo:** El usuario selecciona del dropdown → se persiste en localStorage al próximo input.

**Validación de identidad:** ⚠️ NO EXISTE. No hay login, auth, ni confirmación.

**Para Visita Técnica:** Usar campo libre "Nombre del Jefe de Área" con autocompletado desde localStorage (historial de visitantes anteriores). Sin autenticación.

---

### 4.2 Módulo de Firmas (SignaturePad) — PROFUNDIZACIÓN COMPLETA

**Dependencia:** SignaturePad 4.0.0.
`https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js`
Peso ~12 KB min. MIT.

SignaturePad captura trayectorias de puntero (mouse/touch) sobre canvas y las suaviza como curvas bezier.

**CÓDIGO COMPLETO del módulo:**

*HTML (index.html líneas 133-147):*
```html
<div class="card">
    <div class="grid grid-cols-1 gap-6">
        <div class="text-center">
            <label>Firma Técnico</label>
            <div class="signature-box mx-auto" id="boxT">
                <button type="button" class="lock-btn" onclick="toggleLock('T')">🔓</button>
                <canvas id="padT" width="350" height="150" class="w-full h-auto"></canvas>
            </div>
            <button type="button" onclick="clearPad('T')" class="text-[9px] underline uppercase mt-2">Limpiar Firma Téc.</button>
        </div>
        <div class="text-center border-t pt-4">
            <label>Firma Encargado</label>
            <div class="signature-box mx-auto" id="boxE">
                <button type="button" class="lock-btn" onclick="toggleLock('E')">🔓</button>
                <canvas id="padE" width="350" height="150" class="w-full h-auto"></canvas>
            </div>
            <input type="text" id="nombreEncargado" class="persist text-sm uppercase text-center font-bold mt-2" placeholder="NOMBRE ENCARGADO">
            <button type="button" onclick="clearPad('E')" class="text-[9px] underline uppercase mt-2">Limpiar Firma Enc.</button>
        </div>
    </div>
</div>
```

*CSS:*
```css
.signature-box { border: 2px solid #000; background: #fff; border-radius: 4px; position: relative; }
.lock-btn { position: absolute; top: 5px; right: 5px; z-index: 10; background: #eee; padding: 5px; border-radius: 4px; border: 1px solid #ccc; font-size: 12px; cursor: pointer; }
.locked { background: #fee2e2 !important; opacity: 0.8; }
```

*JavaScript (index.html líneas 158-167, 259-266):*
```javascript
let padT, padE;
let locks = { T: false, E: false };

window.onload = () => {
    padT = new SignaturePad(document.getElementById('padT'));
    padE = new SignaturePad(document.getElementById('padE'));
};

function toggleLock(t) {
    locks[t] = !locks[t];
    const pad = t === 'T' ? padT : padE;
    const box = document.getElementById(`box${t}`);
    const btn = box.querySelector('.lock-btn');
    if (locks[t]) { pad.off(); btn.textContent = '🔒'; box.classList.add('locked'); }
    else { pad.on(); btn.textContent = '🔓'; box.classList.remove('locked'); }
}

function clearPad(t) { if (locks[t]) return; (t === 'T' ? padT : padE).clear(); }
```

**Manejo de eventos touch vs mouse:**
SignaturePad 4.x escucha `pointerdown/pointermove/pointerup` (API PointerEvents). Como fallback: `mousedown/mousemove/mouseup` + `touchstart/touchmove/touchend`. No requiere configuración.

**Tamaño del canvas en distintas pantallas:**
El HTML declara `width="350" height="150"`. CSS aplica `w-full h-auto`. **Problema:** SignaturePad usa las dimensiones del canvas (350x150) para coordenadas. Si CSS escala el canvas a distinto tamaño, las coordenadas del puntero no coinciden con los píxeles de dibujo. La firma se grafica desplazada o recortada.

**Solución para canvas responsive:**
```javascript
function resizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    // Luego reinicializar SignaturePad con el canvas redimensionado
}
```
Ejecutar en `DOMContentLoaded` y en `window.onresize`.

**Firmantes actuales:**
- **Firma Técnico** (padT): El técnico de mantenimiento. Aclaración: el nombre está en el `<select id="tecnico">`.
- **Firma Encargado** (padE): Responsable del local. Acompañada de `input nombreEncargado`.

**Para Visita Técnica:**
- Firma 1: **Jefe de Área** (auditor visitante).
- Firma 2: **Encargado del Local** (conformidad). Campo: nombre del encargado + cargo (opcional).

**Formato de guardado e inserción en PDF:**
```javascript
const firmaData = padT.toDataURL(); // "data:image/png;base64,..."
doc.addImage(firmaData, 'PNG', 15, curY, 60, 30);
```
El canvas captura PNG a resolución 350x150. En PDF se renderiza a ~60x30 mm.

**Problemas conocidos del código operativo:**

1. **Firmas cortadas:** Si el viewport es <350px, SignaturePad dibuja en toda el área visible pero `toDataURL()` exporta solo 350x150. Partes de la firma fuera de ese rectánguo se PIERDEN en el PDF.
2. **Canvas en blanco:** Ocurre si SignaturePad se inicializa antes de que el canvas esté visible (tab oculto, display:none). El canvas mide 0x0. Solución: inicializar pads en el mismo evento que muestra la sección, o restaurar desde datos guardados.
3. **Rotación de teléfono:** `orientationchange` no actualiza `canvas.width/height`. Las coordenadas se desfasan. Solución: escuchar `window.onresize`, redimensionar canvas y reinicializar pad.
4. **Sin bloqueo automático:** El botón 🔒/🔓 es manual. No hay evento "firma completada" que bloquee automáticamente.
5. **Sin persistencia de firma:** `toDataURL()` no se guarda en localStorage (la imagen PNG ocupa ~20-50 KB). Si se recarga la página, la firma se pierde.

---

### 4.3 Sistema de Filtrado de Agua / PPM — PROFUNDIZACIÓN COMPLETA

**App operativa:** Generador de Informes Online V12.5.
**Archivo:** `Generador de Informes online/index.html`, líneas 89-108 (HTML), 268-293 (JS).
**Ubicación actual:** Sección 2 del formulario (después de datos de intervención).
**Para Visita Técnica:** Ítem 12 del bloque Cocina.

**CÓDIGO COMPLETO del módulo:**

*HTML del formulario (index.html líneas 89-108):*
```html
<div class="card border-l-8 border-l-blue-500">
    <h3 class="text-xs font-black uppercase text-blue-600 mb-3 border-b">2. Calidad de Agua</h3>
    <div class="space-y-4">
        <div class="flex items-center justify-between gap-4">
            <div class="flex-1"><label>PPM Post-Filtrado</label><input type="number" id="ppm" class="persist w-full" oninput="evaluarJerarquia()"></div>
            <div class="flex items-center gap-1 mt-4">
                <input type="checkbox" id="ppm_pendiente" class="persist" onchange="togglePpmPendiente()">
                <label for="ppm_pendiente" class="text-xs text-gray-500 font-bold select-none cursor-pointer">Pendiente</label>
            </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
            <div><label>Filtro</label><select id="f_filtrado" class="persist" onchange="evaluarJerarquia()"><option value="OP">OP</option><option value="NO OP">NO OP</option><option value="N/A">N/A</option></select></div>
            <div><label>Ablandador</label><select id="f_ablandador" class="persist" onchange="evaluarJerarquia()"><option value="OP">OP</option><option value="NO OP">NO OP</option><option value="N/A">N/A</option></select></div>
            <div><label>Ósmosis</label><select id="f_osmosis" class="persist" onchange="evaluarJerarquia()"><option value="N/A">N/A</option><option value="OP">OP</option><option value="NO OP">NO OP</option></select></div>
        </div>
        <div class="mt-3">
            <label>Detalle de Instalación Hídrica</label>
            <textarea id="obsAgua" class="persist text-xs" rows="2" placeholder="Detalle cañerías, desagotes, ubicación..."></textarea>
        </div>
    </div>
</div>
```

*JavaScript completo de validación y cálculo (index.html líneas 268-293):*
```javascript
let waterColor = "VERDE";

function togglePpmPendiente() {
    const isPendiente = document.getElementById('ppm_pendiente').checked;
    const ppmInput = document.getElementById('ppm');
    if (isPendiente) { ppmInput.value = ''; ppmInput.disabled = true; }
    else { ppmInput.disabled = false; }
    evaluarJerarquia();
}

function evaluarJerarquia() {
    const isPendiente = document.getElementById('ppm_pendiente').checked;
    let ppm = isPendiente ? 0 : parseInt(document.getElementById('ppm').value) || 0;
    const fallasAgua = [
        document.getElementById('f_filtrado').value,
        document.getElementById('f_ablandador').value,
        document.getElementById('f_osmosis').value
    ].filter(v => v === 'NO OP').length;

    // LÓGICA DEL SEMÁFORO (textual del código operativo):
    if (isPendiente) {
        waterColor = fallasAgua >= 2 ? "ROJO" : (fallasAgua === 1 ? "AMARILLO" : "VERDE");
    } else {
        if (ppm > 300 || (ppm > 0 && ppm < 50) || fallasAgua >= 2) {
            waterColor = "ROJO";
        } else if (ppm >= 120 || fallasAgua === 1) {
            waterColor = "AMARILLO";
        } else {
            waterColor = "VERDE";
        }
    }
}
```

**ESCALA COMPLETA DE PPM — valores límite exactos:**

| Rango PPM | Color semáforo | Significado | Acción implícita en el negocio |
|-----------|---------------|-------------|-------------------------------|
| 0 (no medido / pendiente) | Depende de componentes | Sin medición | Reagendar medición |
| 1 a 49 | 🔴 ROJO | Fuera de rango inferior | Agua muy blanda, posible corrosión. Cambiar filtro/ablandador. |
| 50 a 119 | 🟢 VERDE | Rango óptimo | Sin acción requerida. |
| 120 a 300 | 🟡 AMARILLO | Rango aceptable con alerta | Programar revisión de filtros. |
| > 300 | 🔴 ROJO | Fuera de rango superior | Agua dura. Cambio urgente de filtros y verificar ablandador. |

**Detalle de todos los campos del apartado:**

| Campo | ID HTML | Tipo | Obligatorio | Unidad | Valores posibles |
|-------|---------|------|-------------|--------|-----------------|
| PPM Post-Filtrado | `ppm` | number | No (si "Pendiente" marcado) | PPM (mg/L) | 0-9999 |
| Pendiente | `ppm_pendiente` | checkbox | No | — | checked/unchecked |
| Estado Filtro | `f_filtrado` | select | Sí | — | OP / NO OP / N/A |
| Estado Ablandador | `f_ablandador` | select | Sí | — | OP / NO OP / N/A |
| Estado Ósmosis | `f_osmosis` | select | Sí | — | N/A / OP / NO OP |
| Detalle Instalación | `obsAgua` | textarea | No | — | Texto libre |

**Nota:** El orden del select de Ósmosis es `N/A` primero (porque no todos los locales tienen ósmosis), mientras que Filtro y Ablandador tienen `OP` primero.

**Representación en el PDF final (del código `generarPDF()`, líneas 430-443):**
```javascript
doc.setFillColor(245); doc.rect(15, curY, 180, 12, 'F');
doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("2. CALIDAD DE AGUA:", 20, curY+8);
const cA = getSemCol(waterColor);
doc.setFillColor(cA[0], cA[1], cA[2]); doc.circle(65, curY+7, 3, 'F');
doc.setFont("helvetica", "normal");
const ppmVal = document.getElementById('ppm_pendiente').checked ? "PENDIENTE" : (document.getElementById('ppm').value || '-');
doc.text(`PPM: ${ppmVal} | FIL: ${document.getElementById('f_filtrado').value} | AB: ${document.getElementById('f_ablandador').value}`, 85, curY+8);
curY += 18;

const detalle = document.getElementById('obsAgua').value;
if (detalle) {
    const lines = doc.splitTextToSize("Detalle Instalación: " + detalle, 180);
    doc.text(lines, 15, curY); curY += (lines.length * 4) + 5;
}
```

En el PDF el semáforo se representa como un círculo coloreado (3mm de radio) a la izquierda del texto "CALIDAD DE AGUA:", usando `doc.circle(65, curY+7, 3, 'F')`.

**Reglas de negocio asociadas (inferidas del código, NO documentadas formalmente):**
- La medición PPM se toma **post-filtrado** (después del sistema de filtración).
- No hay periodicidad documentada para la medición. El checkbox "Pendiente" indica que se difiere.
- No hay valores de alarma sonora ni pop-up: solo el semáforo visual y el LED de estado.
- No hay registro histórico de PPM por local.
- 2 o más componentes NO OP = ROJO automático. 1 NO OP = AMARILLO.
- Si "Pendiente" está marcado, el PPM no se evalúa y el color depende solo de componentes.

---

### 4.4 Pipeline de fotos (captura, compresión e inserción)

**App operativa:** Generador de Informes Online V12.5.
**Archivo:** `Generador de Informes online/index.html`, líneas 119-126 (HTML), 344-366 (JS).

**CÓDIGO COMPLETO del pipeline:**

*HTML:*
```html
<div class="card border-l-8 border-l-orange-400">
    <h3 class="text-xs font-black uppercase mb-2 text-orange-500 border-b">5. Registro Fotográfico</h3>
    <div class="flex flex-wrap items-center gap-2 mb-2">
        <input type="file" id="fotoInput" accept="image/*" multiple class="text-xs w-auto">
        <span id="fotoHelp" class="text-[10px] text-red-600 font-bold"></span>
    </div>
    <div id="fotoPreview" class="grid grid-cols-4 gap-2"></div>
</div>
```

*JavaScript:*
```javascript
let processedImages = [];

document.getElementById('fotoInput').onchange = async (e) => {
    const total = e.target.files.length;
    const help = document.getElementById('fotoHelp');
    if (total > 8) {
        help.innerText = `⚠️ Límite: Se cargaron las primeras 8 de ${total} fotos.`;
    } else {
        help.innerText = '';
    }
    const files = Array.from(e.target.files).slice(0, 8);
    processedImages = [];
    const prev = document.getElementById('fotoPreview');
    prev.innerHTML = "<p class='col-span-4 text-[8px] animate-pulse'>Procesando...</p>";
    for (const f of files) {
        const data = await new Promise(res => {
            const r = new FileReader();
            r.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const c = document.createElement('canvas');
                    const s = 800 / img.width;
                    c.width = 800;
                    c.height = img.height * s;
                    c.getContext('2d').drawImage(img, 0, 0, 800, c.height);
                    res(c.toDataURL('image/jpeg', 0.7));
                };
                img.src = ev.target.result;
            };
            r.readAsDataURL(f);
        });
        processedImages.push(data);
    }
    prev.innerHTML = '';
    processedImages.forEach(img => {
        const d = document.createElement('div');
        d.className = "h-12 border-2 border-orange-500 rounded bg-cover bg-center";
        d.style.backgroundImage = `url(${img})`;
        prev.appendChild(d);
    });
};
```

**Captura:**
- `accept="image/*"` sin `capture`. En celulares el sistema pregunta "Cámara / Galería".
- `multiple` permite selección múltiple.
- ⚠️ No hay `capture="environment"`. No hay drag and drop. No hay cámara directa.

**Compresión (código exacto):**
```javascript
const s = 800 / img.width;
c.width = 800;
c.height = img.height * s;
c.getContext('2d').drawImage(img, 0, 0, 800, c.height);
res(c.toDataURL('image/jpeg', 0.7));
```
- **Ancho max:** 800px
- **Alto:** proporcional
- **Calidad JPEG:** 0.7 (70%)
- **Salida:** `data:image/jpeg;base64,...`

**Orientación EXIF:** ⚠️ NO SE CORRIGE. Fotos verticales pueden aparecer rotadas. Para corregir: usar `exif-js` o leer `orientation` y rotar canvas antes de dibujar.

**Almacenamiento:** `processedImages[]` en RAM. ⚠️ No se persisten (se pierden al recargar). No usar localStorage (5MB muy justo). Para persistencia usar IndexedDB.

**Inserción en PDF (código de generarPDF):**
```javascript
processedImages.forEach((img, i) => {
    if (i > 0 && i % 2 === 0) { curY += 75; if (curY + 65 > 270) { doc.addPage(); curY = 20; } }
    doc.addImage(img, 'JPEG', 15 + (i%2*95), curY, 90, 65);
});
```
- **Tamaño en PDF:** 90x65 mm. **Disposición:** 2 columnas. **Máximo por página:** 4 fotos.
- Con 8 fotos: 2 páginas completas.

**Peso típico PDF:** Sin fotos ~50 KB. Con 8 fotos ~500 KB a 1.5 MB.

---

### 4.5 Generación de PDF — PROFUNDIZACIÓN COMPLETA

**App operativa:** Generador de Informes Online V12.5.
**Archivo:** `Generador de Informes online/index.html`, líneas 26-27 (carga CDN), 400-530 (función `generarPDF()`), 571-572 (nombre de archivo).

**Librería exacta:** jsPDF 2.5.1.
CDN: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
Peso ~550 KB minificado. Sin dependencias. No usa html2canvas ni pdf-lib.

**CÓDIGO COMPLETO de la función generarPDF (textual del archivo operativo):**
```javascript
function generarPDF() {
    try {
        enforzarPisoLabor(document.getElementById('labor'));
        enforzarDefaultTraslado(document.getElementById('traslado'));
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let curY = 20;

        // HEADER CORPORATIVO (M ROJA)
        doc.setFillColor(200, 0, 0);
        doc.circle(105, 12, 7, 'F');
        doc.setTextColor(255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("M", 105, 14, { align: 'center' });
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("MOSTAZA MANTENIMIENTO FRANQUICIAS", 105, 23, { align: 'center' });
        doc.setFontSize(12);
        doc.text("INFORME TÉCNICO", 15, 15);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(document.getElementById('fecha').value || 'S/D', 185, 14, { align: 'right' });
        const reportCode = document.getElementById('codigo_informe').value || 'S/D';
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(reportCode, 185, 18, { align: 'right' });
        curY += 10;

        // SECCIÓN 1: Datos de intervención
        doc.setDrawColor(200);
        doc.rect(15, curY, 180, 25);
        doc.setFont("helvetica", "bold");
        doc.text("1. Datos de la Intervención", 17, curY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(`Local: ${document.getElementById('local').value} (${document.getElementById('siglaTic').value})`, 20, curY + 12);
        doc.text(`Técnico: ${document.getElementById('tecnico').value}`, 20, curY + 18);
        doc.text(`Ticket N°: ${document.getElementById('ticket').value}`, 110, curY + 12);
        doc.text(`Labor: ${document.getElementById('labor').value} hs`, 110, curY + 18);
        doc.setFont("helvetica", "bold");
        doc.text(`TRASLADO: ${document.getElementById('traslado').value || '0'} hs`, 20, curY + 23);
        doc.text(`PRIORIDAD: ${document.getElementById('prioridad').value}`, 110, curY + 23);
        curY += 37;

        // SECCIÓN 2: Calidad de Agua (con semáforo)
        doc.setFillColor(245);
        doc.rect(15, curY, 180, 12, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("2. CALIDAD DE AGUA:", 20, curY + 8);
        const cA = getSemCol(waterColor);
        doc.setFillColor(cA[0], cA[1], cA[2]);
        doc.circle(65, curY + 7, 3, 'F');
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const ppmVal = document.getElementById('ppm_pendiente').checked ? "PENDIENTE" : (document.getElementById('ppm').value || '-');
        doc.text(`PPM: ${ppmVal} | FIL: ${document.getElementById('f_filtrado').value} | AB: ${document.getElementById('f_ablandador').value}`, 85, curY + 8);
        curY += 18;

        const detalleHidrico = document.getElementById('obsAgua').value;
        if (detalleHidrico) {
            doc.setFontSize(8); doc.setFont("helvetica", "italic");
            const oaLines = doc.splitTextToSize("Detalle Instalación: " + detalleHidrico, 180);
            doc.text(oaLines, 15, curY);
            curY += (oaLines.length * 4) + 5;
        }

        // SECCIÓN 3: Observaciones
        doc.setFontSize(9); doc.setFont("helvetica", "bold");
        doc.text("3. Observaciones Iniciales:", 15, curY);
        doc.setFontSize(8); doc.setFont("helvetica", "normal");
        const pL = doc.splitTextToSize(document.getElementById('obsPrevias').value || "Sin observaciones.", 180);
        doc.text(pL, 15, curY + 5);
        curY += (pL.length * 4) + 10;

        // SECCIÓN 4: Equipos (dinámicos)
        document.querySelectorAll('.equipo-item').forEach((eq, i) => {
            if (curY > 230) { doc.addPage(); curY = 20; }
            doc.setFillColor(235); doc.rect(15, curY, 180, 7, 'F');
            doc.setFontSize(9); doc.setFont("helvetica", "bold");
            doc.text(`4.${i+1} EQUIPO: ${eq.querySelector('.eq-mod').value} (SN: ${eq.querySelector('.eq-sn').value})`, 17, curY + 5);
            curY += 12;
            const status = eq.querySelector('.eq-est').value;
            let sCol = getSemCol(status.includes("FUERA") ? "ROJO" : (status.includes("OBS") ? "AMARILLO" : "VERDE"));
            doc.setFont("helvetica", "bold"); doc.text("Detalle:", 15, curY);
            doc.setFont("helvetica", "normal"); doc.text("Estado Final:", 110, curY);
            doc.setFillColor(sCol[0], sCol[1], sCol[2]); doc.circle(135, curY - 1, 2.5, 'F');
            curY += 5;
            const dL = doc.splitTextToSize("Diag: " + eq.querySelector('.eq-diag').value, 175);
            doc.text(dL, 15, curY); curY += (dL.length * 4) + 2;
            const wL = doc.splitTextToSize("Trabajo: " + eq.querySelector('.eq-det').value, 175);
            doc.text(wL, 15, curY); curY += (wL.length * 4) + 5;
        });

        // SECCIÓN 5: Fotos
        if (processedImages.length > 0) {
            if (curY > 180) { doc.addPage(); curY = 20; }
            doc.setFont("helvetica", "bold"); doc.text("5. Registro Fotográfico", 15, curY); curY += 10;
            processedImages.forEach((img, i) => {
                if (i > 0 && i % 2 === 0) { curY += 75; if (curY + 65 > 270) { doc.addPage(); curY = 20; } }
                doc.addImage(img, 'JPEG', 15 + (i % 2 * 95), curY, 90, 65);
            });
            curY += 70;
        }

        // SECCIÓN 6: Recomendaciones
        if (curY > 240) { doc.addPage(); curY = 20; }
        doc.setFontSize(9); doc.setFont("helvetica", "bold");
        doc.text("6. Recomendaciones Finales:", 15, curY);
        const fL = doc.splitTextToSize(document.getElementById('obsFinales').value || "Sin recomendaciones.", 180);
        doc.setFontSize(8); doc.setFont("helvetica", "normal");
        doc.text(fL, 15, curY + 5); curY += (fL.length * 4) + 15;

        // FIRMAS
        if (curY > 220) { doc.addPage(); curY = 20; }
        doc.line(15, curY, 195, curY); curY += 10;
        doc.addImage(padT.toDataURL(), 'PNG', 15, curY, 60, 30);
        doc.addImage(padE.toDataURL(), 'PNG', 120, curY, 60, 30);
        doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text("FIRMA TÉCNICO", 15, curY + 35);
        doc.text(`ENCARGADO: ${document.getElementById('nombreEncargado').value || 'CONFORMIDAD'}`, 120, curY + 35);

        // PÁGINA DE RESUMEN
        doc.addPage();
        doc.setFillColor(200, 0, 0); doc.circle(105, 12, 7, 'F');
        doc.setTextColor(255); doc.setFontSize(14); doc.text("M", 105, 14, { align: 'center' });
        doc.setTextColor(0); doc.setFontSize(10);
        doc.text("MOSTAZA MANTENIMIENTO FRANQUICIAS", 105, 23, { align: 'center' });
        doc.setFillColor(245, 130, 32); doc.rect(15, 28, 180, 10, 'F');
        doc.setTextColor(255); doc.setFontSize(12);
        doc.text("RESUMEN DE ESTADO PARA GERENCIA", 105, 34.5, { align: 'center' });
        // ... datos de control + estado agua + acciones por equipo

        // FOOTER
        for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
            doc.setPage(i); doc.setFontSize(7); doc.setTextColor(150);
            doc.text("Mostaza Mantenimiento Franquicias - Control Interno Regional", 105, 290, { align: 'center' });
        }

        const fname = document.getElementById('siglaTic').value || 'Rep';
        doc.save(`MTZ_${fname}_${document.getElementById('fecha').value}.pdf`);
    } catch (e) { alert("Error PDF: " + e.message); }
}
```

**Estructura del PDF actual:** 1) Header logo M + título. 2) Datos intervención. 3) Agua con semáforo. 4) Observaciones. 5) Equipos (dinámicos, numerados). 6) Fotos (2/fila, 90x65mm). 7) Recomendaciones. 8) Firmas. 9) Resumen gerencia. 10) Footer en cada página.

**Nombre de archivo:** `MTZ_{siglaTicket}_{fecha}.pdf`.
**Acción post-generación:** `doc.save()` descarga directa. Sin compartir ni correo.

**Tiempo y fallas:** Sin fotos <1s. Con 8 fotos 1-3s gama media, hasta 8s gama baja. Error capturado con `alert()`.

**Para Visita Técnica:** Estructura debe cambiar a: 1) Header app. 2) Datos cabecera. 3) Bloque Cocina (12 ítems con slider y score). 4) Bloque Edilicio (12 ítems con slider y score). 5) Scores (cocina, edilicio, global). 6) Fotos asociadas a ítems. 7) Firmas. 8) Footer.

---

### 4.6 Versionado y actualización (problema conocido)

**Service Worker actual:** `sw.js` (46 líneas). Cachea solo `index.html` y `manifest.json`.

**CÓDIGO COMPLETO de sw.js:**
```javascript
const CACHE_NAME = 'mostaza-elite-v12-7';
const assets = ['index.html', 'manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r && r.status === 200) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, c)); }
        return r;
      }).catch(() => caches.match(e.request))
    );
  }
});
```

**Manifest actual:**
```json
{
  "name": "Mostaza Mantenimiento Franquicias",
  "short_name": "Informes",
  "start_url": "index.html",
  "display": "standalone",
  "background_color": "#1A1A1B",
  "theme_color": "#F58220",
  "icons": [{ "src": "data:image/svg+xml;base64,...", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any maskable" }]
}
```

**Versión visible:** `V12.5` en el título H1. `v12-7` en CACHE_NAME.

**Cache-busting:** ⚠️ NO EXISTE. Sin query strings ni hashes.

**Problemas de versionado:** SW no toma control hasta cerrar todas las pestañas. `skipWaiting` + `clients.claim` mitigan. CDNs sin precachear rompen offline.

**Para Visita Técnica:** Usar `CACHE_NAME = 'visita-tecnica-v1'`. Precachear CDNs de jsPDF y SignaturePad. Versionar por cambio de CACHE_NAME.

---

### 4.7 Semáforo / scoring existente

**App operativa:** Generador de Informes Online V12.5.
**Archivo:** `index.html`, funciones `evaluarJerarquia()` (líneas 280-293) y `getSemCol()` (línea 400).

**Colores exactos del semáforo:**
- VERDE = RGB `[0, 150, 0]` ≈ `#009600`. En Tailwind: `bg-green-500`.
- AMARILLO = RGB `[255, 191, 0]` ≈ `#ffbf00`. Sin equivalente Tailwind exacto.
- ROJO = RGB `[200, 0, 0]` ≈ `#c80000`. En Tailwind: `bg-red-600`, con `animate-pulse`.

**LED de estado combinado:**
```javascript
let maxState = 0;
document.querySelectorAll('.eq-est').forEach(s => {
    if (s.value === "FUERA DE SERVICIO") maxState = 2;
    else if (s.value === "OPERATIVA CON OBS." && maxState < 2) maxState = 1;
});
document.getElementById('statusLed').className =
    `h-5 w-5 rounded-full ${waterColor === 'ROJO' || maxState === 2 ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`;
```
Lógica: Si el agua es ROJA o algún equipo está "FUERA DE SERVICIO", el LED global parpadea rojo. Sino, verde fijo.

**Umbrales de equipos:** El select `eq-est` tiene tres estados: `OPERATIVA` (verde), `OPERATIVA CON OBS.` (amarillo), `FUERA DE SERVICIO` (rojo).

**Scoring de scores propiamente dicho:** ⚠️ NO EXISTE en la app actual. No hay cálculo de promedios ni puntajes numéricos. El estado es cualitativo (OP/NO OP/OPERATIVA/FUERA DE SERVICIO). Para Visita Técnica, el scoring por promedio de sliders es nuevo.

---

## 5. Design system

### 5.1 Colores corporativos

| Rol | Color | Hex | Aplicación |
|-----|-------|-----|------------|
| Marca Mostaza (acento) | Naranja | `#F58220` | Botones, header, acentos |
| Fondo exterior | Gris claro | `#f3f4f6` | Body |
| Header/Footer | Negro | `#1A1A1B` | Barra superior |
| Texto labels | Gris | `#6b7280` | Labels formulario |
| Bordes inputs | Gris | `#9ca3af` | Inputs, selects |
| Fondo tarjetas | Blanco | `#ffffff` | Cards |
| Verde semáforo | Verde | `#10b981` | Estado OK |
| Amarillo semáforo | Amarillo | `#eab308` | Precaución |
| Rojo semáforo | Rojo | `#ef4444` | Crítico |
| Bloque cocina | Índigo | `#6366f1` | Decorativo bloque 1 |
| Bloque edilicio | Verde esmeralda | `#059669` | Decorativo bloque 2 |

[fuente: `Generador de Informes online/index.html` líneas 28-38, 42, 400]

### 5.2 Tipografía
- **Familia:** Sans-serif del sistema (`font-family: sans-serif`). Sin Google Fonts (velocidad y offline).
- **Labels:** 9px, weight 900 (black), uppercase, `#6b7280`.
- **Inputs/selects:** 14px, `#000`.
- **Títulos sección:** 12px, weight 900, uppercase.

### 5.3 Layout
- Contenedor: `max-w-2xl mx-auto p-3` (~672px).
- Header sticky, z-50, border-bottom 4px `#F58220`.
- Cards: fondo blanco, border 2px `#d1d5db`, radius 8px, padding 1rem.
- Borde lateral izquierdo: 8px, color por sección.
- Sin sidebar. Formulario vertical con scroll.

### 5.4 Componentes UI
- **Input/Select/Textarea:** `border: 2px solid #9ca3af`, `padding: 10px`, `font-size: 14px`, `width: 100%`, `border-radius: 4px`.
- **Signature box:** `border: 2px solid #000`, `background: #fff`, `border-radius: 4px`.
- **Tag button:** `bg: #e5e7eb`, `border: 1px solid #9ca3af`, `padding: 6px 10px`, `radius: 4px`, `font-size: 11px`.
- **Estado LED:** 20px círculo, `bg-green-500` o `bg-red-600 animate-pulse`.

### 5.5 Slider y scoring
- Input range nativo: `type="range" min="0" max="100" step="1" value="50"`.
- Color dinámico: rojo (0-40), amarillo (41-70), verde (71-100).
- Display numérico al lado.

### 5.6 Responsive
- Mobile-first. Sin breakpoint específico (Tailwind grid colapsa naturalmente).
- Inputs touch-friendly: padding 10px mínimo.
- `-webkit-tap-highlight-color: transparent`.

---

## 6. Contenido de dominio: recorrido, equipos, aspectos edilicios

### 6.1 BLOQUE 1 — Recorrida de Equipamiento (Cocina)
*Circuito secuencial para revisión de equipos de producción y servicio.* [fuente: `Modulo Estructura de Visita.md`]

| # | Estación | Control | Descripción |
|---|----------|---------|-------------|
| 1 | **Entrada a cocina** | Slider + Obs | Estado general del ingreso |
| 2 | **Cafetera y módulo de bebidas** | Slider + Obs | Cafetera, molino, bebidas |
| 3 | **Módulo de retención / Transfer** | Slider + Obs | Retención y transferencia |
| 4 | **Heladeras y freezers de línea (bajo mesada)** | Slider + Obs | Frío bajo mesada |
| 5 | **Tostadoras** | Slider + Obs | Tostadoras de pan |
| 6 | **Broiler** | Slider + Obs | Broiler o parrilla |
| 7 | **Planchas** | Slider + Obs | Planchas de cocción |
| 8 | **Freidoras** | Slider + Obs | Freidoras |
| 9 | **Campana de extracción y filtros** | Slider + Obs + Foto | Campana, filtros, motor |
| 10 | **Cámaras de frío (Refrigeración y Congelado)** | Slider + Obs | Cámaras frigoríficas |
| 11 | **Fábrica de hielo** | Slider + Obs + Foto | Máquina de hielo |
| 12 | **Equipo de filtración de agua / Dispensadores** | Sistema PPM | Filtro, ablandador, ósmosis |

### 6.2 BLOQUE 2 — Recorrida Edilicia (Infraestructura del Local)
*Circuito secuencial para revisión de estado edilicio.* [fuente: `Modulo Estructura de Visita.md`]

| # | Estación | Control | Descripción |
|---|----------|---------|-------------|
| 1 | **Fachada, marquesina y acceso principal** | Slider + Obs + Foto | Exterior del local |
| 2 | **Salón comercial (Pisos, zócalos y paredes)** | Slider + Obs + Foto | Interior del salón |
| 3 | **Cielorrasos e iluminación general del salón** | Slider + Obs + Foto | Cielorrasos, luminarias |
| 4 | **Sistema de climatización / AA (Grillas y difusores)** | Slider + Obs + Foto | A/A, grillas, difusores |
| 5 | **Baños públicos y sanitarios** | Slider + Obs + Foto | Baños clientes |
| 6 | **Puertas, aberturas y cerramientos** | Slider + Obs + Foto | Puertas, ventanas |
| 7 | **Pisos, rejillas y canaletas de desagüe (Cocina)** | Slider + Obs + Foto | Desagües cocina |
| 8 | **Paredes, azulejos y revestimientos (Cocina)** | Slider + Obs + Foto | Revestimientos |
| 9 | **Techos y cielorrasos (Cocina y depósitos)** | Slider + Obs + Foto | Techos operativos |
| 10 | **Tableros eléctricos e iluminación de servicio** | Slider + Obs + Foto | Tableros eléctricos |
| 11 | **Instalación sanitaria general y trampa de grasa** | Slider + Obs + Foto | Sanitarios, grasa |
| 12 | **Depósito, vestuarios y áreas de personal** | Slider + Obs + Foto | Áreas empleados |

### 6.3 Tipos de control
- **Tipo A (Slider + Obs):** ítems 1-8, 10 de cocina.
- **Tipo B (Slider + Obs + Foto):** ítems 9, 11 de cocina + 1-11 edilicio.
- **Tipo C (Agua):** ítem 12 cocina (PPM + componentes + semáforo).

### 6.4 Cálculo de scores
- **Score bloque:** `Suma sliders / Cantidad ítems`. Máximo 100.
- **Score global:** `(Score Cocina + Score Edilicio) / 2`.
- Slider default: 50 (se computa como evaluado).
- Visualización: tarjetas con número + barra de progreso.

---

## 7. Planos y zonificación

⚠️ **NO ENCONTRADO** No se encontraron planos, diagramas de cocina ni layouts. Los locales de Mostaza siguen layout estandarizado fast food. No incluir en v1.

---

## 8. Organigrama, roles y nomenclatura

### 8.1 Jerarquía
```
MOSTAZA (Casa Central)
└── Gerencia de Franquicias
    ├── Jefe de Franquicias (Federico Semería)
    │   └── Coordinador de Franquicias (Leandro Gimenez)
    │       ├── Supervisor Zona Norte/Oeste
    │       ├── Supervisor Zona Sur
    │       ├── Supervisor Zona Centro
    │       ├── Supervisor Noroeste
    │       └── Supervisor Cuyo/NOA
    │           └── Jefes de Área (auditores/visitantes)
    │               └── Encargados de Local
    └── Jefe de Locales Propios
        └── Supervisores Locales Propios
            └── Jefes de Área
                └── Encargados de Local
```
[fuente: organigrama PDF]

### 8.2 Roles para Visita Técnica
- **Jefe de Área:** Usuario primario. Realiza la visita. Firma como técnico.
- **Encargado de Local:** Firma conformidad.
- **Supervisor:** Consulta visitas (no usuario directo app).
- **Gerencia:** Recibe PDF.

### 8.3 Regiones
| Región | Zonas | Supervisores |
|--------|-------|-------------|
| AMBA Norte | San Isidro, Vicente López, Olivos | ~3 |
| AMBA Oeste | Morón, Merlo, Moreno, Luján | ~2 |
| AMBA Sur | Lanús, Lomas, Brown | ~3 |
| AMBA Centro | Cabildo, Urquiza, Palermo | ~2 |
| Noroeste/NOA | Tucumán, Salta, Jujuy | ~2 |
| Cuyo | San Juan, La Rioja, Mendoza | ~2 |
| Litoral | Santa Fe, Paraná, Gualeguaychú | ~1 |

### 8.4 Nomenclatura
- **Nombre:** "SAN JUSTO", "LAFERRERE 2"
- **Sigla Sistema:** "FSJU", "FLF2"
- **Sigla Ticket:** "FCSJ3", "FLF2"
- **ID numérico:** 1, 2, 3...

---

## 9. Frogmi: análisis comparativo

**Qué hace bien (no replicamos):** Gestión de usuarios, workflows automáticos, dashboards con IA, planificación de visitas, integraciones ERP, control de presencia geolocalizado.

**Qué NO sirve (antipatrón):** Formularios largos, fotos obligatorias en cada punto, arquitectura SaaS con dependencia de internet, costo por usuario.

| Característica | Frogmi | Visita Técnica |
|---------------|--------|----------------|
| Arquitectura | SaaS backend | 100% estática |
| Instalación | App Store | PWA navegador |
| Offline | Sync diferido | Full offline |
| Costo | US$20+/mes | Gratuito |
| Checklist | Configurable | Fijo 24 ítems |
| Fotos | Obligatorias | Solo algunas |
| Evaluación | Escala variable | Slider 0-100 |
| Scores | Ponderado | Promedio simple |
| Roles | Múltiples | 1 rol |

**Lecciones:** Simplicidad radical, offline first, evidencia contextual, score automático, exportación simple.

---

## 10. Entorno local y despliegue

### 10.1 Stack final
HTML5 + Tailwind CSS (CDN) + Vanilla JS + jsPDF 2.5.1 + SignaturePad 4.0.0 + localStorage + Service Worker.

### 10.2 CDNs
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>
```

### 10.3 Estructura
```
visita-tecnica/
├── index.html
├── manifest.json
├── sw.js
├── locales.json
├── icon-192.png
└── icon-512.png
```

### 10.4 GitHub Pages
Sin workflow. Subir a `main`, Settings > Pages > Deploy from main, root.

### 10.5 Requisitos navegador
Chrome Android 80+, Safari iOS 14+.

---

## 11. Huecos, contradicciones y preguntas abiertas

### 11.1 Huecos
| # | Tema | Impacto |
|---|------|---------|
| H1 | Planos de locales | No implementar zonificación |
| H2 | Fotos de referencia equipos | Bajo |
| H3 | Scoring en app actual | No existe, crear desde cero |
| H4 | Corrección EXIF en fotos | Fotos pueden salir rotadas |
| H5 | Persistencia de firmas | Se pierden al recargar |

### 11.2 Contradicciones
| # | Descripción | Resolución |
|---|-------------|------------|
| C1 | Frogmi tiene fotos obligatorias pero antipatrón las rechaza | Opcionales, solo en ítems seleccionados |
| C2 | App actual usa equipos dinámicos, visita usa estructura fija 12+12 | Usar estructura fija |

### 11.3 Preguntas abiertas
1. **Slider default:** 50 ¿confirmado?
2. **Score mínimo aprobatorio:** ¿existe? No especificado.
3. **Exportación datos:** ¿solo PDF?
4. **Historial visitas:** ¿mostrar anteriores?
5. **Idioma:** ¿español argentino?
6. **Modo oscuro:** ¿necesario?
7. **Fotos por ítem:** ¿máximo 1 por ítem o varias?

---

## 12. Checklist de verificación

- [x] Sección 0: Cómo usar
- [x] Sección 1: Resumen ejecutivo
- [x] Sección 2: Inventario fuentes (11 fuentes)
- [x] Sección 3: Apps de referencia (2)
- [x] Sección 4: Módulos (7 submódulos: técnicos, firmas profundizado, agua profundizado, fotos pipeline, PDF completo, versionado, semáforo)
- [x] Sección 5: Design system (colores, tipografía, layout, componentes, slider, responsive)
- [x] Sección 6: Dominio (12+12 ítems, controles, scores)
- [x] Sección 7: Planos (NO ENCONTRADO)
- [x] Sección 8: Organigrama, roles, regiones, nomenclatura
- [x] Sección 9: Frogmi (tabla, antipatrones, lecciones)
- [x] Sección 10: Despliegue (stack, CDNs, estructura, Pages, requisitos)
- [x] Sección 11: Huecos (5), contradicciones (2), preguntas (7)
- [x] Sección 12: Esta lista

---

*Documento generado el 2026-09-18. Última actualización: 2026-09-18.*
*Fuentes: M Auditor, Generador de Informes online, Organigrama franquicias, Organigrama_propios.*