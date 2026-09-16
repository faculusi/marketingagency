# CLAUDE.md — Memoria operativa del proyecto

**Rol de este repo:** `marketingagency` es una **landing/sitio de marketing** integrada al mismo ecosistema que `redsolyluz`: mismo backend (`meta-conversion-backend`), mismo Meta Pixel (`1999888117386965`) y mismo flujo Lead→WhatsApp. Todo el sitio vive en un único `index.html` (HTML/CSS/JS embebido, sin build). A diferencia de `redsolyluz`, envía el Lead a Meta CAPI de inmediato (sin `defer_meta`) y dispara `fbq('track','Lead', ...)` en el browser con el mismo `event_id` que manda al backend, para que Meta deduplique Pixel↔CAPI.

Este repo es uno de 4 que forman un solo sistema en producción (ver `docs/PROJECT_CONTEXT.md`). No leas la documentación de los otros 3 repos salvo que la tarea cruce repos explícitamente.

## Qué leer, y cuándo

| Documento | Leer cuando... |
|---|---|
| `docs/PROJECT_CONTEXT.md` | necesites entender qué es este repo y con qué se comunica |
| `docs/ARCHITECTURE.md` | la tarea toca el flujo lead → WhatsApp, Pixel o dedupe con CAPI |
| `docs/CURRENT_WORK.md` | necesites saber en qué está la landing ahora mismo |
| `docs/DECISIONS.md` | vas a tocar el envío a Meta, el número de WhatsApp o `landing_variant` |

## Reglas de eficiencia de contexto

- Identificá el alcance de la tarea antes de leer nada más.
- No leas los 4 documentos si la tarea sólo necesita uno.
- No explores `meta-conversion-backend`, `panel-cajero` ni `redsolyluz` salvo que la tarea cruce repos explícitamente.
- No releas archivos ya inspeccionados en la sesión si no cambiaron.
- No consultes Supabase o Meta (MCP) — esta landing no tiene acceso directo.
- Cambio mínimo necesario — sin refactors no solicitados. `index.html` es grande: tocá solo la sección relevante.
- No dupliques información entre documentos.
- Actualizá `CURRENT_WORK.md` (reemplazando, no acumulando) solo al cerrar una tarea importante. Actualizá `DECISIONS.md` solo ante una decisión nueva.

## Seguridad / no tocar sin permiso explícito

- Nunca hardcodear un número de WhatsApp de respaldo (ver `DECISIONS.md` — causó un bug real en producción).
- No modificar Supabase ni Meta — esta landing no tiene acceso directo.
- No hacer deploy/push/commit/merge salvo autorización explícita del usuario para esa acción puntual.
