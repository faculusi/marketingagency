# CLAUDE.md — Memoria operativa del proyecto

**Rol de este repo:** `marketingagency` es una **landing/sitio de marketing** integrado al mismo ecosistema que `redsolyluz`: mismo backend (`meta-conversion-backend`), mismo Meta Pixel (`1999888117386965`) y mismo flujo Lead→WhatsApp. Todo el sitio vive en un único `index.html` (HTML/CSS/JS embebido, sin build). A diferencia de `redsolyluz`, envía el Lead a Meta CAPI de inmediato (sin `defer_meta`) y dispara `fbq('track','Lead', ...)` en el browser con el mismo `event_id` que manda al backend, para que Meta deduplique Pixel↔CAPI.

Este archivo es el punto de entrada para cualquier sesión de Claude Code en este proyecto. El proyecto está distribuido en **4 repositorios GitHub independientes** que funcionan como un solo sistema en producción (ver `docs/PROJECT_CONTEXT.md`). Leé este archivo completo antes de tocar código — es corto a propósito.

## Qué contiene cada documento

- **docs/PROJECT_CONTEXT.md** — qué es el proyecto, sus 4 componentes y cómo se relacionan. Leer para entender el sistema completo.
- **docs/ARCHITECTURE.md** — arquitectura real verificada (endpoints, esquema de Supabase, Meta Pixel/CAPI, RLS). Leer solo si la tarea toca integraciones o arquitectura.
- **docs/CURRENT_WORK.md** — estado actual del trabajo. NO es un historial: se reemplaza, no se acumula. Leer para saber en qué está el proyecto ahora.
- **docs/DECISIONS.md** — decisiones que no hay que romper sin darse cuenta. Leer antes de cambiar algo que pueda chocar con una decisión ya tomada.

## CONTEXT AND TOKEN EFFICIENCY

- No leer todo el repositorio para cada tarea. No analizar los 4 repos completos para una tarea que claramente afecta solo a uno.
- Primero identificar qué repo, componente y archivos son relevantes para la tarea.
- Consultar CLAUDE.md primero, siempre.
- Consultar PROJECT_CONTEXT.md solo cuando haga falta entender el sistema completo.
- Consultar ARCHITECTURE.md solo cuando la tarea involucre arquitectura/integraciones (Supabase, Meta, endpoints entre repos).
- Consultar CURRENT_WORK.md para conocer el estado actual antes de asumir qué falta.
- Consultar DECISIONS.md antes de cambios que puedan afectar una decisión ya tomada.
- Leer únicamente los archivos de código necesarios para la tarea puntual. No releer archivos ya inspeccionados en la sesión si no cambiaron.
- No duplicar información entre documentos — cada dato vive en un solo lugar.
- Mantener los documentos compactos. No convertir CURRENT_WORK.md en un diario ni DECISIONS.md en un historial de conversaciones.
- No crear documentación adicional salvo necesidad imprescindible.
- No hacer refactors no solicitados. No modificar componentes fuera del alcance de la tarea.
- No asumir que una funcionalidad de un repo existe en otro — verificar (ver diferencias entre landings en ARCHITECTURE.md).
- Antes de modificar código, identificar exactamente qué archivos y qué repo están involucrados.
- Si una tarea afecta producción, verificar primero qué repo/configuración representa producción (todos los `main` de los 4 repos están en producción activa — ver ARCHITECTURE.md).
- No modificar Supabase ni Meta salvo que el usuario lo pida explícitamente.
- No ejecutar migraciones, cambios destructivos ni modificaciones de producción durante tareas de análisis.
- No hacer deploy, push, commit o merge salvo autorización explícita del usuario para esa acción puntual.
- No exponer secretos, tokens ni credenciales en ningún documento.
- Mantener CURRENT_WORK.md actualizado cuando termine una tarea importante (reemplazando el estado anterior, no acumulando).
- Actualizar DECISIONS.md solo cuando surja una decisión arquitectónica nueva o una anterior cambie.

## Procedimiento para cualquier tarea futura

1. Determinar primero el alcance de la tarea.
2. Identificar el repo relevante (de los 4).
3. Leer CLAUDE.md (este archivo).
4. Leer solo el documento de contexto necesario (PROJECT_CONTEXT / ARCHITECTURE / CURRENT_WORK / DECISIONS).
5. Inspeccionar únicamente el código relacionado con la tarea.
6. Consultar Supabase/Meta solo si la tarea realmente lo requiere.
7. Evitar explorar componentes no relacionados.
8. Realizar el cambio mínimo necesario.
9. Verificar el resultado.
10. Actualizar CURRENT_WORK.md o DECISIONS.md solo cuando corresponda.

Una tarea chica (ej. "cambiar un texto en redsolyluz") **no** debería disparar una exploración completa de los 4 repos, Supabase y Meta.

## Mapa de los 4 repositorios

| Repo | Qué es | Depende de |
|---|---|---|
| `meta-conversion-backend` | Backend único (Vercel serverless + Node/ESM). Guarda eventos en Supabase y los reenvía a Meta CAPI. | Supabase, Meta |
| `panel-cajero` | Panel interno de operadores/cajeros (login, roles). Proxy server-side al backend. | `meta-conversion-backend` (vía `BACKEND_API_SECRET`) |
| `redsolyluz` | Landing pública estática "puente a WhatsApp" (producto "Red Sol y Luz"). | `meta-conversion-backend`, Meta Pixel |
| `marketingagency` | Landing/sitio de marketing integrado al mismo ecosistema. | `meta-conversion-backend`, Meta Pixel |

**Nota de incertidumbre:** la consigna de esta auditoría mencionaba "5 ramas". En este workspace solo hay acceso a estos 4 repositorios, cada uno con una única rama con contenido real (`main`; la rama `claude/initial-audit-documentation-1z7k79` usada para esta tarea es idéntica a `main` en los 4 repos). No se encontró un 5º repo/rama — queda marcado como no verificable, no inventado.

## Seguridad / no tocar sin permiso explícito

- No modificar Supabase ni Meta salvo pedido explícito del usuario.
- No exponer secretos/tokens/credenciales/datos de clientes en ningún documento o commit.
- No hacer deploy/push/commit/merge salvo autorización explícita para esa acción.
