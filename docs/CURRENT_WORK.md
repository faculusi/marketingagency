# CURRENT_WORK.md — marketingagency

_Estado al 2026-09-21. Reemplazar esta sección en la próxima actualización, no acumular._

## Objetivo actual

Que la persona mantenga su línea de WhatsApp **mientras esa línea siga en rotación**, y pase a otra si se la sacó del pool. Antes, una vez que la conversión tenía número recordado, volvía siempre a ese durante los 30 minutos de la ventana, aunque la línea estuviera caída.

## Estado

**En `main` y deployado.** El pool está funcionando en producción con 2 líneas en rotación.

## Completado

- La landing manda el número recordado en `?current=` dentro del pedido a `/api/public-config` que **ya hacía al cargar la página**: sin consulta nueva, sin espera nueva en el click.
- `resolveWhatsappNumberForLead()` ya no ataja al número recordado — espera la cadena y usa lo que decidió el servidor.
- **La landing no elige:** sólo dice con qué venía trabajando (ver `DECISIONS.md`).
- Con el backend caído: reintento corto → número de esta conversión → último conocido (< 1 h) → estado de espera.

Nada más se tocó. Pixel, CAPI, `event_id`, el dedupe Browser+CAPI, la ventana de 30 min, el copy y los tiempos quedan igual.

## Pendiente

Nada en este repo. Falta la prueba manual de Facu: sacar una línea de rotación desde el panel y recargar la landing.

## Riesgos / No tocar

- El dominio de producción es **`marketingagency-three.vercel.app`**, no `marketingagency.vercel.app`.
- **El backend va siempre primero.** Contra un backend sin `?current=`, el parámetro se ignora y se sortea: no rompe nada, pero anula el arreglo.
- **`events.whatsapp_phone` NO se reescribe.** Si la persona cambia de línea a mitad de la ventana, el registro queda con la original: `/api/lead` devuelve 409 y no toca la fila. Costo aceptado.
- **Una pestaña ya abierta no se entera.** Aceptado, no se arregla.
- No bumpear `EVENT_ID_STORAGE_KEY`, y no reemplazar el objeto guardado: escribir siempre por merge para no correr la ventana de dedupe.
- Nunca hardcodear un número de WhatsApp de respaldo.

## Archivos relevantes

`index.html` (todo el sitio, HTML/CSS/JS embebido).
