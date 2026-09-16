# DECISIONS.md

Decisiones que Claude debe recordar para no romper el sistema. Solo se listan las verificables en código/Supabase/Meta o explícitas en comentarios del propio repo — no se inventan motivos.

---

### Acceso a Supabase solo con service role key, sin RLS policies

**Qué se decidió:** el backend accede a Supabase únicamente con `SUPABASE_SERVICE_ROLE_KEY`. Las 6 tablas tienen RLS enabled pero cero policies (deny-all para `anon`/`authenticated`).
**Motivo:** ningún cliente (landings, panel) usa `supabase-js` directamente — todo el acceso pasa por el backend server-side (verificado: sin dependencia de Supabase en `panel-cajero` ni en las landings).
**Estado:** Vigente.

### Nunca hardcodear un número de WhatsApp de respaldo en las landings

**Qué se decidió:** `WHATSAPP_NUMBER` queda vacío a propósito en `redsolyluz/config.js`; la resolución del número vive solo en `/api/public-config` + cadena de respaldo (último conocido <1h → estado de espera).
**Motivo:** un placeholder `"549XXXXXXXXXX"` causó en producción que `sanitizeWhatsappPhone` lo redujera a `"549"` y mandara usuarios a un `wa.me` muerto sin que nadie se enterara (comentado explícitamente en el código). Las líneas de captación se bloquean en horas.
**Estado:** Vigente.

### `redsolyluz` difiere el envío del Lead a Meta CAPI; `marketingagency` lo envía inmediato

**Qué se decidió:** `redsolyluz` usa `defer_meta: true` + `/api/lead-confirm` (el Lead se guarda al instante pero se manda a Meta recién al intentar abrir WhatsApp, y no dispara `Lead` por Pixel). `marketingagency` envía el Lead a Meta CAPI de inmediato en `/api/lead`, junto con `fbq('track','Lead', ...)` en el browser con el mismo `event_id`.
**Motivo:** no documentado explícitamente en comentarios — verificado como comportamiento real en ambos repos, no tratado como inconsistencia a corregir.
**Estado:** Vigente en ambos, cada landing con su propio comportamiento.

### `campaign_id`/`adset_id`/`ad_id`/`fbclid` nunca se envían a Meta CAPI

**Qué se decidió:** `lib/meta.js` arma `user_data`/`custom_data` sin esos campos.
**Motivo:** no aportan al matching de Meta (no son parte de `user_data`); son atribución interna, se guardan solo en Supabase (comentario explícito en el código).
**Estado:** Vigente.

### Máximo un Purchase por Lead

**Qué se decidió:** protegido en dos capas: chequeo previo en la aplicación (`findPurchaseByParentEventId`) + índice único parcial `idx_events_purchase_unique_per_lead` en Postgres.
**Motivo:** evitar doble carga/doble evento por el mismo lead, incluso ante condiciones de carrera entre dos requests casi simultáneas.
**Estado:** Vigente.

### `panel-cajero` no tiene ninguna credencial de Supabase o Meta

**Qué se decidió:** es un repo/proyecto Vercel completamente separado; el único secreto que conoce es `BACKEND_API_SECRET`, usado server-side en `api/*.js` para hablar con el backend.
**Motivo:** el HTML/JS del panel es código público que ve cualquiera que abra el navegador — ningún secreto puede vivir ahí (explícito en README y en `lib/backendProxy.js`).
**Estado:** Vigente.

### Sesión de "emergencia" en el panel, paralela a `panel_users`

**Qué se decidió:** el panel soporta dos modos de sesión: completa (usuario/contraseña contra `panel_users`, con rol `admin`/`cashier`) y de emergencia (usuario en blanco + `ADMIN_PASSWORD`/`PANEL_PASSWORD`).
**Motivo:** salida de emergencia para no bloquear el panel si `panel_users` fallara el día del lanzamiento (explícito en `lib/session.js`). El código referencia un archivo "LEEME" con el plan de retiro que **no existe en el repo**.
**Estado:** Vigente (la sesión de emergencia sigue activa en el código). Discrepancia: la documentación de su retiro está ausente — no asumir que ya se retiró ni que hay fecha para hacerlo.

### `normalizePhoneAR` solo reconoce celulares argentinos completos

**Qué se decidió:** exige exactamente `549` + 10 dígitos; cualquier otro formato se rechaza (`null`).
**Motivo:** limitación conocida y aceptada — cubre los formatos comunes de escritura (espacios/guiones/paréntesis, con o sin "15", con o sin "0" inicial), pero Argentina no tiene largo de característica fijo. Se prefirió validación estricta antes que sumar una dependencia como `libphonenumber-js` (comentado explícitamente en `lib/phone.js`).
**Estado:** Vigente.

### `lib/eventPipeline.js` solo lo usa `api/contact.js`

**Qué se decidió:** `api/lead.js` y `api/purchase.js` mantienen su propia copia de la misma secuencia guardar→enviar a Meta→actualizar estado, en vez de usar el helper compartido.
**Motivo:** evitar tocar código que ya funcionaba solo para eliminar duplicación (explícito en el comentario del archivo).
**Estado:** Vigente — no tratar como deuda técnica a "corregir" sin que se pida explícitamente.

### README desactualizados en `panel-cajero` y `redsolyluz`

**Qué se decidió (constatación, no decisión de equipo):** el `README.md` de `panel-cajero` describe una "V1" sin login/roles/dashboard, y el de `redsolyluz` es genérico (no menciona "Red Sol y Luz" ni el copy real "60% extra"). El código real de ambos ya tiene login con roles, rediseño visual y el copy específico del producto.
**Motivo:** el código evolucionó sin actualizar esos README.
**Estado:** Discrepancia confirmada — no usar esos README como fuente de verdad de la funcionalidad actual; usar ARCHITECTURE.md y el código.
