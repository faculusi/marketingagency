# CURRENT_WORK.md — marketingagency

_Estado al 2026-10-29. Reemplazar esta sección en la próxima actualización, no acumular._

## Objetivo actual

Landing v2: diseño nuevo que muestra arriba la imagen o el video del anuncio del que viene la persona (`?v=`), con textos y anuncios editables en `contenido.js`. El tracking y la conexión con el backend no cambiaron.

## Estado

**Mergeado a `main`** (Vercel publica en `marketingagency-three.vercel.app`). Facu revisó la vista previa desde el celular. La prueba en producción la hace Facu desde el celular; desde la sesión de Claude no hay acceso de red a Vercel.

## Completado

- Diseño nuevo con CSS propio; se sacó el Tailwind embebido (~70 KB) y "Jugadores Recientes" (eran datos inventados). Fuente Lilita One alojada en `fuentes/`.
- `contenido.js` con respaldo campo por campo en `index.html` (ver `DECISIONS.md`).
- Variante visual por `?v=` con 8 anuncios (`zeus`, `bufon`, `toros`, `mansion`, `princesa`, `perro`, `panda`, `perroverde`); por defecto `zeus`. Precarga de la imagen del anuncio en el `<head>`.
- Botón secundario que reusa el handler del principal (un solo Lead).
- Única línea tocada en el JS de integración: `WHATSAPP_MESSAGE` (mensaje 40%).

## Pendiente

- Prueba de Facu en producción: `?v=zeus&campaign_id=TEST&ad_id=TEST&fbclid=TEST` → `/api/pageview` OK; al tocar el botón `/api/lead` 200, `fbq Lead` con el mismo `eventID`, WhatsApp con número del pool + mensaje 40% + `lead_ref`. En Meta → Probar eventos: PageView y Lead deduplicados. Si algo falla: volver a la versión anterior desde Vercel, no arreglar en producción.
- Lighthouse en celular sobre producción (objetivo: Performance ≥ 90, LCP < 2,5 s): sin medir todavía.
- Reemplazar `[CONDICIONES DEL BONO]` en `contenido.js` por el texto real.
- `logo.webp` (raíz) quedó sin uso.

## Riesgos / No tocar

- El backend solo acepta pedidos de `marketingagency-three.vercel.app` (CORS): en las vistas previas de Vercel el botón muestra "No pudimos conectarte". Es esperado.
- No renombrar los ids `btn-whatsapp*` ni quitar `.opacity-50`, `.pointer-events-none` y `[hidden]` del CSS: los usa el JS del CTA.
- No bumpear `EVENT_ID_STORAGE_KEY`; escribir siempre por merge. Nunca hardcodear un número de WhatsApp de respaldo.

## Archivos relevantes

`index.html` (markup, CSS, respaldo del contenido y JS de integración), `contenido.js` (textos y anuncios), `creativos/` (imágenes y videos).
