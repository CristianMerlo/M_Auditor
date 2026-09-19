# RECOVERY ANALYSIS REPORT

## Generador de Informes Online

**Proyecto analizado:** Generador de Informes Online  
**Ubicación:** `/Users/CR1S714N/Documents/Repositorios GitHub/PROYECTOS/Generador de Informes online/`  
**Fecha de análisis:** 2026-09-18  
**Alcance:** Arquitectura, estética, funcionalidades, backend, PWA, PDF, firmas, analizador estadístico y reutilización en M Auditor

---

## 1. Resumen ejecutivo

El proyecto es una aplicación operativa de mantenimiento de franquicias compuesta por dos módulos funcionales:

1. **Generador de informes técnicos:** aplicación web/PWA para cargar datos de intervención, equipos, observaciones, fotografías y firmas, y exportar un PDF corporativo.
2. **Analizador estadístico:** aplicación web con backend Python que escanea PDFs, detecta locales, clasifica archivos, extrae indicadores y genera un dashboard.

La aplicación principal está implementada como un documento HTML monolítico de 575 líneas, con JavaScript inline, Tailwind CSS desde CDN, jsPDF, SignaturePad y localStorage. El analizador estadístico combina una interfaz HTML/Tailwind/Chart.js con un servidor Python estándar.

No se observaron frameworks de frontend modernos, sistema de build, bundler, gestor de dependencias local, base de datos relacional ni API autenticada.

---

## 2. Mapa de archivos

```text
Generador de Informes online/
├── index.html
├── manifest.json
├── sw.js
├── analizador_estadistico/
│   ├── index.html
│   ├── index.css
│   └── server.py
└── .git/
```

### Dependencias externas

- Tailwind CSS CDN
- jsPDF 2.5.1
- SignaturePad 4.0.0
- Chart.js CDN
- Google Fonts no utilizado en este proyecto
- Python 3 estándar
- PyMuPDF (`fitz`), `pypdf` o `PyPDF2` como dependencias opcionales de extracción PDF

---

## 3. Arquitectura de la aplicación principal

### Flujo de ejecución

```text
index.html
├── registra Service Worker
├── carga Tailwind, jsPDF y SignaturePad
├── renderiza formulario de intervención
└── JavaScript inline
    ├── inicializa firmas
    ├── carga borrador desde localStorage
    ├── sincroniza nombre/siglas/código
    ├── gestiona equipos dinámicos
    ├── procesa fotografías
    ├── calcula semáforo de agua/equipos
    └── genera PDF
```

### Capas lógicas

| Capa | Implementación |
|---|---|
| Presentación | HTML + Tailwind + CSS inline |
| Estado | localStorage |
| Catálogo de locales | array `DB_LOCALES` en JavaScript |
| Formularios | controles nativos HTML |
| Equipos dinámicos | creación DOM mediante template string |
| Firmas | SignaturePad sobre canvas |
| Imágenes | FileReader + canvas + JPEG |
| PDF | jsPDF |
| Offline | Service Worker |
| Persistencia | localStorage |

---

## 4. Módulos funcionales recuperables

### 4.1 Datos de intervención

La aplicación permite registrar:

- Fecha
- Ticket
- Nombre de sucursal
- Sigla de sistema
- Sigla de ticket
- Técnico responsable
- Tiempo de labor
- Tiempo de traslado
- Prioridad/tipo de servicio
- Código único de informe

### 4.2 Sincronización de locales

El formulario ofrece tres datalists independientes:

- Nombre del local
- Sigla de sistema
- Sigla de ticket

Al modificar cualquiera de ellos, la función `sincronizar()` busca una coincidencia completa en `DB_LOCALES` y completa los tres campos. Si no existe coincidencia, elimina los campos relacionados para evitar datos inconsistentes.

Esta función es una de las piezas más valiosas para reutilizar en M Auditor.

### 4.3 Código único de informe

`actualizarCodigoInforme()` genera un código con el formato:

```text
MF-<minutos desde 2026-01-01>-<ID local de 3 dígitos>
```

Ejemplo conceptual:

```text
MF-000123-001
```

El código:

- se genera al seleccionar un local
- mantiene el prefijo y número temporal al cambiar de local
- se guarda en el borrador
- se incluye en el PDF
- se usa como identificador visual de control

### 4.4 Calidad de agua

Campos recuperables:

- PPM post-filtrado
- Estado pendiente
- Estado de filtro
- Estado de ablandador
- Estado de ósmosis
- Observaciones de instalación hídrica

La función `evaluarJerarquia()` calcula un semáforo:

- **Verde:** sin hallazgos relevantes
- **Amarillo:** PPM >= 120 o una falla de agua
- **Rojo:** PPM > 300, PPM entre 1 y 49, dos o más fallas de agua, o equipo fuera de servicio

El estado también considera el peor estado de los equipos cargados.

### 4.5 Equipos dinámicos

`addEquipo()` crea tarjetas repetibles con:

- Modelo: Cimbali, Melitta u Otros
- Número de serie
- Cantidad de shoots
- Diagnóstico
- Trabajos realizados
- Tareas rápidas predefinidas
- Higiene del equipo
- Stock de insumos
- Pedido de repuestos
- Gastos de ferretería/insumos
- Estado final

Las tareas rápidas disponibles son:

- Limpieza grupo
- Cambio juntas
- Calibración
- Descalcificación
- Gramaje y Recetas
- Limpieza bomba leche
- Limpieza válvula ELF3
- Limpieza chicler
- Destapado desagüe

### 4.6 Registro fotográfico

El módulo de fotos:

- acepta múltiples imágenes
- limita la carga a 8 archivos
- procesa cada imagen en el navegador
- redimensiona a 800 px de ancho
- convierte a JPEG con calidad 0.7
- genera vistas previas
- conserva los data URL en memoria para incluirlos en el PDF

No persiste las imágenes en localStorage.

### 4.7 Firmas digitales

La aplicación utiliza dos canvas:

- Firma del técnico
- Firma del encargado

Cada firma puede:

- bloquearse/desbloquearse
- limpiarse
- exportarse como imagen
- insertarse en el PDF

El nombre del encargado también se guarda como texto.

### 4.8 Borrador automático

La función `saveDraft()` serializa en localStorage:

- datos principales
- equipos dinámicos
- campos de agua
- observaciones
- nombres y códigos

La función `loadDraft()` restaura el formulario y vuelve a crear los equipos guardados.

La clave utilizada es:

```text
mostaza_mtz_v12_5
```

### 4.9 Validaciones

La aplicación implementa:

- mínimo de 2 horas de labor
- mínimo de 0 horas de traslado
- bloqueo de caracteres no numéricos
- normalización de números durante la escritura
- valores predeterminados al perder foco
- confirmación para limpiar todo

### 4.10 Generación de PDF

`generarPDF()` crea un documento jsPDF con:

1. Encabezado corporativo
2. Datos de intervención
3. Calidad de agua con semáforo
4. Observaciones iniciales
5. Detalle por equipo
6. Registro fotográfico
7. Recomendaciones finales
8. Firmas
9. Página adicional de resumen para gerencia
10. Pie de página de control interno en todas las páginas
11. Nombre de archivo basado en sigla de ticket y fecha

El PDF incluye saltos de página manuales y control básico de coordenadas.

---

## 5. PWA y funcionamiento offline

### Manifest

`manifest.json` configura:

- nombre: Mostaza Mantenimiento Franquicias
- nombre corto: Informes
- pantalla standalone
- color de fondo oscuro
- color de tema naranja
- ícono SVG embebido en base64

### Service Worker

`sw.js` implementa:

- caché de `index.html` y `manifest.json`
- `skipWaiting()`
- limpieza de cachés antiguas
- estrategia Network-First
- actualización de caché cuando la respuesta HTTP es 200
- fallback a caché cuando falla la red
- `clients.claim()`

Limitación importante: los recursos externos de Tailwind, jsPDF, SignaturePad y Chart.js no están precacheados. Por lo tanto, la funcionalidad offline completa no está garantizada si el navegador nunca cargó previamente esos recursos.

---

## 6. Arquitectura del analizador estadístico

### Flujo general

```text
index.html
├── pestaña Organizador
│   ├── solicita /api/scan
│   └── solicita /api/classify
├── pestaña Estadísticas
│   ├── solicita /api/locales
│   └── solicita /api/analyze
└── renderiza KPI, alertas, tabla y gráficos

server.py
├── escanea PDFs
├── extrae texto
├── detecta local
├── clasifica y mueve archivos
├── analiza intervenciones
├── calcula estadísticas
└── sirve interfaz y API
```

### API

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/scan` | Escanea PDFs pendientes |
| POST | `/api/classify` | Clasifica y mueve archivos |
| GET | `/api/locales` | Lista carpetas de locales |
| GET | `/api/analyze` | Analiza un local y mes |

### Servidor

`server.py` utiliza:

- `http.server`
- `BaseHTTPRequestHandler`
- `HTTPServer`
- `os`
- `shutil`
- `re`
- `json`
- `urllib.parse`

El servidor escucha en el puerto `8080` por defecto y permite cambiarlo mediante argumento CLI.

### Extracción de PDF

`get_pdf_text()` intenta, en orden:

1. PyMuPDF / `fitz`
2. `pypdf`
3. `PyPDF2`

La detección de locales se realiza por:

- nombre de archivo
- sigla de sistema
- sigla de ticket
- nombre del local
- contenido textual del PDF
- expresión regular de encabezado `LOCAL:`

### Clasificación de archivos

La clasificación:

- detecta local y código
- sugiere carpeta por nombre del local
- normaliza nombres con formato `MTZ_CODIGO_FECHA.pdf`
- evita colisiones agregando sufijos
- mueve archivos con `shutil.move`
- ignora archivos no identificados

### Dashboard estadístico

El dashboard muestra:

- total de intervenciones
- falla más recurrente
- calidad de agua promedio
- técnico principal
- ranking de fallas frecuentes
- distribución por técnico
- alertas técnicas y de calidad
- historial cronológico

Los gráficos usan:

- barras para ranking de fallas
- doughnut para distribución por técnico

### Extracción de indicadores

El backend extrae:

- fecha
- ticket
- técnico
- PPM
- categorías de fallas
- resumen inicial del texto

Las categorías de fallas se detectan por palabras clave:

- chicler obstruido
- caldera con sarro/pérdida
- falla de bomba/resistencia
- muelas de café/tolvas
- leche fría/sin espuma
- calidad de agua superior a 150 PPM

---

## 7. Sistema visual

### Aplicación principal

- fondo gris claro
- header negro
- borde superior naranja Mostaza
- tarjetas blancas
- bordes laterales de colores por sección
- tipografía sans-serif nativa
- labels pequeños, negritas y mayúsculas
- controles compactos
- diseño mobile-first
- máximo de ancho de 2xl
- botones grandes de acción
- énfasis operativo

### Analizador estadístico

- fondo `#121214`
- tarjetas `#1a1a1e`
- bordes `#2a2a30`
- texto `#cdd6f4`
- acento Mostaza `#F58220`
- rojo `#C80000`
- azul para acciones estadísticas
- paleta Catppuccin para gráficos
- scrollbars personalizados
- pestañas redondeadas
- tablas con hover
- diseño oscuro y analítico

### Utilidades de impresión

El CSS del analizador incluye una estrategia de impresión que:

- cambia a fondo blanco
- oculta controles
- muestra encabezado de impresión
- ajusta tarjetas
- evita cortes de tarjetas
- fuerza colores cuando corresponde
- adapta grids

---

## 8. Funcionalidades con mayor valor para M Auditor

### Prioridad alta

1. **Sincronización nombre ↔ códigos**
2. **Generador de código único**
3. **Borrador automático en localStorage**
4. **Equipos/ítems dinámicos**
5. **Semáforo de estado**
6. **Firmas bloqueables**
7. **Generación de PDF corporativo**
8. **Resumen ejecutivo para gerencia**
9. **PWA offline**
10. **Dashboard de estadísticas**

### Prioridad media

1. Registro fotográfico
2. Tareas rápidas
3. Clasificación de PDFs
4. Extracción de datos desde PDF
5. Alertas por umbrales
6. Historial cronológico
7. Filtros por local y mes

### Prioridad baja

1. Renombrado masivo de archivos
2. Colores específicos de la marca original
3. Mensajes toast actuales
4. Textos y nombres de campos originales

---

## 9. Riesgos y limitaciones técnicas

### Seguridad

- No existe autenticación.
- No existe autorización.
- El servidor Python no valida origen ni permisos.
- El endpoint `/api/classify` puede mover archivos sin confirmación individual.
- El backend expone CORS `*`.
- La ruta base de PDFs está hardcodeada.
- La interfaz utiliza interpolación directa de datos en HTML.
- El `localStorage` no es adecuado para información sensible.
- `localStorage.clear()` borra toda el almacenamiento del origen, no solo el borrador.

### Robustez

- `index.html` concentra presentación, estado, validación, PDF y negocio.
- No hay separación real entre componentes.
- No hay tests.
- No hay control de versiones de esquema del borrador.
- No hay manejo de migraciones de datos.
- No hay debounce en eventos de entrada.
- No hay validación exhaustiva de archivos de imagen.
- No hay control de memoria para imágenes grandes.
- No hay paginación ni lazy rendering.
- No hay manejo estructurado de errores en varias funciones.
- El analizador depende de palabras clave fijas.
- La extracción de fechas y técnicos es frágil.
- La clasificación puede mover archivos incorrectamente si la detección falla.

### Portabilidad

- El servidor usa una ruta absoluta de macOS.
- Las dependencias PDF son opcionales y no están declaradas.
- No existe `requirements.txt`.
- No existe script de inicio documentado.
- Los CDN externos impiden offline real.
- No hay variables de entorno.
- No hay configuración de despliegue.

---

## 10. Recomendación de asimilación para M Auditor

Se recomienda adoptar una arquitectura modular basada en las mejores capacidades del proyecto, pero sin copiar su acoplamiento monolítico.

### Arquitectura propuesta

```text
M Auditor/
├── app/
│   ├── index.html
│   ├── styles/
│   │   ├── design-system.css
│   │   ├── components.css
│   │   └── print.css
│   ├── js/
│   │   ├── app.js
│   │   ├── state/
│   │   │   ├── storage.js
│   │   │   └── draft.js
│   │   ├── catalog/
│   │   │   ├── locations.js
│   │   │   └── synchronizer.js
│   │   ├── report/
│   │   │   ├── code-generator.js
│   │   │   ├── pdf-builder.js
│   │   │   └── summary.js
│   │   ├── equipment/
│   │   │   ├── equipment-card.js
│   │   │   └── dynamic-list.js
│   │   ├── media/
│   │   │   ├── image-compressor.js
│   │   │   └── signature.js
│   │   └── analytics/
│   │       ├── api-client.js
│   │       ├── dashboard.js
│   │       └── charts.js
│   └── assets/
├── backend/
│   ├── server.py
│   ├── pdf/
│   │   ├── extractor.py
│   │   └── classifier.py
│   ├── analytics/
│   │   └── engine.py
│   └── routes/
└── data/
    └── locales.json
```

### Decisiones recomendadas

- Mantener una interfaz operativa compacta.
- Separar catálogo, estado, renderizado y generación de PDF.
- Usar un esquema de datos versionado.
- Reemplazar interpolación HTML directa por renderizado seguro.
- Mantener firmas como canvas, pero abstraerlas en un servicio.
- Incorporar compres