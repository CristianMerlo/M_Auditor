# Módulo Estructura de Visita

**Proyecto:** M Auditor  
**Ubicación:** `M Auditor/source/little bro/`  
**Propósito:** Definir el circuito secuencial de revisión de equipos de producción, servicio e infraestructura edilicia del local.

---

## BLOQUE 1: Recorrida de Equipamiento (Cocina)

*(Circuito secuencial exclusivo para la revisión de equipos de producción y servicio)*

1. **Entrada a cocina**
2. **Cafetera y módulo de bebidas**
3. **Módulo de retención / Transfer**
4. **Heladeras y freezers de línea (bajo mesada)**
5. **Tostadoras**
6. **Broiler**
7. **Planchas**
8. **Freidoras**
9. **Campana de extracción y filtros**
10. **Cámaras de frío (Refrigeración y Congelado)**
11. **Fábrica de hielo**
12. **Equipo de filtración de agua / Dispensadores**

---

## BLOQUE 2: Recorrida Edilicia (Infraestructura del Local)

*(Circuito secuencial exclusivo para la revisión de estado edilicio e instalaciones generales)*

1. **Fachada, marquesina y acceso principal**
2. **Salón comercial (Pisos, zócalos y paredes)**
3. **Cielorrasos e iluminación general del salón**
4. **Sistema de climatización / Aires acondicionados (Grillas y difusores)**
5. **Baños públicos y sanitarios**
6. **Puertas, aberturas y cerramientos**
7. **Pisos, rejillas y canaletas de desagüe (Cocina y servicios)**
8. **Paredes, azulejos y revestimientos cerámicos (Cocina)**
9. **Techos y cielorrasos (Cocina y depósitos)**
10. **Tableros eléctricos e instalación de iluminación de servicio**
11. **Instalación sanitaria general y trampa de grasa**
12. **Depósito, vestuarios y áreas de personal**

---

## Estructura de implementación sugerida

```text
Visita
├── Bloque 1: Recorrida de Equipamiento (Cocina)
│   ├── Entrada a cocina
│   ├── Cafetera y módulo de bebidas
│   ├── Módulo de retención / Transfer
│   ├── Heladeras y freezers de línea
│   ├── Tostadoras
│   ├── Broiler
│   ├── Planchas
│   ├── Freidoras
│   ├── Campana de extracción y filtros
│   ├── Cámaras de frío
│   ├── Fábrica de hielo
│   └── Equipo de filtración de agua / Dispensadores
└── Bloque 2: Recorrida Edilicia
    ├── Fachada, marquesina y acceso principal
    ├── Salón comercial
    ├── Cielorrasos e iluminación
    ├── Climatización
    ├── Baños
    ├── Puertas, aberturas y cerramientos
    ├── Pisos, rejillas y canaletas
    ├── Paredes, azulejos y revestimientos
    ├── Techos y cielorrasos
    ├── Tableros eléctricos
    ├── Instalación sanitaria y trampa de grasa
    └── Depósito, vestuarios y áreas de personal
```

---

## Consideraciones técnicas

- Cada bloque representa un **circuito secuencial independiente**.
- El orden de los ítems debe respetar el flujo operativo de la visita.
- Cada punto puede convertirse en una **tarjeta de inspección**.
- Cada tarjeta puede contener:
  - Estado
  - Observación
  - Evidencia fotográfica
  - Prioridad
  - Acción correctiva
  - Responsable
  - SLA
  - Firma de validación
- La estructura permite agregar lógica condicional por tipo de local o equipamiento.
