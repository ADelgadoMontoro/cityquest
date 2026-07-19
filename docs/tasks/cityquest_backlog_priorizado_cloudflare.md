# CityQuest — Backlog priorizado actualizado a Cloudflare

Documento de backlog inicial para CityQuest, reordenado según el estado real actual del repositorio y el siguiente vertical slice con más impacto.

## Criterio de priorización

La prioridad sigue ahora este enfoque de **vertical slice funcional ajustado al repo actual**:

1. Mantener visibles las foundations ya cerradas.
2. Convertir la base D1 en contenido real del MVP.
3. Exponer primero endpoints públicos de lectura.
4. Conectar la app móvil a contenido real antes de profundizar en auth.
5. Añadir validación, progreso y modo demo sobre flujo jugable real.
6. Diseñar e implementar autenticación cuando ya haya presión clara de producto.
7. Abrir panel admin, analíticas y automatización después del primer slice jugable.

La arquitectura actual del MVP evita AWS por coste y usa:

- **Cloudflare Workers** para API backend.
- **Cloudflare D1** para base de datos.
- **Cloudflare Pages** para panel admin y landing.
- **Cloudflare R2** solo más adelante para assets multimedia controlados.

---

## Backlog priorizado

Convención visual:

- `✅` completado en el repositorio
- `⬜` pendiente
- `🟨` pendiente, pero ya replanteado o parcialmente absorbido por trabajo previo

| Prioridad | Estado | ID | Título | Épica | Descripción breve | Resultado esperado |
|---:|---|---|---|---|---|---|
| 1 | ✅ | EVO-0001 | Crear monorepo CityQuest | Setup y Arquitectura Base | Crear la estructura inicial del repositorio separando app móvil, panel admin, backend Worker, paquetes compartidos y documentación. | Repositorio organizado y preparado para desarrollar el MVP sin mezclar responsabilidades. |
| 2 | ✅ | EVO-0005 | Definir configuración compartida | Setup y Arquitectura Base | Configurar TypeScript, ESLint, Prettier, scripts comunes, variables de entorno y convenciones del monorepo. | Base técnica coherente para trabajar en mobile, admin y API con estándares comunes. |
| 3 | ✅ | EVO-0002 | Inicializar app Expo | Setup y Arquitectura Base | Crear la aplicación móvil base con React Native y Expo, preparada para el flujo principal del MVP. | App móvil ejecutable en local con estructura inicial limpia. |
| 4 | ✅ | EVO-0003 | Inicializar panel Next.js | Setup y Arquitectura Base | Crear la base del panel admin y posible landing con Next.js dentro del monorepo. | Panel web ejecutable en local y preparado para futuras pantallas admin. |
| 5 | ✅ | EVO-0004 | Inicializar backend Cloudflare Workers | Setup y Arquitectura Base | Crear la base del backend TypeScript orientada a Cloudflare Workers. | Worker backend local funcional, sin lógica de negocio todavía. |
| 6 | ✅ | EVO-0006 | Configurar proyecto Cloudflare | Infraestructura Cloudflare | Configurar Wrangler, entornos, scripts y estructura cloud del proyecto. | Proyecto preparado para desarrollo local y futuros despliegues en Cloudflare. |
| 7 | ✅ | EVO-0007 | Configurar Worker API base | Infraestructura Cloudflare | Crear la API backend base con Cloudflare Workers como punto de entrada del MVP. | API Worker preparada para recibir rutas HTTP. |
| 8 | 🟨 | EVO-0008 | Crear Worker backend mínimo | Infraestructura Cloudflare | Implementar el primer Worker funcional preparado para recibir rutas HTTP. | Backend mínimo accesible localmente desde Wrangler. |
| 9 | ✅ | EVO-0015 | Implementar healthcheck Worker | Backend MVP | Crear `GET /health` para validar que la API Worker está desplegada y operativa. | Endpoint de salud funcional con respuesta JSON estable. |
| 10 | ✅ | EVO-0009 | Provisionar base de datos D1 | Infraestructura Cloudflare | Crear la base de datos Cloudflare D1 para almacenar datos del MVP. | Base D1 creada y preparada para migraciones/esquema. |
| 11 | ✅ | EVO-0070 | Definir esquema D1 del MVP | Modelo de Datos y Gestión de Contenido | Convertir el modelo de datos inicial en tablas SQL compatibles con Cloudflare D1. | Esquema SQL inicial del MVP definido y aplicable a D1. |
| 12 | ✅ | EVO-0071 | Crear seed Jaén en D1 | Modelo de Datos y Gestión de Contenido | Insertar los datos iniciales del destino Jaén y la ruta Jaén: Ecos de Piedra. | Destino Jaén y ruta MVP disponibles en base de datos. |
| 13 | ✅ | EVO-0072 | Crear seed Catedral en D1 | Modelo de Datos y Gestión de Contenido | Insertar el POI Catedral de Jaén y sus primeros objetivos visuales. | Catedral disponible como POI real del MVP. |
| 14 | ✅ | EVO-0073 | Crear seed Baños Árabes en D1 | Modelo de Datos y Gestión de Contenido | Insertar el POI Baños Árabes y su primer objetivo visual viable para el MVP. | Baños Árabes disponible como segundo POI real del MVP. |
| 15 | ✅ | EVO-0020 | Implementar listado de destinos en Worker | Backend MVP | Crear endpoint para listar destinos disponibles y bloqueados desde D1. | La API devuelve Jaén disponible y destinos futuros bloqueados. |
| 16 | ✅ | EVO-0021 | Implementar detalle de ruta en Worker | Backend MVP | Crear endpoint para obtener ruta, POIs, objetivos y contenido publicado. | La app puede cargar Jaén: Ecos de Piedra desde backend real. |
| 17 | ✅ | EVO-0024 | Crear navegación móvil base | App Móvil MVP | Configurar la navegación principal de la app móvil y estructura de pantallas. | App móvil preparada para moverse entre pantallas principales. |
| 18 | ✅ | EVO-0026 | Crear selector de provincia | App Móvil MVP | Mostrar Jaén disponible y Úbeda, Baeza y Cazorla como destinos bloqueados. | Selector de destino alineado con el progreso de provincia del MVP. |
| 19 | ✅ | EVO-0027 | Crear pantalla detalle de ruta | App Móvil MVP | Mostrar información de Jaén: Ecos de Piedra, duración, dificultad, POIs y modo demo/real. | El usuario puede revisar la ruta antes de iniciarla. |
| 20 | ✅ | EVO-0028 | Crear pantalla objetivo actual | App Móvil MVP | Mostrar descripción del objetivo, pistas progresivas, dificultad y acceso a cámara. | Pantalla principal de gameplay preparada. |
| 21 | ✅ | EVO-0032 | Desbloquear contenido desde D1 | Backend MVP | Entregar contenido narrativo solo cuando el objetivo haya sido validado. | El usuario recibe contenido desbloqueado tras validar un objetivo. |
| 22 | ✅ | EVO-0016 | Crear seeds de hints del MVP | Modelo de Datos y Gestión de Contenido | Insertar pistas progresivas reales en D1 para los primeros objetivos jugables del MVP. | Los objetivos del MVP disponen de hints reales versionadas en base de datos. |
| 23 | ✅ | EVO-0019 | Exponer hints desde D1 en Worker | Backend MVP | Crear endpoint para devolver hints progresivas reales por objetivo desde D1. | Mobile y gameplay pueden pedir hints reales a través de la API. |
| 24 | ✅ | EVO-0017 | Mostrar contenido desbloqueado en móvil | App Móvil MVP | Consumir el unlock real desde backend y presentarlo como recompensa narrativa al usuario. | La app puede mostrar contenido desbloqueado real tras el objetivo. |
| 25 | ✅ | EVO-0057 | Añadir tests automáticos iniciales del MVP | Calidad y Testing | Proteger con tests ligeros los adapters móviles live, contratos clave del Worker y un primer flujo importante del MVP. | El slice actual gana una red de seguridad automática útil sin introducir una plataforma de testing pesada. |
| 26 | ✅ | EVO-0018 | Orquestar validación mock hacia reward | Gameplay MVP | Conectar el objetivo actual con una transición temporal de éxito que lleve al contenido desbloqueado. | El flujo jugable tiene una costura explícita entre objetivo y recompensa. |
| 27 | ✅ | EVO-0029 | Crear captura de imagen | Validación GPS e Imagen | Implementar la captura de foto desde la app móvil para validar objetivos visuales. | La app puede tomar o seleccionar una imagen para validación. |
| 28 | ✅ | EVO-0030 | Implementar validación GPS básica | Validación GPS e Imagen | Comparar la ubicación del usuario con el radio configurado del objetivo. | Validación geográfica básica funcionando. |
| 28a | 📝 | FOLLOW-UP | Revisar radios GPS del MVP | Validación GPS e Imagen | Recalibrar `gpsRadiusMeters` con pruebas reales en calle para evitar radios demasiado exigentes como `20m` en móvil. | La validación GPS usa radios realistas y menos frustrantes para usuarios reales. |
| 29 | ✅ | EVO-0031 | Implementar validación visual mock | Validación GPS e Imagen | Crear una validación visual simulada para completar el flujo antes de integrar visión real. | El vertical slice puede avanzar sin visión artificial real. |
| 30 | ✅ | EVO-0033 | Registrar objetivo completado en D1 | Backend MVP | Guardar objetivos completados, progreso y logros básicos asociados. | El sistema registra avance real del usuario. |
| 30a | ✅ | EVO-0058 | Crear pantalla de objetivos por POI y progreso básico | App Móvil MVP | Mostrar objetivos completados, objetivo actual y objetivos bloqueados dentro de cada POI. | El usuario entiende qué puede jugar, continuar o revisitar en cada POI. |
| 31 | ⬜ | EVO-0034 | Implementar flujo demo completo | Modo Demo Portfolio | Permitir completar Jaén: Ecos de Piedra sin estar físicamente en Jaén. | Demo completa usable desde casa para portfolio y vídeo. |
| 32 | ⬜ | EVO-0035 | Añadir imágenes demo | Modo Demo Portfolio | Incorporar imágenes de prueba asociadas a cada objetivo visual del MVP. | El modo demo puede validar objetivos con assets de prueba. |
| 33 | 🟨 | EVO-0012 | Definir autenticación sin Cognito | Autenticación y Seguridad | Diseñar la estrategia de autenticación del MVP compatible con Workers y D1. | Decisión técnica clara para login, sesiones y protección básica. |
| 34 | ⬜ | EVO-0011 | Configurar Cloudflare Pages | Infraestructura Cloudflare | Preparar Cloudflare Pages para desplegar el panel admin y/o landing pública. | Base de despliegue web preparada para admin/landing. |
| 35 | ⬜ | EVO-0036 | Crear login admin compatible con Workers | Panel de Administración | Implementar acceso al panel admin usando la estrategia de autenticación del MVP. | Panel protegido para usuarios administradores. |
| 36 | ⬜ | EVO-0037 | Crear dashboard admin mínimo | Panel de Administración | Mostrar resumen básico de rutas, destinos, objetivos y estado general del MVP. | Admin dashboard inicial útil para portfolio. |
| 37 | ⬜ | EVO-0022 | Implementar inicio de ruta en D1 | Backend MVP | Registrar el inicio de una ruta para usuario, invitado o cuenta demo. | El usuario puede iniciar una ruta y generar estado de progreso. |
| 38 | ⬜ | EVO-0023 | Implementar progreso de ruta en D1 | Backend MVP | Consultar y actualizar el progreso del usuario dentro de una ruta. | El progreso se guarda y recupera desde D1. |
| 39 | ⬜ | EVO-0025 | Crear login móvil/demo | App Móvil MVP | Implementar acceso inicial como usuario, invitado o cuenta demo. | Pantalla inicial de acceso funcional para el MVP. |
| 40 | ⬜ | EVO-0013 | Crear roles usuario/admin en D1 | Autenticación y Seguridad | Gestionar roles básicos de usuario y administrador desde la base de datos. | Roles mínimos disponibles para separar usuario visitante y admin. |
| 41 | ⬜ | EVO-0014 | Crear cuenta demo en D1 | Autenticación y Seguridad | Crear una cuenta demo separada para portfolio, pruebas y grabación del flujo completo. | Cuenta demo preparada sin contaminar usuarios ni analíticas reales. |
| 42 | ⬜ | EVO-0038 | Crear gestión de destinos/rutas | Panel de Administración | Permitir consultar, crear y editar destinos y rutas desde el panel admin. | Gestión básica de rutas sin tocar código. |
| 43 | ⬜ | EVO-0039 | Crear gestión de POIs/objetivos | Panel de Administración | Permitir consultar, crear y editar POIs y objetivos visuales. | Gestión básica de puntos y objetivos desde admin. |
| 44 | ⬜ | EVO-0040 | Crear editor de contenido | Panel de Administración | Permitir editar texto breve, texto ampliado, diario, imagen futura y audio futuro. | Contenido narrativo editable desde panel propio. |
| 45 | ⬜ | EVO-0041 | Configurar logs de Cloudflare Workers | Analíticas y Observabilidad | Usar logs y trazas básicas de Cloudflare para revisar errores del backend. | Errores y comportamiento del Worker revisables. |
| 46 | ⬜ | EVO-0042 | Registrar eventos básicos en D1 | Analíticas y Observabilidad | Guardar eventos como ruta iniciada, objetivo completado, pista usada y validación fallida. | Analíticas básicas persistidas en D1. |
| 47 | ⬜ | EVO-0043 | Mostrar analíticas desde D1 | Analíticas y Observabilidad | Mostrar métricas simples en el panel admin a partir de eventos guardados en D1. | Admin puede consultar uso básico del MVP. |
| 48 | ⬜ | EVO-0044 | Configurar pipeline con Wrangler | CI/CD y Despliegue | Configurar GitHub Actions para instalar, validar y preparar despliegues Cloudflare. | Pipeline base de validación y despliegue preparado. |
| 49 | ⬜ | EVO-0045 | Automatizar despliegue Worker | CI/CD y Despliegue | Desplegar automáticamente la API backend en Cloudflare Workers. | Backend desplegable desde GitHub Actions. |
| 50 | ⬜ | EVO-0046 | Automatizar despliegue Pages | CI/CD y Despliegue | Desplegar automáticamente el panel admin y/o landing en Cloudflare Pages. | Admin/landing desplegable desde GitHub Actions. |
| 51 | ⬜ | EVO-0047 | Crear README técnico inicial | Documentación y Portfolio | Explicar qué es CityQuest, stack, estructura del repo, ejecución local y objetivo del MVP. | README profesional para GitHub y revisión técnica. |
| 52 | ⬜ | EVO-0048 | Crear diagrama arquitectura Cloudflare | Documentación y Portfolio | Documentar la arquitectura con Expo, Next.js, Pages, Workers, D1 y R2 futuro. | Diagrama claro de arquitectura para portfolio. |
| 53 | ✅ | EVO-0049 | Documentar decisión Cloudflare | Documentación y Portfolio | Registrar el cambio de AWS a Cloudflare por coste, simplicidad y viabilidad del MVP. | ADR o nota técnica con la decisión de arquitectura. |
| 54 | ⬜ | EVO-0050 | Preparar narrativa portfolio | Documentación y Portfolio | Redactar cómo presentar CityQuest como proyecto full-stack/serverless de portfolio. | Pitch técnico y funcional listo para CV/GitHub/LinkedIn. |
| 55 | ⬜ | EVO-0051 | Preparar guion demo MVP | Documentación y Portfolio | Crear el guion para grabar el flujo principal del producto de principio a fin. | Guion listo para vídeo demostrativo. |
| 56 | ⬜ | EVO-0052 | Integrar IA compatible con Workers | IA Controlada | Preparar integración con proveedor IA desde Cloudflare Workers sin dependencia de AWS. | Base técnica para IA acotada en el backend. |
| 57 | ⬜ | EVO-0053 | Generar pistas con IA | IA Controlada | Generar borradores de pistas progresivas a partir de contenido validado. | Herramienta admin para crear pistas revisables. |
| 58 | ⬜ | EVO-0054 | Generar resúmenes narrativos | IA Controlada | Crear versiones resumidas y divulgativas del contenido histórico. | Borradores de contenido breve generados para revisión humana. |
| 59 | ⬜ | EVO-0055 | Crear chat guía limitado | IA Controlada | Implementar chat contextual restringido al POI o ruta actual. | Chat guía limitado a contenido aprobado. |
| 60 | ⬜ | EVO-0056 | Implementar control anti alucinaciones | IA Controlada | Limitar la IA para que no invente información fuera del contenido aprobado. | Respuestas de IA acotadas, seguras y trazables. |
| 56 | ✅ | EVO-0010 | Posponer R2 para multimedia | Infraestructura Cloudflare | Documentar R2 como almacenamiento futuro para imágenes, audios y assets controlados. | R2 queda explícitamente fuera del arranque para evitar scope creep. |

---

## Notas de backlog

- `EVO-0016`, `EVO-0017`, `EVO-0018`, `EVO-0019`, `EVO-0057` y `EVO-0058` cubren el tramo real entre objetivo, hints, recompensa, progreso básico visible por POI y primera red de seguridad automática del slice jugable.
- `EVO-0033` queda cerrado con persistencia MVP de completion para actor temporal; para testing local se elevan temporalmente los radios publicados a `700m`, pero la recalibración final de radios y tolerancia GPS sigue anotada como follow-up porque las pruebas reales muestran precisiones habituales de `70m` a `100m`.
- El modelo de datos se mueve a EVO-0070 a EVO-0073.
- R2 se mantiene como decisión futura, no como dependencia del primer vertical slice.
- La validación visual real queda fuera de este backlog inicial. Primero se implementa validación mock para cerrar el flujo jugable.
- La autenticación se retrasa respecto al orden inicial para no diseñarla con demasiada especulación antes de tener datos reales y endpoints públicos de lectura.
- `EVO-0008` aparece como `🟨` porque su intención original quedó absorbida en gran parte por `EVO-0004`, `EVO-0006` y `EVO-0007`, aunque no se ha formalizado todavía como cerrada o superseded.
