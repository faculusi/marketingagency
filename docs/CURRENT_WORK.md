# CURRENT_WORK

_Refleja el estado al 2026-09-16. Reemplazar esta sección en la próxima actualización, no acumular._

## Objetivo actual

**Incierto.** No hay una tarea o ticket explícito más allá de la última actividad de commits por repo (ver abajo). Esta misma auditoría fue la tarea de la sesión que generó este documento.

## Estado

Sistema funcionando end-to-end en producción: Pixel activo, eventos fluyendo en vivo (verificado hoy en Meta), Supabase con datos reales (3640 eventos, 637 contactos). Últimos commits por repo (más reciente primero):

- **meta-conversion-backend:** fix de caché en `/api/public-config`; ROAS real (`ad_spend`, sync de gasto de Meta Ads, `spend_ars`/`roas` en Estadísticas v2); filtro por `customer_type` en Contactos; 3 buckets reales de Pendientes (fresh/aging/non_converted).
- **panel-cajero:** destacar Registrado→Purchase en vez de Lead→Purchase en Estadísticas; rediseño visual v1 "Tanda 1" (jerarquía de tarjetas, KPIs, tabla de comparación, skeleton, nav activa); ROAS real por campaña; mismo filtro de `customer_type`.
- **redsolyluz:** "nunca abrir WhatsApp sin un número real" (cadena de respaldo + estado de espera).
- **marketingagency:** "el CTA espera el número real en vez de usar el placeholder" — integración reciente al ecosistema central (Meta Pixel + backend + WhatsApp compartidos).

## Completado

- Flujo Lead→WhatsApp→Registro→Purchase con atribución completa a Meta, verificado activo en producción.
- ROAS real (gasto sincronizado diariamente desde Meta Marketing API vía cron).
- Rediseño visual v1 (Tanda 1) del panel.
- Integración de `marketingagency` al mismo ecosistema que `redsolyluz`.

## Pendiente

No se encontraron TODOs de alto nivel explícitos en el código. Posible pendiente (no confirmado como tarea activa): retiro de la sesión de "emergencia" del panel (`ADMIN_PASSWORD`/`PANEL_PASSWORD`) — `api/login.js` menciona un archivo "LEEME" con el plan de retiro que **no existe en el repo**.

## Próxima acción

No definida por el usuario en esta sesión.

## Archivos relevantes (por repo)

- `meta-conversion-backend`: `api/*.js`, `lib/*.js`, `migrations/*.sql`.
- `panel-cajero`: `api/*.js`, `lib/*.js`, `*.html`/`*.js` por sección (cajeros, contactos, estadísticas, pendientes, whatsapp).
- `redsolyluz`: `config.js`, `app.js`, `index.html`.
- `marketingagency`: `index.html` (todo el sitio + config embebida en un solo archivo).

## Riesgos / No tocar

- No agregar RLS policies sin entender que el diseño actual depende 100% de la service role key — una policy mal hecha puede romper el backend si algún día se usa la anon key, o dar una falsa sensación de seguridad si no se usa.
- No hardcodear ningún número de WhatsApp de respaldo en las landings (causó un bug real en producción — ver DECISIONS.md).
- No unificar el flujo `defer_meta` de `redsolyluz` con el envío inmediato de `marketingagency` sin verificar el impacto en el dedupe Pixel/CAPI de cada una.
- Las migraciones 002–014 no existen en el repo — no asumir que se pueden reconstruir ni reaplicar.
- `README.md` de `panel-cajero` (describe una "V1" sin login/roles) y de `redsolyluz` (genérico) están desactualizados respecto al código real — no usarlos como fuente de verdad de funcionalidad actual.
