# CURRENT_WORK.md — marketingagency

_Estado al 2026-09-19. Reemplazar esta sección en la próxima actualización, no acumular._

## Objetivo actual

Que el número de WhatsApp sobreviva a una recarga, no solo al doble click, ahora que el backend sortea una línea de un pool en rotación.

## Estado

**Código completo en la rama `claude/marketingagency-numero-consistente`, pusheada. Sin PR, sin merge a `main`, sin deploy.**

Producción sigue con el código viejo. Es consistente dentro de una carga, pero pierde el número al recargar. Inofensivo **mientras haya una sola línea en rotación**, que es el estado actual.

## Completado

- `readStoredEventState()` separado de `resolveEventId()`, para leer el número sin duplicar el chequeo de TTL.
- `rememberWhatsappNumber()` escribe por merge en `ma_event_id_v1`, sin pisar `created_at`.
- `resolveWhatsappNumberForLead()` devuelve el número recordado o, si no hay, una tirada nueva del pool.
- Un objeto viejo sin `whatsapp_number` se tolera: se pide uno nuevo.

Nada más se tocó. Esta landing **ya** esperaba a que resolviera `/api/public-config` y **ya** no tenía placeholder. Pixel, CAPI, `event_id`, el dedupe Browser+CAPI, la ventana de 30 min, el copy y los tiempos quedan igual.

## Pendiente

Nada en este repo.

## Próxima acción

Esperar al backend y al panel. Este repo va **cuarto** en el orden de despliegue, junto con las otras dos landings.

## Riesgos / No tocar

- El dominio de producción es **`marketingagency-three.vercel.app`**, no `marketingagency.vercel.app`.
- No bumpear `EVENT_ID_STORAGE_KEY`, y no reemplazar el objeto guardado: escribir siempre por merge para no correr la ventana de dedupe.
- Nunca hardcodear un número de WhatsApp de respaldo.

## Archivos relevantes

`index.html` (todo el sitio, HTML/CSS/JS embebido).
