# DECISIONS.md — marketingagency

Decisiones que Claude debe recordar para no romper el sistema. Solo se listan las verificables en código o explícitas en comentarios del propio repo.

---

### Envío inmediato a Meta CAPI + dedupe por Pixel (a diferencia de `redsolyluz`)

**Qué se decidió:** envía el Lead a Meta CAPI de inmediato en `/api/lead`, junto con `fbq('track','Lead', ...)` en el browser con el mismo `event_id`. `redsolyluz` en cambio difiere el envío (`defer_meta`, ver su `DECISIONS.md`).
**Motivo:** no documentado explícitamente en comentarios — verificado como comportamiento real, no tratado como inconsistencia a corregir.
**Estado:** Vigente.

### Nunca hardcodear un número de WhatsApp de respaldo

**Qué se decidió:** el número se resuelve solo vía `/api/public-config`; no debe haber un fallback hardcodeado en el código.
**Motivo:** existió un `WHATSAPP_NUMBER_FALLBACK` hardcodeado que causó un bug real en producción (`wa.me` muerto) — mismo problema documentado en `redsolyluz` (ver su `DECISIONS.md` para el detalle completo). Ya se eliminó de este repo.
**Estado:** Vigente.

### El número de WhatsApp se persiste junto al `event_id`

**Qué se decidió:** el número se guarda DENTRO del objeto de `ma_event_id_v1` (sessionStorage), junto al `event_id`, **por merge** sobre lo que ya está. Mientras esa conversión siga vigente, ese número tiene prioridad sobre una tirada nueva del pool.
**Motivo:** el número ya era consistente dentro de una misma carga (`cachedWhatsappNumber` se congelaba antes del `await`), pero esa variable vive en memoria. Al recargar dentro de los 30 min se reutilizaba el mismo `event_id`, el pool devolvía otra línea, `/api/lead` respondía 409 **sin tocar la fila** — no reescribe `whatsapp_phone` — y la persona terminaba escribiéndole a un número distinto del que quedó en Supabase.
**Por merge, nunca reemplazando el objeto:** pisar `created_at` correría la ventana de deduplicación en cada click.
**Sin clave nueva y sin TTL nuevo. NO bumpear `EVENT_ID_STORAGE_KEY`:** invalidaría las conversiones en curso y generaría un Lead duplicado por cada persona dentro de la ventana.
**Estado:** Vigente. Fuente: Fase 4 del pool de rotación, 2026-09-19.

### El CTA ya esperaba a `/api/public-config` — no hay carrera que arreglar acá

**Qué se decidió (constatación):** `startCtaFlow()` espera con `waitForWhatsappNumber()` y, sin número, muestra el estado no disponible sin navegar. `WHATSAPP_NUMBER_FALLBACK` fue eliminado antes de este cambio.
**Motivo:** quedó registrado porque el diagnóstico inicial del pool atribuía a esta landing los `'549'` guardados en `events`. Eso **ya no era cierto en el código**: los 20 casos de esta landing son históricos (el último, 2026-09-14) y el mecanismo vivo estaba en `solyluz`, que conservaba el placeholder.
**Estado:** Constatación vigente. No re-investigar esta landing por los `'549'` históricos.
