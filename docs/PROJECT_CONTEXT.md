# PROJECT_CONTEXT.md — marketingagency

## Qué es

Landing/sitio de marketing integrado al mismo ecosistema que `redsolyluz` (mismo backend, mismo Pixel, mismo flujo Lead→WhatsApp). Antes era un proyecto aparte; se integró después. Contexto completo del ecosistema (los 4 repos, el negocio, el flujo general): ver `docs/PROJECT_CONTEXT.md` de `meta-conversion-backend`.

## Qué función cumple

Landing pública que capta leads desde Meta Ads y los deriva a WhatsApp, con envío inmediato del evento Lead a Meta CAPI (a diferencia de `redsolyluz`).

## Flujo de lead

```
Meta Ads → marketingagency (Pixel fbq Lead + PageView) → POST /api/lead (envío inmediato)
   → Meta CAPI recibe el mismo event_id que el Pixel del browser → Meta deduplica
   → resuelve WhatsApp activo (GET /api/public-config) → abre WhatsApp con lead_ref
```

## Con qué se comunica

- **Único** backend: `meta-conversion-backend`, público vía CORS, sin secretos en el navegador.
- Meta Pixel `1999888117386965` embebido (mismo que `redsolyluz`).

## Integraciones principales

- `POST /api/lead` (envío inmediato, sin `defer_meta`), `fbq('track','Lead', {}, {eventID})` en el browser, `GET /api/public-config`.
- Deduplicación Pixel↔CAPI: mismo `event_id` en ambos envíos.
- `landing_variant: "marketingagency"` (`MA_CONFIG.LANDING_VARIANT`) — identifica esta landing en `events.landing_variant`.

## Restricciones importantes

- Nunca hardcodear un número de WhatsApp de respaldo — ver `DECISIONS.md`.
- Sin credenciales de Supabase ni Meta en este repo.
