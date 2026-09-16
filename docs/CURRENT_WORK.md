# CURRENT_WORK.md — marketingagency

_Estado al 2026-09-16. Reemplazar esta sección en la próxima actualización, no acumular._

## Objetivo actual

**Incierto.** No hay una tarea o ticket explícito más allá del último commit.

## Estado

Landing funcionando en producción, integrada al ecosistema central de Meta/WhatsApp.

## Completado (último commit)

"El CTA espera el número real en vez de usar el placeholder" — parte de la integración reciente al ecosistema central (Meta Pixel + backend + WhatsApp compartidos).

## Pendiente

No se encontraron TODOs de alto nivel explícitos en el código.

## Próxima acción

No definida por el usuario en esta sesión.

## Archivos relevantes

`index.html` (todo el sitio: markup, config y lógica en un solo archivo).

## Riesgos / No tocar

- Nunca reintroducir un número de WhatsApp de respaldo hardcodeado (ver `DECISIONS.md`).
- No unificar el envío inmediato con el patrón `defer_meta` de `redsolyluz` sin verificar el impacto en el dedupe Pixel/CAPI.
