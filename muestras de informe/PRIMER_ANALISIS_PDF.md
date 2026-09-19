# Análisis del PDF de Visita Técnica — Primer entregable

**Fecha:** 2025-09-19
**App:** https://visita-tecnica-mostaza.surge.sh
**Documento analizado:** `js/pdf.js` + `js/controles/agua.js` + `docs/esquema-visita.md`

---

## Estructura del PDF esperado

Basado en los datos de ejemplo del esquema (`docs/esquema-visita.md`) con visita al local SAN JUSTO (FSJU).

### Encabezado
| Elemento | Valor esperado |
|---|---|
| Círculo rojo "M" | Logo corporativo |
| Título | VISITA TÉCNICA |
| Fecha | 19/9/2026 |
| Código | VT-20260919-FSJU-7Q4B |
| Separador | Línea naranja (--c-marca) |

### Datos de la visita
| Campo | Valor esperado |
|---|---|
| Local | SAN JUSTO |
| Sigla sistema | FSJU |
| Sigla ticket | FCSJ3 |
| Tipo | franquicia |
| Jefe de área | Jefe 2 |
| Encargado | Rodrigo Paz — Encargado de turno |
| Código | VT-20260919-FSJU-7Q4B |

### Bloque Cocina — Puntaje: 94.5/100 (VERDE)
11 items puntuables (coc-01 a coc-11), coc-12 (agua) se muestra aparte:

- 9 items en 100/100 → VERDE
- coc-08 Freidoras: **45/100 → ROJO**
- coc-11 Fábrica de hielo: **NO APLICA** — "El local no tiene fábrica de hielo, compra bolsas"

**Cálculo del score:** (9 × 100 + 45) / 10 = 94.5 → VERDE

### Bloque Edilicio — Puntaje: 58.75/100 (ROJO)
12 items puntuables:

- edi-01 (Fachada): **55 → ROJO**
- 4 items en **40 → ROJO**
- 7 items en **70 → AMARILLO**

**Cálculo del score:** (55 + 4×40 + 7×70) / 12 = 58.75 → ROJO

### Sistema de filtrado de agua
| Componente | Valor |
|---|---|
| PPM | 142 (medido) |
| Rango | 120-300 → AMARILLO base |
| Filtro | OP |
| Ablandador | **NO OP** |
| Ósmosis | N/A (excluida del cálculo) |
| Resultado | **ROJO** (amarillo base + 1 NO OP sube un nivel) |
| Motivo escrito | "PPM 142 en rango amarillo (120-300) + 1 componente NO OP (Ablandador) sube un nivel. Ósmosis en N/A: excluida del cálculo." |

**Periodicidad:** 30 días · **Recambio filtro:** 180 días

### Resumen de puntajes (barras)
| Bloque | Score | Color |
|---|---|---|
| Cocina | 94.5/100 | VERDE |
| Edilicio | 58.75/100 | ROJO |
| General | **76.63/100** | **AMARILLO** |

**Cálculo general:** 94.5 × 0.5 + 58.75 × 0.5 = 76.63 → AMARILLO

### Firmas
Dos recuadros (60×30 mm, aspect ratio 2:1):
- **FIRMA JEFE DE ÁREA** → Jefe 2
- **FIRMA ENCARGADO** → Rodrigo Paz — Encargado de turno

### Fotos
Se insertan en los items que las admiten (`fotos:true`):
- coc-09 (Campana), coc-11 (Fábrica de hielo)
- edi-01 a edi-12 (los 12 edilicios)
- Hasta 2 por ítem, 2 por fila en el PDF, ~800px ancho

---

## Fortalezas identificadas

| Aspecto | Detalle |
|---|---|
| **Colores coherentes** | Paleta leída del CSS via `js/paleta.js` → misma en pantalla y PDF |
| **Sin dependencias externas** | jsPDF vendorizado (420 KB), 0 CDN en runtime |
| **Motivo del agua explícito** | Cada semáforo de agua incluye el `porQue` con la causa del color |
| **Fórmula única de scoring** | Misma función `Scoring.recalcular()` para pantalla y PDF |
| **Nunca borra la visita sola** | `finalizar()` exige `pdfGenerado=true` |

---

## Posibles puntos a verificar

1. **Firmas achatadas** — Se usó el aspect ratio 60×30 mm (config) y canvas en alta resolución con DPR. Verificar que no se comprima al insertar.
2. **Fotos en PDF** — Se cargan desde IndexedDB como dataURL. Verificar que el peso total del PDF no supere ~4 MB.
3. **Saltos de página** — El algoritmo `espacio()` añade páginas cuando `y + alto > H - 16`. Verificar que los items largos no queden partidos.
4. **Acentos en el PDF** — jsPDF con helvetica no renderiza acentos fuera de la codificación estándar (WinAnsiEncoding). Verificar que "Ósmosis", "Ablandador", etc. se vean correctamente.

---

## Conclusión del análisis

El PDF del primer entregable **cumple con la estructura definida en el documento de dominio**. Los datos de ejemplo (SAN JUSTO, scores 94.5/58.75/76.63) cubren los tres colores del semáforo en una sola visita, y el agua en ROJO con motivo explícito valida el cálculo más complejo del sistema.

**Próximo paso:** generar el PDF desde la app, descargarlo y verificar visualmente en la carpeta `muestras de informe/`.