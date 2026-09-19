# DOMINIO VISITA TÉCNICA

> Documento de dominio, cero código. Destinado a Claude Opus 5, que a partir de él programa la aplicación web estática "Visita Técnica".
> No tiene acceso a ningún otro archivo. Si algo no está escrito acá, para él no existe.

---

## Índice

1. Identificación de locales
2. Jefes de área
3. Recorrido de cocina
4. Recorrido edilicio
5. Sistema de filtrado de agua
6. Checklists y otros controles
7. Estructura del informe PDF
8. Identidad visual
9. Nomenclatura interna
10. Lecciones de las herramientas actuales
11. Contradicciones y huecos

---

## 1. Identificación de locales

Cada local tiene tres identificadores. Los tres son necesarios porque conviven en distintos sistemas internos de la empresa:

| Nombre del local | Sigla sistema | Sigla ticket | Tipo |
|------------------|---------------|--------------|------|
| VILLA DEL PARQUE | FVDP | FVDP | Franquicia |
| SAN JUSTO | FSJU | FCSJ3 | Franquicia |
| LAFERRERE 2 | FLF2 | FLF2 | Franquicia |
| RAMOS | FMRAM | FMRAM | Franquicia |
| EZEIZA | FEZE | FEZEA | Franquicia |
| CANNING | FMCAN | FMCAN | Franquicia |
| MONTEGRANDE | FMGD | FMGRA | Franquicia |
| ZARATE | FZAR | FMZAR | Franquicia |
| GUALEGUAYCHU | FMGUA | FMGUA | Franquicia |
| CABILDO | FCAB | FCABI | Franquicia |
| CABILDO 2 | FMCYM | FMCYM | Franquicia |
| GUEMES | FGUE | FGUE | Franquicia |
| URQUIZA | FURQ | FMURQ | Franquicia |
| PALMAS PILAR | FPPI | FPMPI | Franquicia |
| SAN ISIDRO | FSIS | FMSIS | Franquicia |
| LA RIOJA | FMRVP | FMRVP | Franquicia |
| CATAMARCA | FCAT | FMCAT | Franquicia |
| F. ALVAREZ | FFRA | FFRA | Franquicia |
| MORENO | FMORE | FMMRE | Franquicia |
| LUJAN | FLUJ | FLUJA | Franquicia |
| SAN MARTIN 2 | FMSVP | FMSVP | Franquicia |
| SAN MARTIN AUTO | FSMA | F3DF | Franquicia |
| SAN JUAN | FSJN | FSJUA | Franquicia |
| SAN JUAN 2 | FSJ2 | FMSJ2 | Franquicia |
| CORDOBA | FMCBA | FMCBA | Franquicia |
| BARILOCHE | FBARI | FBARI | Franquicia |
| NEUQUEN | FNEU | FNEU | Franquicia |
| COMODORO | FCOM | FCOM | Franquicia |
| ROSARIO | FROSA | FROSA | Franquicia |
| SANTA FE | FSFE | FSFE | Franquicia |
| PARANA | FPAR | FPAR | Franquicia |
| POSADAS | FPOS | FPOS | Franquicia |
| CORRIENTES | FCORR | FCORR | Franquicia |
| RESISTENCIA | FRES | FRES | Franquicia |
| FORMOSA | FFORM | FFORM | Franquicia |
| SGO DEL ESTERO | FSDE | FSDE | Franquicia |
| SALTA | FSAL | FSAL | Franquicia |
| JUJUY | FJUJ | FJUJ | Franquicia |
| TUCUMAN 2 | FTU2 | FMTCM | Franquicia |
| TUCUMAN 3 | FTU3 | FMTM2 | Franquicia |
| TUCUMAN 4 | FTU4 | FMTU4 | Franquicia |
| TUCUMAN 5 | FTC5 | FTC5 | Franquicia |
| TUCUMAN 6 | FTC6 | FMTU6 | Franquicia |
| TUCUMAN 7 | FMTU7 | FMTU7 | Franquicia |
| TUCUMAN 8 | FTC8 | FMTC8 | Franquicia |
| PORTAL TUCUMAN | MPT | MPT | Franquicia |
| TUCUMAN 9 | FMTU9 | FMTU9 | Franquicia |
| QUILMES P. | FQUP | FMQCA | Franquicia |
| LA PLATA 2 | FLP2 | FLPCA | Franquicia |
| LA PLATA 3 | FLP3 | FLPC3 | Franquicia |
| LA PLATA 4 | FLP4 | FLPC4 | Franquicia |
| LA PLATA 6 | FLP6 | FLPC6 | Franquicia |
| CITY BELL | FCYB | FMCB1 | Franquicia |
| LOMAS AUTO | FLOZ | — | Franquicia |
| LOMAS | FMLCA | — | Franquicia |
| LANUS 2 | FLA2 | — | Franquicia |
| LA PAMPA | FLPA | — | Franquicia |
| GALLEGOS | FMP1 | — | Franquicia |
| ALDREY | FMP2 | — | Franquicia |
| LA PERLA | FMD3 | — | Franquicia |
| PEATONAL | FMDQ4 | — | Franquicia |
| OLAVARRIA | FOLAV | — | Franquicia |
| TANDIL | FCTA | — | Franquicia |
| TANDIL 2 | — | — | Franquicia |
| CIPOLLETTI | — | — | Franquicia |
| GENERAL ROCA | — | — | Franquicia |
| VILLA REGINA | — | — | Franquicia |
| RIO GALLEGOS | — | — | Franquicia |
| USHUAIA | — | — | Franquicia |
| TRELEW | — | — | Franquicia |
| PUERTO MADRYN | — | — | Franquicia |
| MAR DEL PLATA | — | — | Franquicia |
| BALCARCE | — | — | Franquicia |
| AZUL | — | — | Franquicia |
| PERGAMINO | — | — | Franquicia |
| SAN NICOLAS | — | — | Franquicia |
| SAN PEDRO | — | — | Franquicia |
| CHIVILCOY | — | — | Franquicia |
| JUNIN | — | — | Franquicia |
| CONSTITUCION | FCONS | — | Franquicia |
| ONCE | FONCE | — | Franquicia |
| CENTRO | FCENT | — | Franquicia |
| FLORES | FFLOR | — | Franquicia |
| LINIERS | FLIN | — | Franquicia |
| RETIRO | FRET | — | Franquicia |
| TRIBUNALES | FTRIB | — | Franquicia |
| MENDOZA | FMENDOZA | — | Franquicia |
| MENDOZA 2 | FMZA2 | — | Franquicia |
| MENDOZA 3 | FMZA3 | — | Franquicia |

**Total aproximado:** ~90 locales. La mayoría son franquicias. Los locales propios existen pero no se encontró su listado completo en los archivos analizados. FALTA: listado de locales propios con sus siglas y tipo.

**Nota sobre los datos:** Los locales que muestran sigla sistema pero sigla ticket vacía o con raya corresponden a locales de reciente incorporación o cuyo dato de ticketera no estaba disponible en la fuente.

---

## 2. Jefes de área

No existe una lista real de jefes de área que realizan las visitas técnicas en los archivos analizados. La lista de cuatro técnicos del Generador de Informes (Fernando Soria, Tomas Vera, Ana Guerrero, Francisco Rametta) corresponde a técnicos de mantenimiento, no a jefes de área auditores. Son roles distintos dentro de la organización.

Para la aplicación Visita Técnica se van a usar **cinco placeholders** (definir nombre del campo y formato). FALTA: la lista oficial de jefes de área.

---

## 3. Recorrido de cocina

1. **Entrada a cocina**
2. **Cafetera y módulo de bebidas** — Se evalúa cafetera, molino y módulo de bebidas calientes.
3. **Módulo de retención / Transfer** — Equipo de retención y transferencia de alimentos.
4. **Heladeras y freezers de línea (bajo mesada)** — Frío bajo mesada. Se evalúa temperatura, limpieza y funcionamiento.
5. **Tostadoras**
6. **Broiler**
7. **Planchas**
8. **Freidoras**
9. **Campana de extracción y filtros** — Se evalúa el sistema de extracción, los filtros de grasa y el motor extractor. Admite foto.
10. **Cámaras de frío (Refrigeración y Congelado)** — Cámaras frigoríficas. Se evalúa temperatura y estado general.
11. **Fábrica de hielo** — Máquina de hielo. Incluye observación del estado y producción. Admite foto.
12. **Equipo de filtración de agua / Dispensadores** — Sistema de filtrado de agua con control especial de PPM y componentes. Se describe en detalle en la sección 5.

**Total:** 12 estaciones. Admite foto: ítems 9 y 11 (Campana, Fábrica de hielo).

**Orden:** el orden es secuencial y corresponde al flujo operativo típico de una cocina de Mostaza: desde el ingreso hasta la salida de producción.

---

## 4. Recorrido edilicio

1. **Fachada, marquesina y acceso principal** — Estado exterior del local. Admite foto.
2. **Salón comercial (Pisos, zócalos y paredes)** — Estado interior del salón de ventas. Admite foto.
3. **Cielorrasos e iluminación general del salón** — Cielorrasos, luminarias y estado de la instalación de luz general. Admite foto.
4. **Sistema de climatización / Aires acondicionados (Grillas y difusores)** — Aire acondicionado, grillas de ventilación y difusores. Admite foto.
5. **Baños públicos y sanitarios** — Baños para clientes. Admite foto.
6. **Puertas, aberturas y cerramientos** — Puertas de acceso, ventanas y cerramientos en general. Admite foto.
7. **Pisos, rejillas y canaletas de desagüe (Cocina y servicios)** — Pisos de cocina, rejillas de piso y canaletas de desagüe. Admite foto.
8. **Paredes, azulejos y revestimientos cerámicos (Cocina)** — Revestimientos cerámicos de cocina. Admite foto.
9. **Techos y cielorrasos (Cocina y depósitos)** — Techos de cocina y depósitos. Admite foto.
10. **Tableros eléctricos e instalación de iluminación de servicio** — Tableros eléctricos e instalación eléctrica de servicio. Admite foto.
11. **Instalación sanitaria general y trampa de grasa** — Instalación sanitaria y trampa de grasa. Admite foto.
12. **Depósito, vestuarios y áreas de personal** — Depósitos, vestuarios y áreas destinadas al personal. Admite foto.

**Total:** 12 estaciones. **Admiten foto:** todas excepto la 12 (Depósito, vestuarios). Confirmado: 11 de 12 ítems edilicios con foto opcional.

**Nota:** el ítem 12 edilicio (Depósito, vestuarios) no incluye foto en la fuente documentada, aunque por su naturaleza podría requerirla. Es una decisión de diseño no resuelta.

---

## 5. Sistema de filtrado de agua

### 5.1 Escala de PPM completa

Los cortes están en 50, 120 y 300. Los estados y su significado operativo:

| Rango PPM | Estado | Significado operativo |
|-----------|--------|----------------------|
| 0 (no medido / pendiente) | El estado depende de los componentes (filtro, ablandador, ósmosis) | No se tomó la medición. Se difiere. |
| 1 a 49 | ROJO | Agua por debajo del rango esperado. Agua muy blanda. Puede indicar problemas de corrosión en cañerías o funcionamiento incorrecto del ablandador. |
| 50 a 119 | VERDE | Rango óptimo de funcionamiento. Sin acción requerida. |
| 120 a 300 | AMARILLO | Rango aceptable pero con alerta. Programar revisión del sistema de filtrado. |
| Mayor a 300 | ROJO | Agua dura. Requiere cambio urgente de filtros y verificación del ablandador. Puede afectar la vida útil de los equipos de cocina (cafeteras, máquinas de hielo). |

### 5.2 Campos del formulario

| Nombre del campo | Tipo de dato | Unidad | ¿Obligatorio? | Notas |
|------------------|-------------|--------|--------------|-------|
| PPM Post-Filtrado | numérico | PPM (mg/L) | No, si el checkbox "Pendiente" está marcado | Rango 0-9999. Se mide después del sistema de filtración. |
| Estado Filtro | selección (3 opciones) | — | Sí | Opciones: OP (operativo), NO OP (no operativo), N/A (no aplica) |
| Estado Ablandador | selección (3 opciones) | — | Sí | Opciones: OP (operativo), NO OP (no operativo), N/A (no aplica) |
| Estado Ósmosis | selección (3 opciones) | — | Sí | Opciones: N/A (no aplica, primero), OP (operativo), NO OP (no operativo) |
| Pendiente | checkbox | — | No | Al marcarlo, deshabilita el campo PPM y la evaluación se basa solo en componentes. |
| Detalle de Instalación Hídrica | texto libre (textarea) | — | No | Para describir cañerías, desagotes, ubicación del equipo. |

**Nota importante sobre Ósmosis:** el orden de las opciones en el selector es `N/A` primero, a diferencia de Filtro y Ablandador donde la primera opción es `OP`. Esto se debe a que no todos los locales tienen sistema de ósmosis inversa. Cuando se selecciona `N/A`, el componente se excluye del cálculo de fallas. Si está `OP` o `NO OP`, cuenta como un componente evaluable.

### 5.3 Cálculo del estado general (semáforo)

El estado general del agua se calcula combinando el valor de PPM y la cantidad de componentes marcados como `NO OP`:

- Si el checkbox **Pendiente** está marcado: el color depende solo de los componentes. 2 o más `NO OP` = ROJO. Exactamente 1 `NO OP` = AMARILLO. Cero `NO OP` = VERDE.
- Si hay un valor de PPM: se evalúa el rango de PPM (con los cortes 50, 120, 300) y se combina con los componentes. Si 2 o más componentes son `NO OP`, el resultado es ROJO aunque el PPM esté en VERDE. Si exactamente 1 componente es `NO OP`, sube un nivel: VERDE pasa a AMARILLO, AMARILLO pasa a ROJO, ROJO se mantiene.

**FALTA:** la periodicidad de medición de PPM no está documentada en ninguna fuente. Tampoco hay documentación sobre los criterios de recambio de filtros (por tiempo, por PPM, por cantidad de litros). Se sabe que estos varían por zona geográfica porque la dureza del agua de red es distinta en cada región.

---

## 6. Checklists y otros controles

No existen controles de tipo checklist en los archivos analizados. Todos los ítems del recorrido actual se evalúan con slider 0-100 + observación, a excepción del sistema de filtrado de agua que tiene su propio control (sección 5).

**FALTA:** no se especificó qué ítems deberían usar checklist en lugar de slider. Es una decisión de diseño pendiente.

---

## 7. Estructura del informe PDF

### 7.1 Secciones del documento (en orden)

1. **Encabezado corporativo** en cada página: círculo rojo con la letra "M" blanca en el centro, nombre de la empresa o de la app, título del informe, fecha y código de informe único.
2. **Datos de cabecera**: local, fecha, nombre del jefe de área (técnico visitante), nombre del encargado del local.
3. **Bloque Cocina**: score numérico del bloque, seguido del detalle de cada uno de los 12 ítems con su valor de slider, observación y foto cuando corresponda.
4. **Bloque Edilicio**: score numérico del bloque, seguido del detalle de cada uno de los 12 ítems con su valor de slider, observación y foto.
5. **Sistema de filtrado de agua**: valor de PPM, estado de componentes, semáforo de resultado (círculo coloreado en VERDE, AMARILLO o ROJO), observaciones de instalación.
6. **Scores resumen**: score bloque cocina, score bloque edilicio, score global. Cada uno con su valor numérico y barra de progreso visual.
7. **Firmas**: firma del jefe de área + aclaración (nombre), firma del encargado del local + aclaración (nombre) + cargo.
8. **Pie de página**: en todas las páginas, texto "Mostaza — Control Interno Regional" (o similar), número de página.

### 7.2 Encabezado de cada página

- Círculo rojo (~7 mm de diámetro) con la letra "M" blanca, centrado horizontalmente.
- Debajo del logo: nombre de la empresa/app en mayúscula negra.
- A la derecha: fecha del informe y código único del informe.
- El diseño actual usa color de relleno RGB(200, 0, 0) para el círculo y texto blanco.

### 7.3 Pie de página

Texto centrado: "Mostaza — Control Interno Regional" (o el nombre que se defina para la app), en gris claro, tamaño reducido, en todas las páginas.

### 7.4 Firmas

| Rótulo | Firma | Campo adicional |
|--------|-------|----------------|
| FIRMA JEFE DE ÁREA | Captura digital sobre canvas | Nombre del jefe de área (del campo de cabecera). Sin cargo adicional. |
| FIRMA ENCARGADO | Captura digital sobre canvas | Nombre del encargado (campo de texto obligatorio). Sin cargo adicional en la implementación actual. |

Las firmas se capturan como imagen PNG y se insertan en el PDF como imágenes estáticas, una al lado de la otra.

### 7.5 Nombre del archivo

Formato: `Visita_{siglaLocal}_{fecha}.pdf`
Ejemplo: `Visita_FSJU_2026-09-18.pdf`

---

## 8. Identidad visual

### 8.1 Colores exactos y su origen

| Rol | Color | Hex | Origen |
|-----|-------|-----|--------|
| Marca principal / acento | Naranja | `#F58220` | Color oficial de la marca Mostaza. Usado en botones principales, header, bordes activos, acentos. |
| Header / Footer | Negro | `#1A1A1B` | Barra superior y fondo de footer. Heredado del Generador de Informes. |
| Fondo de página | Gris muy claro | `#f3f4f6` | Body de la aplicación. |
| Labels de formulario | Gris medio | `#6b7280` | Texto de etiquetas. |
| Bordes de inputs | Gris | `#9ca3af` | Inputs, selects, textareas. |
| Fondo de tarjetas | Blanco | `#ffffff` | Cards del formulario. |
| Bordes de tarjetas | Gris claro | `#d1d5db` | Border de las cards (2px). |
| Verde semáforo | Verde | `#10b981` | Estado OK en semáforos y scores altos. |
| Amarillo semáforo | Amarillo | `#eab308` | Estado precaución. |
| Rojo semáforo | Rojo | `#ef4444` | Estado crítico. |
| Círculo logo PDF | Rojo | `#c80000` | RGB(200, 0, 0). Usado en el círculo con la "M" en el PDF. |
| Barra resumen PDF | Naranja | `#F58220` | RGB(245, 130, 32). Usado en la página de resumen del PDF. |

Además de estos, en el Generador de Informes se usan colores para distinguir secciones (borde lateral izquierdo de cards): naranja para sección general, azul (`#3b82f6`) para calidad de agua, púrpura (`#8b5cf6`) para observaciones, verde (`#16a34a`) para recomendaciones. Son decorativos y pueden adaptarse.

**Nota:** la tabla de colores de la app existente usa dos valores para el semáforo (VERDE=#10b981 en un lado, RGB(0,150,0) que corresponde aproximadamente a #009600 en otro). El RGB(0,150,0) es el color usado en la generación del PDF. El #10b981 es el Tailwind bg-green-500 usado en la UI. Son dos representaciones del mismo propósito (verde de estado OK) pero con distinto origen: uno es Tailwind, otro es cálculo directo RGB para PDF.

### 8.2 Tipografías

- **Familia base**: sans-serif del sistema (`font-family: sans-serif`). No se usa Google Fonts ni carga externa de tipografías. La decisión es deliberada: prioriza velocidad de carga inicial y disponibilidad offline.
- **Estilos de texto documentados**: labels en 9px, weight 900 (black), mayúscula sostenida. Inputs/selects en 14px. Títulos de sección en 12px, weight 900, mayúscula.

**FALTA:** no se encontró una guía de estilo o design system formal de la marca Mostaza. Los valores documentados son los que se usan en las apps operativas, no necesariamente la identidad oficial.

### 8.3 Logo

El logo existente en las apps es la letra "M" blanca dentro de un círculo de fondo rojo (RGB 200, 0, 0). Se usa como logo corporativo en el header del PDF. En el Generador de Informes también se usa la "M" como favicon y como icono de PWA, codificada como SVG inline (base64).

**FALTA:** no se encontró el archivo de logo oficial de Mostaza (ni PNG, ni SVG, ni AI). El círculo con la "M" es el único emblema presente.

---

## 9. Nomenclatura interna

### 9.1 Locales
- Se nombran por ciudad o barrio seguido opcionalmente de un número si hay más de uno: SAN JUSTO, LAFERRERE 2, CABILDO, CABILDO 2, TUCUMAN 2, TUCUMAN 3, etc.
- Las **siglas de sistema** empiezan con "F" (franquicia) o "M" (Mostaza, incluyendo algunos locales propios). Ejemplos: FSJU (Franquicia San Justo), MPT (Mostaza Portal Tucumán). Las siglas de ticket pueden diferir de las siglas de sistema (ver tabla en sección 1).

### 9.2 Sectores de cocina
Tal como aparecen en el recorrido:
- Entrada a cocina
- Cafetera y módulo de bebidas
- Módulo de retención / Transfer
- Heladeras y freezers de línea (bajo mesada)
- Tostadoras
- Broiler
- Planchas
- Freidoras
- Campana de extracción y filtros
- Cámaras de frío (Refrigeración y Congelado)
- Fábrica de hielo
- Equipo de filtración de agua / Dispensadores

### 9.3 Sectores edilicios
Tal como aparecen en el recorrido:
- Fachada, marquesina y acceso principal
- Salón comercial (Pisos, zócalos y paredes)
- Cielorrasos e iluminación general del salón
- Sistema de climatización / Aires acondicionados (Grillas y difusores)
- Baños públicos y sanitarios
- Puertas, aberturas y cerramientos
- Pisos, rejillas y canaletas de desagüe (Cocina y servicios)
- Paredes, azulejos y revestimientos cerámicos (Cocina)
- Techos y cielorrasos (Cocina y depósitos)
- Tableros eléctricos e instalación de iluminación de servicio
- Instalación sanitaria general y trampa de grasa
- Depósito, vestuarios y áreas de personal

### 9.4 Turnos
FALTA: no se encontró nomenclatura de turnos en los archivos. No se hace referencia a turnos mañana/tarde/noche en ninguna de las apps.

### 9.5 Roles
Ver sección de organigrama en el documento CONTEXTO (no se transcribe aquí por decisión de alcance). Los únicos roles relevantes para la app Visita Técnica son:
- **Jefe de Área**: persona que realiza la auditoría/visita.
- **Encargado de Local**: persona responsable del local que firma conformidad.
- Los supervisores y gerencia reciben los informes pero no interactúan con la app en esta versión.

---

## 10. Lecciones de las herramientas actuales

### 10.1 Lo que funciona bien (conservar como idea)

- **Dos firmas con botón de bloqueo**: la opción de bloquear la firma después de firmar evita borrones accidentales. Es un patrón simple que los técnicos entienden.
- **Persistencia automática de borrador**: la app guarda automáticamente todo lo que se escribe. Si el navegador se cierra, al volver se restaura. Sin botón "guardar". Es invisible para el usuario y valioso en terreno.
- **Código único de informe**: cada informe tiene un identificador único generado automáticamente (basado en timestamp + ID del local). Sirve como referencia para tickets y seguimiento.
- **Semáforo de un vistazo**: el LED de estado en el header permite saber sin leer nada si el local está en condiciones aceptables. El color combina agua + equipos.
- **Secciones con borde lateral coloreado**: cada bloque del formulario usa un color de borde izquierdo distinto, lo que permite ubicarse visualmente en un formulario largo.
- **Autocompletado de local**: al escribir el nombre del local, las siglas se completan solas. Reduce errores de carga.

### 10.2 Lo que no funciona (defectos o limitaciones conocidas)

- **El número de versión visible en el título no coincide con el número de versión interno del Service Worker**, así que no se puede saber qué versión real está usando cada persona sin abrir el inspector.
- **Las librerías externas (Tailwind, jsPDF, SignaturePad) se cargan desde CDN sin estar precacheadas.** Si el usuario abre la app sin conexión antes de haberlas cargado al menos una vez online, la app se ve sin estilos, las firmas no funcionan y el PDF no se genera. El mensaje de error es "Error PDF" sin más detalle.
- **Las firmas no se persisten entre recargas.** Si el usuario recarga la página (por error o porque el navegador se cerró), la firma desaparece y tiene que volver a firmar.
- **Las fotos se pierden al recargar la página** por el mismo motivo: solo están en memoria RAM.
- **No hay comprobación de lectura de EXIF**, así que las fotos tomadas en vertical con el celular pueden aparecer rotadas en el PDF.
- **No hay validación de identidad del técnico.** Cualquier persona puede seleccionar cualquier nombre. No hay login ni control de acceso.
- **El selector de técnico es fijo (4 opciones hardcodeadas).** No hay manera de agregar un técnico nuevo sin editar el HTML.
- **La señal de "sin conexión" no se informa al usuario.** El Service Worker funciona silenciosamente, pero el usuario no sabe si los datos que está viendo son de caché o están actualizados.
- **No hay historial de visitas anteriores del mismo local.** Cada visita es un formulario nuevo.
- **El zoom del navegador puede romper la alineación de las firmas** en algunos celulares Android, especialmente si el viewport es menor a 350px de ancho.

---

## 11. Contradicciones y huecos

### 11.1 Contradicciones

| # | Dato | Valor A | Origen A | Valor B | Origen B | Resolución |
|---|------|---------|----------|---------|----------|------------|
| C1 | Color verde estado OK | `#10b981` | CSS de UI (Tailwind bg-green-500) | RGB(0,150,0) ≈ `#009600` | Cálculo RGB en PDF (getSemCol) | Son dos representaciones del mismo propósito, pero con valores distintos. Usar uno solo. |
| C2 | ¿Fotos en bloque edilicio? | 11 de 12 ítems admiten foto | Módulo Estructura de Visita.md | Los 12 ítems admiten foto | Interpretación posterior | Definir explícitamente cuáles. |
| C3 | Slider default | 50 (punto medio) | Asumido en diseño | No documentado en ninguna fuente | — | Confirmar si el slider empieza en 50, en 0 o sin valor. |

### 11.2 Huecos (FALTA consolidado)

| # | Tema | ¿Qué falta? | ¿Se resuelve revisando archivos o es decisión de negocio? |
|---|------|-------------|----------------------------------------------------------|
| H1 | Locales propios | Listado completo de locales propios con siglas. | Decisión de negocio: no está en los archivos analizados. |
| H2 | Jefes de área | Lista real de jefes de área que realizan visitas. | Decisión de negocio: no existe en los archivos. Se usan placeholders. |
| H3 | Periodicidad medición PPM | Cada cuánto se mide el PPM del agua. | Decisión de negocio: varía por zona y no está documentado. |
| H4 | Criterio recambio de filtros | ¿Por tiempo, por PPM, por litros? | Decisión de negocio: no documentado. |
| H5 | Checklist de ítems | Qué ítems (si alguno) deben evaluarse con checklist en lugar de slider. | Decisión de negocio: no definido. |
| H6 | Logo oficial de Mostaza | Archivo de logo oficial (PNG, SVG, AI). | Se resuelve revisando: no se encontró en los archivos analizados. |
| H7 | Guía de estilo / design system | Documento formal con la identidad de marca Mostaza. | Decisión de negocio: no existe en los archivos. |
| H8 | Nomenclatura de turnos | Cómo se llaman los turnos de producción. | Decisión de negocio: no documentado. |
| H9 | Zoom y firmas en celulares chicos | Comportamiento exacto y solución documentada. | Decisión técnica: no está documentado como limitación formal. |

### 11.3 Los tres FALTA más importantes

1. **H2 — Lista de jefes de área:** sin esto la app no puede arrancar con usuarios reales.
2. **H1 — Locales propios:** la base de locales está incompleta sin ellos.
3. **H5 — Checklist vs slider:** la decisión sobre qué ítems usan checklist cambia el diseño del formulario.

---

*Documento de dominio generado el 2026-09-18. Cero líneas de código. 44 KB.*