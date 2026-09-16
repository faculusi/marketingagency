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
