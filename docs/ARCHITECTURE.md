# ARCHITECTURE.md — marketingagency

## Diagrama

```
Landing (marketingagency, todo en index.html)
   ↓ Pixel: fbq('track','Lead', {}, {eventID}) + PageView (browser, directo a Meta)
   ↓ POST /api/lead (envío inmediato, mismo event_id)
Backend central (meta-conversion-backend)
   ↓
Supabase + Meta CAPI (deduplica con el Pixel por event_id)
```

Arquitectura completa del backend, esquema de Supabase y Meta CAPI: ver `ARCHITECTURE.md` de `meta-conversion-backend` — no se duplica acá.

## Envío inmediato + dedupe Pixel↔CAPI (específico de esta landing)

`fbq('track','Lead', {}, {eventID: eventId})` se dispara en el browser con el **mismo** `event_id` que se manda a `/api/lead` (sin `defer_meta`). Contraste con `redsolyluz` (patrón `defer_meta`): ver `DECISIONS.md`.

## Resolución del número de WhatsApp

Igual mecanismo que `redsolyluz`: `GET /api/public-config` (no-store) + cadena de respaldo, tope duro `WHATSAPP_WAIT_MAX_MS`. Antes existía un `WHATSAPP_NUMBER_FALLBACK` hardcodeado que causó un bug real (ver `DECISIONS.md`) — eliminado.

## Identificador de landing

`LANDING_VARIANT: 'marketingagency'` (en `MA_CONFIG`, dentro de `index.html`), viaja en `/api/lead` y `/api/pageview` → columna `events.landing_variant` en Supabase.

## Variables de entorno

Ninguna — sitio estático, todo en un `index.html` (config + markup + lógica).
