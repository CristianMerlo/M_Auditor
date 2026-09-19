# RECOVERY ANALYSIS REPORT

## Buscador de Locales

**Proyecto analizado:** Buscador de Locales  
**Ubicación:** `/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/Buscador de Locales/`  
**Fecha de análisis:** 2026-09-18  
**Estado:** Análisis técnico completo

---

## 1. Resumen ejecutivo

La aplicación es un buscador web independiente, construido con tecnologías nativas de navegador:

- **HTML5** para la estructura semántica
- **CSS3** para el sistema visual y responsive
- **JavaScript (Vanilla)** para la búsqueda y renderizado dinámico
- **CSV/XLSX** para las fuentes de datos
- **Google Fonts** para tipografías
- **Font Awesome** para iconografía

No presenta dependencias de frameworks, compiladores ni herramientas de build. Es una aplicación estática que puede ejecutarse abriendo `index.html` directamente en el navegador.

## 2. Arquitectura de archivos

```text
Buscador de Locales/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── data.js
│       └── script.js
├── img/
│   └── logo.png
└── source/
    ├── La Sábana - Matriz de Locales V2 - Locales_Maestro.csv
    ├── Locales_Asignados.xlsx
    └── mapeo_locales_gen_online.csv
```

### Flujo de ejecución

```text
index.html
    ├── carga data.js
    ├── carga script.js
    └── al DOMContentLoaded:
            └── initStoreSearch()
                    ├── obtiene input / grid / contador
                    ├── valida existencia de localesData
                    ├── escucha eventos input
                    ├── filtra localesData
                    └── renderStores()
```

## 3. Estructura HTML

### Encabezado

El encabezado contiene:

- Título principal: `Buscador de Locales`
- Subtítulo descriptivo
- Imagen del logo Mostaza
- Fondo con degradado rojo
- Fijación superior mediante `position: sticky`

### Módulo de búsqueda

El módulo principal contiene:

- Campo de búsqueda con icono de lupa
- Indicador de cantidad de resultados
- Contenedor dinámico de resultados

### Footer

Incluye únicamente un pie de página con copyright y año.

## 4. Sistema visual

### Paleta de colores

```text
Rojo primario: #D32F2F
Rojo secundario/acento: #B71C1C
Texto principal: #333333
Texto secundario: #666666
Fondo: #F4F7F6
Blanco: #FFFFFF
Bordes: #EEEEEE
```

### Tipografías

- **Montserrat:** títulos y encabezados, pesos 700 y 800
- **Roboto:** cuerpo, pesos 300, 400, 500 y 700

### Componentes visuales

1. **Header degradado rojo**
2. **Logo en tarjeta blanca con sombra**
3. **Card principal blanca**
4. **Buscador grande, redondeado y centrado**
5. **Input con icono integrado**
6. **Grilla responsive de tarjetas**
7. **Tarjetas con borde lateral rojo animado**
8. **Badges de provincia y tipo de local**
9. **Separadores internos**
10. **Animación de entrada fade-in**

### Diseño responsive

La aplicación adapta su disposición en pantallas menores o iguales a `768px`:

- Encabezado apilado verticalmente
- Título reducido
- Card de búsqueda con menor padding
- Input reducido
- Icono de búsqueda reducido

## 5. Funcionalidades recuperables

### Funcionalidad principal

La aplicación permite buscar locales por:

- Nombre del local
- Dirección
- Email
- Gerente regional
- Supervisor
- Técnico asignado
- Sigla del sistema
- Sigla de tickets
- Provincia

### Comportamiento

- El buscador requiere al menos 2 caracteres.
- La búsqueda es por coincidencia parcial.
- La comparación se realiza en minúsculas.
- El resultado se renderiza dinámicamente.
- Se muestra una cuenta de resultados.
- No hay paginación.
- No hay ordenamiento.
- No hay filtros adicionales.
- No hay persistencia local.
- No hay navegación entre detalles.

### Modelo de datos

Cada local contiene:

```text
sigla_sistema
sigla_tickets
regional
supervisor
local
email
direccion
ciudad
provincia
tipo_local
razon_social
tecnico
```

## 6. Lógica de búsqueda

El filtro principal se implementa mediante:

```javascript
const filtered = localesData.filter(store =>
    (store.local && store.local.toLowerCase().includes(query)) ||
    (store.direccion && store.direccion.toLowerCase().includes(query)) ||
    (store.email && store.email.toLowerCase().includes(query)) ||
    (store.regional && store.regional.toLowerCase().includes(query)) ||
    (store.supervisor && store.supervisor.toLowerCase().includes(query)) ||
    (store.tecnico && store.tecnico.toLowerCase().includes(query)) ||
    (store.sigla_sistema && store.sigla_sistema.toLowerCase().includes(query)) ||
    (store.sigla_tickets && store.sigla_tickets.toLowerCase().includes(query)) ||
    (store.provincia && store.provincia.toLowerCase().includes(query))
);
```

La función `renderStores()` transforma cada registro en una tarjeta HTML mediante un template literal.

## 7. Dependencias externas

### Tipografías

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
```

### Iconos

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## 8. Datos

### CSV maestro

El CSV `Locales_Maestro.csv` contiene los datos principales de locales y responsables.

Campos:

```text
SIGLA SISTEMA
SIGLA TICKETS
REGIONAL
Mail Regional
SUPERVISOR (GTE ZONA)
Mail Supervisor
LOCAL
MAIL
DIRECCION
LOCALIDAD
PROVINCIA
TIPO DE LOCAL
RAZON SOCIAL
```

### CSV de mapeo

El CSV `mapeo_locales_gen_online.csv` contiene un mapeo reducido con:

```text
name
sigla_sis
sigla_tic
id
id_padded
```

### XLSX

El archivo `Locales_Asignados.xlsx` parece ser una base complementaria de asignaciones, aunque no fue accedida en este análisis estático.

## 9. Observaciones técnicas

### Fortalezas

- Arquitectura simple y legible
- Sin dependencias complejas
- Búsqueda multi-campo
- Diseño responsive
- Separación clara entre estructura, estilo, datos y lógica
- Fácil de adaptar a otro proyecto

### Limitaciones

- Los datos están incrustados en `data.js`, no se cargan desde las fuentes CSV/XLSX
- No existe normalización de caracteres (acentos, tildes)
- No existe manejo de mayúsculas/minúsculas más allá de `toLowerCase()`
- No existe protección explícita contra XSS en el renderizado
- No existe debounce
- No existe paginación
- No existe ordenamiento
- No existe filtros por provincia/tipo/localidad
- No existe soporte para búsqueda por palabras clave más complejas
- No existe validación de datos faltantes más allá de `|| '-'`
- La búsqueda no considera `ciudad`
- La búsqueda no considera `tipo_local`
- La búsqueda no considera `Mail Regional`
- La búsqueda no considera `Mail Supervisor`
- La búsqueda no considera el `id` del mapeo
- No existe modo oscuro
- No existe navegación por historial o URL
- No existe accesibilidad completa: etiquetas, roles, aria, navegación por teclado

### Riesgos de seguridad

El renderizado por template literal inserta directamente los datos en el DOM:

```javascript
${store.local || '-'}
```

Esto puede representar un riesgo si los datos son manipulados o incluyen HTML malicioso. Para una aplicación interna con datos controlados, el riesgo es bajo, pero debería considerarse una función de escape de HTML o `textContent`.

## 10. Opciones para M Auditor

Para rescatar esta aplicación y adaptarla a otro proyecto, se proponen las siguientes opciones:

### Opción A — Reutilizar el diseño como base visual

Mantener:

- Paleta Mostaza
- Tipografías
- Header degradado
- Cards
- Badges
- Animaciones
- Diseño responsive

Cambiar:

- Logo
- Título
- Subtítulo
- Datos
- Campos visibles
- Terminología

### Opción B — Reutilizar arquitectura y funcionalidad

Adaptar:

- `data.js` → datos de auditorías, técnicos, zonas o activos
- `script.js` → búsqueda multi-campo
- `styles.css` → sistema visual reutilizable
- `index.html` → nueva interfaz del proyecto

### Opción C — Evolución modular

Reestructurar el buscador en módulos:

```text
components/
  StoreCard.js
  SearchBar.js
  ResultCount.js
services/
  search.js
  normalize.js
  escapeHtml.js
utils/
  constants.js
```

### Opción D — Versión mejorada

Agregar:

- Debounce
- Búsqueda por ciudad
- Filtros por provincia/tipo/localidad
- Ordenamiento
- Paginación
- Exportación CSV
- Búsqueda por campos adicionales
- Escape HTML
- Accesibilidad ARIA
- Estados de carga
- Manejo de errores
- Persistencia de filtros
- Modificación de datos

## 11. Recomendación

Para `M Auditor`, recomiendo la **Opción B con evolución modular**:

1. Mantener el sistema visual base.
2. Reemplazar los datos de locales por datos de auditoría.
3. Convertir la búsqueda en un servicio independiente.
4. Separar renderizado de datos.
5. Incorporar escape HTML.
6. Agregar filtros específicos del proyecto.
7. Crear una versión modular antes de agregar funcionalidades adicionales.

## 12. Estructura sugerida para M Auditor

```text
M Auditor/
├── index.html
├── assets/
│   ├── css/
│   │   ├── design-system.css
│   │   ├── components.css
│   │   └── responsive.css
│   └── js/
│       ├── data/
│       │   └── auditorias.js
│       ├── services/
│       │   ├── search.js
│       │   ├── normalize.js
│       │   └── escape-html.js
│       ├── components/
│       │   ├── search-bar.js
│       │   ├── result-card.js
│       │   └── result-count.js
│       └── app.js
└── source/
    └── little bro/
        └── investigacion/
```

## 13. Conclusión

La aplicación ofrece una base sólida para recuperar una estética coherente y una funcionalidad de búsqueda simple, adaptable y de bajo acoplamiento. Su mayor valor para `M Auditor` está en la combinación de:

- diseño visual claro
- interfaz centrada en búsqueda
- tarjetas informativas
- responsive design
- separación modular de archivos
- baja dependencia tecnológica

La funcionalidad central puede reutilizarse directamente, mientras que la arquitectura debería evolucionar hacia módulos para permitir mantenimiento, seguridad y nuevas capacidades.

---

**Análisis generado a partir de la inspección directa de:**

- `index.html`
- `assets/css/styles.css`
- `assets/js/data.js`
- `assets/js/script.js`
- `source/La Sábana - Matriz de Locales V2 - Locales_Maestro.csv`
- `source/mapeo_locales_gen_online.csv`
