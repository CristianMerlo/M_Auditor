# Informe Técnico: Análisis de Frogmi para M Auditor

> **Fuente analizada:** `source/ideas frogme.md`
> **Fecha de análisis:** 2026-09-18
> **Propósito:** Extraer técnicas, estructuras y funciones de Frogmi para orientar la construcción de **M Auditor**, con enfoque en **mantenimiento y visitas a locales**.
> **Nota sobre fuentes:** El material analizado combina documentación pública de Frogmi (frogmi.com, apidoc.frogmi.com) con inferencias funcionales. Se distingue explícitamente lo **confirmado** de lo **no confirmado / a validar**.

---

## 1. Arquitectura general

Frogmi es una **plataforma SaaS centralizada, multiempresa (multi-tenant), orientada a servicios web**, con clientes móviles y web que se conectan a un backend común. Se compone conceptualmente de cuatro grandes bloques:

- **Aplicación móvil** para personal en tienda (iOS / Android + dispositivos industriales Zebra y Honeywell).
- **Plataforma web** para supervisión y administración.
- **Motor de workflows / tickets** que orquesta procesos operativos.
- **Capa de datos, analítica e inteligencia artificial** (Frogmi Intelligence).

### 1.1 Arquitectura funcional (según fuente)

```text
Usuarios en locales
     │
     ├── App móvil iOS / Android
     ├── Dispositivos Zebra / Honeywell
     └── Acceso por QR autenticado
     │
     ▼
Plataforma Frogmi
     │
     ├── Auditorías y checklists
     ├── Gestión de activos y tickets
     ├── Motor de workflows
     ├── Gestión de tareas
     ├── Gestor documental
     ├── Comunicación
     ├── Analítica y dashboards
     └── Frogmi Intelligence
     │
     ▼
Integraciones corporativas
     │
     ├── ERP
     ├── Inventario
     ├── CMMS / mantenimiento
     ├── Sistemas internos
     └── APIs / conectores
```

### 1.2 Nivel de acceso y modelo cliente

- Acceso por **QR autenticado**: el flujo protegido requiere la app y un usuario autenticado (no funciona con cámara nativa o navegador externo).
- Clientes soportados: web, iOS, Android y dispositivos industriales (Zebra, Honeywell).
- Arquitectura **modular**: nueve módulos activables por necesidad, integrados entre sí (una auditoría genera una tarea/ticket que se refleja en indicadores sin exportación manual).

### 1.3 Aspectos NO confirmados por la fuente

- Proveedor cloud específico.
- Uso de microservicios / contenedores / Kubernetes.
- Motor de base de datos concreto.
- Lenguajes de programación del backend.
- Diagrama de infraestructura interno.

> **Implicación para M Auditor:** la arquitectura funcional está clara y es replicable; las decisiones de infraestructura son libres. Un modelo SaaS multi-tenant con API REST y clientes móvil/web es una base sólida y verificada por el mercado.

---

## 2. Estructuras de datos

### 2.1 Jerarquía organizacional

```text
Empresa
 ├── Regiones
 │    ├── Zonas
 │    │    ├── Locales
 │    │    │    ├── Sectores
 │    │    │    └── Activos
 │    │    │         ├── Tickets
 │    │    │         ├── Auditorías
 │    │    │         ├── Mantenimientos
 │    │    │         └── Documentos
 │    │    └── Supervisores
 │    └── Proveedores
 └── Usuarios y roles
```

### 2.2 Entidades principales recomendadas

| Entidad | Descripción / rol |
| :-- | :-- |
| Organización | Tenant raíz (multiempresa) |
| Región / Zona / Local / Sector | Jerarquía geográfica-operativa |
| Usuario / Rol | Identidad y permisos |
| Activo / Tipo de activo / QR | Equipos con ficha e identificación única |
| Auditoría / Checklist / Respuesta / Evidencia | Núcleo de inspección |
| Incidente / Ticket | Hallazgos convertidos en trabajo trazable |
| Workflow / Etapa / SLA | Orquestación de procesos |
| Tarea | Acción correctiva asignable |
| Proveedor / Visita técnica / Repuesto | Mantenimiento externo |
| Documento / Comentario / Notificación | Soporte operativo |
| Historial de cambios / Indicador | Trazabilidad y analítica |

### 2.3 Ficha de activo (modelo de mantenimiento trazable)

Cada equipo debe tener ficha propia:

- Código único, Código QR, Tipo de activo.
- Marca, Modelo, Número de serie, Descripción.
- Local, Sector, Ubicación exacta.
- Fecha de instalación, Proveedor, Garantía y su vencimiento.
- Criticidad, Estado actual, Responsable.
- Manual, Fotos.
- Historial de fallas / reparaciones / repuestos / costos / horas de trabajo.
- Próximo mantenimiento preventivo, Proveedor técnico asignado.
- Fecha de baja o reemplazo.

### 2.4 Tipos de respuesta soportados en formularios

- Sí/No.
- Opción múltiple.
- Escala de puntuación.
- Campo numérico validado.
- Comentario (texto).
- Fotografía.
- GPS.
- Lectura de códigos (QR / barras).
- Firma.
- **Lógica condicional**: preguntas que aparecen según respuestas previas.

> **Principio de diseño clave (de la fuente):** un ticket no debe ser texto libre. Debe vincularse a **activo → local → visita → causa → prioridad → SLA → resolución**.

---

## 3. Funcionalidades identificadas

### 3.1 Auditorías y checklists

- Controles de apertura/cierre, limpieza, seguridad, temperatura, caja, protocolos, exhibición y auditorías formales.
- Lógica condicional: "No cumple" → pregunta adicional + foto obligatoria + acción correctiva.

### 3.2 Puntajes y evaluación

- Cálculo de cumplimiento con **ponderaciones** (seguridad pesa más que presentación).
- Nota global, por sección, por pregunta; hallazgos, recomendaciones, tiempo de ejecución.
- Comparación entre locales, zonas y regiones.

### 3.3 Evidencia fotográfica y GPS

- Fotos obligatorias asociadas a GPS y contexto de inspección.
- **Control de presencia en tienda** (diferencia visita real de un trayecto).

### 3.4 Acciones correctivas automáticas

- Un incumplimiento genera automáticamente: tarea/ticket, responsable, plazo, descripción, foto y seguimiento de estado.
- Ciclo cerrado en la plataforma: detección → asignación → resolución → evidencia → validación del supervisor.

### 3.5 Dashboards y reportes

- Vistas por local, zona, región, tipo de auditoría, área, responsable, cumplimiento, tiempo y estado de acciones.
- Envío automático de reporte por correo al cerrar una auditoría.

### 3.6 Trabajo offline

- Ejecución sin conexión con sincronización posterior (útil en depósitos y zonas de mala señal).
- *Nota de la fuente: la disponibilidad exacta del modo offline no pudo confirmarse plenamente en la documentación pública revisada.*

### 3.7 Inteligencia artificial (Frogmi Intelligence)

- Análisis de fotos contra estándares configurados: puntaje global y por variable, criterio, hallazgo, recomendación y PDF automático.
- Enrutamiento de incidentes al área responsable, asignación de plazos por reglas, consultas en lenguaje natural.
- La IA opera **dentro de los estándares configurados**; no reemplaza el criterio humano.

### 3.8 Módulos de la plataforma (9)

Auditoría y checklist · Ejecución de producto · Gestión de tareas · Colaboración de equipos · Comunicación corporativa · Gestor documental · Gestión de activos y ticketing · Analítica y visibilidad · Asistente IA del colaborador.

### 3.9 Funcionalidades específicas de mantenimiento y visitas

- **Identificación del local:** código, dirección, región/zona/supervisor, GPS, fecha/hora, usuario, dispositivo, tipo de visita.
- **Control de llegada/presencia:** inicio/fin, validación de ubicación, evidencia fotográfica, firma, visitas omitidas, comparación planificado vs. real.
- **Agenda de recorridas:** planificación por local, frecuencia, rutas por zona, visitas vencidas/reprogramadas/pendientes, priorización por riesgo.
- **Checklists de mantenimiento:** estado general, instalaciones eléctricas, climatización/refrigeración, agua/desagües, seguridad/prevención, equipamiento operativo.
- **Reporte de incidentes:** selección de local, identificación de activo por QR, descripción, fotos/videos, urgencia, riesgo, impacto en ventas.
- **Workflows de mantenimiento** (16 etapas típicas): reporte → identificación → clasificación → validación → asignación → diagnóstico → repuesto → aprobación → visita → reparación → prueba → evidencia → validación local → cierre técnico → cierre administrativo → actualización de historial.
- **SLA y escalamiento** por flujo con notificación automática al exceder plazo.
- **Integración auditoría→mantenimiento:** un hallazgo crítico se convierte automáticamente en ticket con foto, local, ubicación, activo, criticidad, responsable y plazo.
- **Mantenimiento preventivo:** calendario, rutinas por tipo, lecturas, checklist técnico, alertas, historial por activo.
- **Visita técnica del proveedor:** técnico, contratista, hora de llegada, diagnóstico, repuestos, fotos antes/después, firma, pruebas, garantía, evaluación del servicio.

### 3.10 Matriz de prioridad (mantenimiento)

| Prioridad | Ejemplo | Respuesta |
| :-- | :-- | :-- |
| Crítica | Riesgo eléctrico, pérdida de frío, inundación | Atención inmediata + escalamiento |
| Alta | Equipo principal detenido / afecta ventas | Intervención prioritaria |
| Media | Defecto operativo sin interrupción total | Resolver dentro del SLA |
| Baja | Deterioro visual o reparación menor | Programar mantenimiento |

---

## 4. Patrones técnicos

Patrones de diseño extraíbles del análisis, directamente aplicables a M Auditor:

1. **Formulario dirigido por datos con lógica condicional (dynamic forms):** el checklist se define como estructura de datos configurable, no como código fijo. Respuestas disparan preguntas, evidencias y acciones.

2. **Evidencia obligatoria condicionada:** un valor fuera de rango o "No cumple" obliga a foto + comentario antes de continuar. Refuerza calidad del dato.

3. **Motor de workflows sin código (visual, low-code):** etapas, responsables, formularios, plazos, escalamiento y **actividades paralelas** configurables por el negocio.

4. **Conversión evento→trabajo (event-driven):** un hallazgo de auditoría genera automáticamente un ticket/tarea. Patrón de "detección que dispara acción".

5. **Ponderación configurable de puntajes:** scoring con pesos por sección/pregunta para reflejar criticidad diferencial.

6. **Identificación física por QR autenticado:** cada activo tiene QR único; al escanear se accede a flujos según rol y tienda. Vincula el mundo físico con la ficha digital.

7. **Control de presencia geoverificado:** validación de que la visita ocurrió realmente en el local (GPS + registro de inicio/fin).

8. **Offline-first con sincronización diferida** (a validar): captura local y sincronización al recuperar conectividad.

9. **Multi-tenant con control de acceso jerárquico:** permisos por organización → región → local → rol.

10. **SLA con escalamiento automático:** plazos por etapa que disparan notificaciones/escalamiento al vencer.

11. **Trazabilidad de extremo a extremo:** cadena `local → activo → hallazgo → ticket → técnico → reparación → evidencia → cierre → historial`.

12. **IA acotada por reglas de negocio:** la IA analiza dentro de estándares configurados; genera puntaje/hallazgo/recomendación pero no decide autónomamente.

---

## 5. APIs e integraciones

### 5.1 Confirmado

- Existe **documentación pública de API** (apidoc.frogmi.com).
- Las **API keys** se obtienen desde la configuración de la compañía.
- Integraciones declaradas con **ERP, inventario, mantenimiento (CMMS) y sistemas internos** vía APIs y conectores.
- Evidencia externa de uso de la **API REST** para extraer datos de auditorías → PostgreSQL → Power BI (proyecto de terceros: ETL-Frogmi en GitHub).

### 5.2 Capacidades de API a considerar / validar

- Estilo **REST**; autenticación por **API key u OAuth**.
- Lectura: locales, usuarios, activos, auditorías, respuestas, fotos, tickets.
- Escritura: creación/actualización de tickets externos y estados.
- **Webhooks** (a validar con el proveedor).
- Sincronización bidireccional, paginación, filtros por fecha, exportación masiva.
- Límites de uso, versionado, sandbox, logs de integración, manejo de errores.

### 5.3 Seguridad

- **Confirmado / declarado:** SSO, MFA, operación bajo **ISO 27001** con SGSI, intercambio seguro vía SSL, almacenamiento de imágenes y geolocalización.
- **A solicitar en una evaluación:** ubicación de datos, subcontratistas cloud, backups (RTO/RPO), SLA de disponibilidad, plan de continuidad/DR, pentest, certificado ISO vigente, DPA, política de eliminación de datos, cifrado, spec de API y webhooks.

---

## 6. Recomendaciones para replicar en M Auditor

### 6.1 Núcleo mínimo viable (MVP)

Priorizar el circuito completo verificable, no funciones aisladas:

1. **Modelo de datos jerárquico multi-tenant**: Organización → Región → Zona → Local → Sector → Activo, con Usuarios/Roles.
2. **Motor de formularios dinámicos** con los 10 tipos de respuesta y lógica condicional.
3. **Ficha de activo con QR único** autenticado.
4. **Evidencia obligatoria condicionada** (foto + comentario ante incumplimiento).
5. **Scoring ponderado** por sección/pregunta.
6. **Conversión automática hallazgo → ticket/tarea** con responsable, plazo y contexto.
7. **Dashboards** por local/zona/región/responsable + exportación (Excel/CSV/PDF).

### 6.2 Segunda fase

8. **Motor de workflows configurable** (etapas, responsables, plazos, escalamiento, actividades paralelas).
9. **SLA con escalamiento automático**.
10. **Agenda de recorridas** y control de presencia geoverificado.
11. **Modo offline** con sincronización diferida (crítico para locales con mala señal).
12. **Mantenimiento preventivo** (calendario, rutinas, alertas por activo).

### 6.3 Fase avanzada

13. **Módulo de visita técnica de proveedores** con evaluación de servicio.
14. **Capa de IA acotada por reglas** (análisis de fotos, clasificación de incidentes, enrutamiento). Mantener la IA dentro de estándares configurados y con posibilidad de corrección manual.
15. **API REST pública** con webhooks para integración con ERP/CMMS.

### 6.4 Decisiones técnicas sugeridas

- **Base de datos:** relacional (PostgreSQL) por la naturaleza jerárquica y relacional del modelo; el proyecto externo ETL-Frogmi ya valida PostgreSQL + Power BI como destino analítico.
- **Backend:** API REST con autenticación por token/OAuth y control de acceso jerárquico (RBAC por organización/región/local/rol).
- **Cliente móvil:** offline-first (almacenamiento local + cola de sincronización); soporte de cámara, GPS y escaneo de QR.
- **Analítica:** separar la capa transaccional de la analítica (ETL/vistas materializadas) para dashboards sin degradar la operación.
- **Seguridad desde el diseño:** SSL/TLS, cifrado en reposo para imágenes/PII, logs de auditoría de accesos, MFA, aislamiento entre tenants.

### 6.5 Principios rectores (aprendidos de Frogmi)

- **Todo dato con contexto:** cada respuesta/ticket lleva local, activo, GPS, usuario, fecha y evidencia.
- **Cerrar el ciclo dentro de la plataforma:** evitar planillas, WhatsApp y correos para seguimiento; el circuito hallazgo→resolución→validación vive en el sistema.
- **Configurable por el negocio, no por desarrollo:** checklists, workflows, SLA y ponderaciones deben ser parametrizables sin tocar código.
- **Trazabilidad de extremo a extremo** como requisito no negociable.

### 6.6 Caso de prueba de referencia (para validar M Auditor)

Replicar el circuito propuesto en la fuente como test de aceptación integral:

> Un técnico visita un local, escanea el QR de una cámara frigorífica, informa temperatura fuera de rango, adjunta foto, el sistema crea un ticket crítico, lo asigna a mantenimiento, activa una tarea de contingencia, aplica un SLA, escala si no hay respuesta, registra la reparación, exige nueva medición y actualiza el historial del equipo — **sin planillas, correos ni carga duplicada**.

---

## 7. Anexo: matriz confirmado vs. pendiente

| Tema | Estado según fuente |
| :-- | :-- |
| App web y móvil (iOS/Android) | Confirmado |
| Dispositivos Zebra / Honeywell | Confirmado |
| Auditorías y checklists | Confirmado |
| Fotos y evidencias | Confirmado |
| QR para activos | Confirmado |
| Tickets de mantenimiento | Confirmado |
| Workflows configurables + actividades paralelas | Confirmado |
| SLA y escalamiento | Confirmado |
| Creación de ticket desde auditoría | Confirmado |
| Integración con sistemas de mantenimiento | Confirmado |
| APIs y conectores (apidoc.frogmi.com) | Confirmado |
| SSO y MFA | Confirmado |
| ISO 27001 | Declarado por Frogmi |
| Modo offline | No confirmado plenamente |
| Proveedor cloud | No publicado |
| Microservicios / Kubernetes | No confirmado |
| Motor de base de datos | No publicado |
| CMMS completo (repuestos y costos) | No confirmado |
| Optimización de rutas | No confirmada |
| Webhooks | A validar con el proveedor |
| Lista de precios oficial | No publicada (modelo por cotización) |

### Nota sobre precios

No existe tarifa pública oficial. Directorios externos citan referencias inconsistentes (~US$20–35/mes) que **no deben usarse para presupuestar** una implementación multi-local. Frogmi opera por cotización según módulos, locales, usuarios, implementación e integraciones.

---

*Informe generado en modo solo lectura. No se modificó el archivo fuente ni ningún otro recurso del proyecto. El contenido de terceros fue parafraseado y sintetizado para cumplir restricciones de licenciamiento.*
