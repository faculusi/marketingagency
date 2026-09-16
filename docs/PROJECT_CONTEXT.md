# PROJECT_CONTEXT.md

## Qué es el proyecto

Sistema de captación y conversión de leads por WhatsApp, con atribución completa a Meta Ads (Pixel + Conversions API), para un negocio operado por "cajeros" que registran teléfonos reales y cargas/depósitos de clientes.

**Inferencia a partir del código (no confirmada explícitamente por el usuario):** por el copy de las landings ("quiero mi 60% de bienvenida/extra"), el vocabulario del panel ("cajero", "carga", "monto") y los nombres de tablas, parece un negocio de recargas de saldo/fichas (tipo casa de apuestas o casino online) que capta clientes vía anuncios de Meta y los deriva a WhatsApp para completar el alta y la primera carga real.

## Problema que resuelve

- Asociar cada clic de un anuncio de Meta con: si la persona llegó a WhatsApp, si se registró (teléfono real vinculado) y si hizo una carga real (Purchase) — para optimizar campañas por resultado real, no solo por clic o Lead.
- Los números de WhatsApp de captación se bloquean con frecuencia (documentado en código: hasta 4 números distintos bloqueados en 24 hs). El número activo debe poder cambiarse en caliente desde un panel, nunca quedar hardcodeado en una landing.

## Componentes (4 repositorios)

1. **meta-conversion-backend** — Backend único, serverless (Vercel/Node ESM). Recibe eventos (Lead, Purchase, PageView, Contact) de landings y del panel, los persiste en Supabase y los reenvía a Meta Conversions API. Es el HUB del sistema.
2. **panel-cajero** — Panel web interno. Login con roles (`admin`/`cashier`), registra el teléfono real de un lead contra su `lead_ref`, confirma cargas, gestiona números de WhatsApp activos, contactos, cajeros y estadísticas. Sin credenciales de Supabase ni Meta propias.
3. **redsolyluz** — Landing pública estática, producto "Red Sol y Luz". Un clic desde Meta Ads genera un Lead, resuelve el WhatsApp activo vía el backend y redirige con un código de descuento (`lead_ref`).
4. **marketingagency** — Landing/sitio de marketing integrado al mismo ecosistema (mismo backend, mismo Pixel, mismo flujo Lead→WhatsApp). Antes era un proyecto aparte; se integró después (ver historial de commits: "Integrar marketingagency al ecosistema central de Meta/WhatsApp").

## Flujo general

```
Meta Ads → landing (redsolyluz | marketingagency)
   → POST /api/lead (backend) → Supabase events(pending) → Meta CAPI → Supabase events(success/error)
   → redirección a WhatsApp con lead_ref
   → cajero (panel-cajero) registra teléfono real contra ese lead_ref
   → Supabase RPC register_lead_capture → vincula Lead ↔ Contact
   → si hay carga real, cajero confirma monto → evento Purchase → Meta CAPI
```

## Tecnologías

- **Backend:** Node.js ESM, funciones serverless de Vercel, `@supabase/supabase-js`, `bcryptjs`. Sin framework — handlers planos en `api/*.js`.
- **Panel:** HTML/CSS/JS vanilla, Chart.js vendorizado. Sesión propia por cookie HMAC-firmada (no usa Supabase Auth).
- **Landings:** HTML/CSS/JS estático puro, sin build, deploy directo a Vercel.
- **DB:** Supabase (Postgres 17) — un único proyecto (`marketingagency`, ref `wppbrmukfqwnjbeqxxws`, región ca-central-1) compartido por todo el ecosistema.
- **Tracking:** Meta Pixel (browser) + Meta Conversions API (server), deduplicados por `event_id`/`eventID` compartido.

## Relación entre los repositorios

- `panel-cajero` y las landings **nunca** acceden a Supabase ni a Meta directamente — todo pasa por `meta-conversion-backend`, autenticado con `BACKEND_API_SECRET` (server-side) o protegido por CORS (endpoints públicos de landing).
- El mismo Pixel de Meta (`1999888117386965`, dataset "Red Sol y Luz - Septiembre") está embebido en redsolyluz y en marketingagency.
- Cada repo es un proyecto Vercel independiente, desplegado por separado, pero los 4 conforman un solo sistema productivo.
- No se encontró un 5º componente. Si aparece en el futuro, agregarlo acá antes de asumir que forma parte del sistema.

## Discrepancia detectada

`lib/cors.js` del backend permite además el origen `https://solyluz.vercel.app`, que no corresponde a ningún repo de este workspace — posible alias de dominio de `redsolyluz` o remanente histórico. **No verificado.**
