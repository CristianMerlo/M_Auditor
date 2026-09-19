# Librerías vendorizadas

Todo lo de terceros vive acá, copiado al repo. **Cero CDN, cero pedidos a
internet en runtime.** Si algún día aparece una URL externa en el código, es un
bug: la app tiene que funcionar con el teléfono en modo avión.

| Archivo | Librería | Versión | Licencia | Origen de la copia |
|---|---|---|---|---|
| `jspdf.umd.min.js` | jsPDF | **4.2.1** (build 2026-03-17) | MIT | `https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js` |

- **Peso del archivo:** 420.165 bytes (dato medido con `ls -l`, no estimado).
- **SHA-256:** `e6551fcdc32f09d6853b2c5126d18d01d9447e0da618a41a11ebeee0f6c20d54`
- Expone el objeto global `jspdf` (`window.jspdf.jsPDF`), que es lo que usa
  `js/pdf.js`.
- **Todavía no se carga desde `index.html`.** Se agrega al cargador de assets en
  la etapa 8 (Informe PDF), para no hacerle descargar 410 KB a un teléfono en
  las etapas donde no se usa. Está vendorizado desde ahora para garantizar que
  el PDF no dependa de tener internet el día del deploy.

## Lo que deliberadamente no está acá

| Descartado | Por qué |
|---|---|
| **html2canvas** | Lento y pesado en gama baja, y rasteriza el informe. El PDF se arma con las primitivas de jsPDF: texto seleccionable, archivo más liviano. |
| **SignaturePad** | La firma se escribe a mano con Pointer Events, unas pocas decenas de líneas. Así controlamos el aspect ratio del canvas para que coincida con el destino en el PDF, que es justamente el defecto a corregir de la herramienta actual. |
| **Tailwind** | CSS propio. El `app.css` completo pesa una fracción del framework, y la paleta queda declarada en un solo lugar. |
| **Fuentes web** | Se usa la sans del sistema. Una fuente externa es un pedido a internet que puede fallar en la puerta del local. |
