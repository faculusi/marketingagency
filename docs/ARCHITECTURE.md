# ARCHITECTURE.md

Todo lo de este documento fue verificado directamente en código, Supabase (MCP) y Meta (MCP) el 2026-09-16. Donde no se pudo verificar, se marca explícitamente.

## Diagrama general

```
Meta Ads (clic)
   │
   ▼
Landing (redsolyluz | marketingagency)        [Vercel, HTML/JS estático]
   │  Meta Pixel (browser): fbq('track', ...)  ─────────────────► Meta (directo)
   │  POST /api/lead, /api/pageview, /api/lead-confirm
   ▼
meta-conversion-backend                        [Vercel serverless, Node ESM]
   │
   ├──► Supabase (Postgres 17, proyecto "marketingagency")
   │       tabla events: pending → success/error/skipped/not_applicable
   │
   └──► Meta Conversions API
           POST https://graph.facebook.com/{META_API_VERSION}/{META_PIXEL_ID}/events
           mismo event_id que el Pixel del browser → Meta deduplica

panel-cajero                                   [Vercel, proxy server-side]
   │  POST /api/register, /api/panel-users, /api/whatsapp-numbers, /api/contacts
   │  agrega header x-api-key: BACKEND_API_SECRET (nunca llega al navegador)
   ▼
meta-conversion-backend → Supabase / Meta (mismo camino que arriba)
```

## Backend — endpoints (`meta-conversion-backend`)

| Endpoint | Auth | Rol |
|---|---|---|
| `POST /api/lead` | público, CORS | Crea evento Lead. Soporta `defer_meta: true` (ver más abajo). |
| `POST /api/lead-confirm` | público, CORS | Envía a Meta un Lead que quedó con `defer_meta` pendiente. |
| `POST /api/pageview` | público, CORS | Evento PageView interno. Estructuralmente nunca va a Meta. |
| `POST /api/purchase` | `x-api-key` | Evento Purchase directo (contrato antiguo, sistema propio). |
| `POST /api/contact` | `x-api-key` | `?action=register` / `?action=confirm_purchase` — flujo del cajero. Soporta además el contrato legacy `status=purchase\|no_purchase`. |
| `GET /api/contacts` | `x-api-key` | Búsqueda/listado de contactos (RPC `search_contacts`). |
| `GET/POST /api/whatsapp-numbers` | `x-api-key` | CRUD + activar/dar de baja/restaurar números de WhatsApp. |
| `GET/POST /api/panel-users` | `x-api-key` | Gestión de cajeros/admins (gateado a admin por `panel-cajero`, no por este endpoint). |
| `GET /api/stats` | `x-api-key` | Estadísticas — motor v1 (`lib/stats.js`) o v2 (`lib/statsV2.js`) según `STATS_ENGINE`. |
| `GET /api/public-config` | público, `Cache-Control: no-store` | Único endpoint que expone el WhatsApp activo al navegador. No expone nada más. |
| `GET /api/cron-sync-ad-spend` | `Authorization: Bearer CRON_SECRET` | Cron diario (`vercel.json`: `0 6 * * *`) — sincroniza gasto real de Meta Ads → tabla `ad_spend`. |

## Supabase — esquema real (verificado con MCP)

Proyecto `marketingagency` (ref `wppbrmukfqwnjbeqxxws`), Postgres 17, región `ca-central-1`, estado `ACTIVE_HEALTHY`.

Todas las tablas tienen RLS **enabled** pero **CERO policies** (verificado con advisors) → acceso denegado por defecto vía `anon`/`authenticated`; el backend accede exclusivamente con `SUPABASE_SERVICE_ROLE_KEY` (bypassa RLS). Ver DECISIONS.md.

| Tabla | Filas (al auditar) | Rol |
|---|---|---|
| `events` | 3640 | Tabla central: todo evento Lead/Purchase/PageView/Contact-interno. `event_id` UNIQUE. `meta_status`: pending/sending/success/error/skipped/not_applicable. Atribución completa (campaign/adset/ad *_id y *_name, fbclid/fbc/fbp/click_id). `lead_ref`, `contact_id`→contacts, `parent_event_id`→events (self), `customer_type` (new/existing), `operator_user_id`→panel_users, `operator_session_id`→panel_sessions. |
| `contacts` | 637 | `phone` UNIQUE, `nickname`, `contact_name`, `last_seen_at`. |
| `whatsapp_numbers` | 10 | `phone` UNIQUE, `is_active` (máx. 1 activo, garantizado por índice único parcial + RPC transaccional), `status` (available/disabled). |
| `panel_users` | 4 | `username` UNIQUE, `password_hash`, `role` (admin/cashier), `is_active`. |
| `panel_sessions` | 118 | Sesiones del panel, FK a `panel_users`. |
| `ad_spend` | 20 | Gasto real por campaña/día desde Meta Marketing API. `spend_ars` es columna generada (`spend_usd × fx_usdc_ars`). |

RPCs/funciones Postgres relevantes (confirmadas en Supabase):
`register_lead_capture` (núcleo: vincula Lead↔teléfono↔Contact de forma atómica, con `SELECT ... FOR UPDATE`), `activate_whatsapp_number`, `search_contacts`, `contacts_counters`, `contacts_date_range`, `list_pending_captures`, `update_contact_phone`, `stats_date_range`, y la familia `stats_v2_*` (`leads_base`, `pageviews_base`, `summary`, `breakdowns`, `campaign_spend`, `classify_landing`, `finalize_summary`).

**Migraciones:** el repo versiona 001 y 015–021 (015 es un snapshot documental de funciones que ya existían sin versionar en Supabase). Las migraciones 002–014 **no existen en el repo** — se aplicaron directo en el SQL Editor de Supabase (confirmado por el propio comentario de 015 y porque `list_migrations` de Supabase solo trackea entradas desde 2026-09-08). **Diferencia código↔Supabase confirmada:** el historial temprano del esquema no es reconstruible solo desde el repo.

Advisors de seguridad (Supabase, verificado hoy): 6 tablas con RLS enabled sin policies (ver arriba) + 16 funciones con `search_path` mutable (warning estándar; no explota nada por sí solo dado que no hay acceso `anon`).

## Meta — Pixel / Conversions API (verificado con MCP Meta)

- **Dataset/Pixel:** `1999888117386965` ("Red Sol y Luz - Septiembre"), `business_id` 1348229227160839, `is_active: true`, disparando eventos en vivo (verificado el mismo día de la auditoría). `data_use_setting: advertising_and_analytics`.
- Mismo Pixel ID hardcodeado en el `<head>` de `redsolyluz/index.html` y `marketingagency/index.html`.
- **Eventos reales recibidos** (últimos 7 días, verificado): `PageView`, `Lead`, `Purchase` — decenas de Lead/día, varias Purchase/día.
- **EMQ (calidad de matching, verificado):** Lead 5.7/10, PageView 6.1/10, Purchase 6.9/10. Purchase tiene `phone` al 100% (lo aporta el cajero); Lead/PageView dependen de `fbc`/`fbp` del navegador (cobertura fbp ~67-100% según evento).
- **Dedupe Pixel↔CAPI — diferencia real entre landings:**
  - `marketingagency` dispara `fbq('track','Lead', {}, {eventID: eventId})` en el browser con el **mismo** `event_id` que manda a `/api/lead` (envío inmediato, sin `defer_meta`).
  - `redsolyluz` **no** dispara `Lead` por Pixel (solo `PageView` automático) y usa `defer_meta: true` en `/api/lead`: el Lead se guarda al instante pero se envía a Meta CAPI recién cuando la landing llama a `/api/lead-confirm`, justo antes de abrir WhatsApp.
- `lib/meta.js` **nunca** envía `campaign_id`/`adset_id`/`ad_id`/`fbclid` a Meta (decisión explícita en el código): quedan solo en Supabase, para atribución interna.
- **CORS** (`lib/cors.js`) permite: `redsolyluz.vercel.app`, `solyluz.vercel.app` (repo no identificado, ver PROJECT_CONTEXT.md), `marketingagency-three.vercel.app`, más lo que agregue `ALLOWED_ORIGIN`.
- **Cuentas publicitarias Meta accesibles** con las credenciales de esta sesión (verificado, no necesariamente todas ligadas a este proyecto): 4 cuentas, bajo los business "scaleachicha" (mismo `business_id` 1348229227160839 que el dataset del Pixel) y "Facundo Lusi". No se auditaron campañas/gasto específicos más allá de lo que ya sincroniza `ad_spend`.

## Variables de entorno (solo nombres, nunca valores)

- **meta-conversion-backend:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `META_PIXEL_ID`, `META_ACCESS_TOKEN`, `META_API_VERSION`, `META_TEST_EVENT_CODE` (opcional), `META_ADS_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` (para el cron de ad_spend, separadas de las de CAPI), `BACKEND_API_SECRET`, `ALLOWED_ORIGIN`, `CRON_SECRET`, `STATS_ENGINE`.
- **panel-cajero:** `BACKEND_API_SECRET` (mismo valor que el backend), `BACKEND_API_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `PANEL_PASSWORD` (solo sesión de emergencia). Sin variables de Supabase ni Meta.
- **redsolyluz / marketingagency:** ninguna — son estáticos, `config.js`/constantes embebidas apuntan a `https://meta-conversion-backend.vercel.app`.

## Diferencias entre repos que afectan arquitectura

- Solo `meta-conversion-backend` toca Supabase y Meta. Los otros 3 repos son clientes puros de ese backend.
- `redsolyluz` (patrón `defer_meta`) y `marketingagency` (envío inmediato) resuelven el mismo problema (Lead + WhatsApp) con flujos distintos — no unificar sin revisar el impacto en cada Pixel/CAPI dedupe.
- `panel-cajero` es el único de los 3 clientes que requiere autenticación de usuario (login con roles); las landings son 100% públicas.
