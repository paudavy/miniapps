## Why

El scaffold de miniapps ya cumple el objetivo base del repo, pero hoy expresa las convenciones desde varias fuentes en paralelo (`cli.js`, `templates.js`, `utils.js`, `TMP_cli.js` y validaciones compartidas). Eso aumenta drift, vuelve ambiguo el contrato del monorepo y complica evolucionar el proceso sin introducir inconsistencias.

## What Changes

- Consolidar `tooling/create-miniapp` como script interno opinionated del monorepo con una sola ruta real de generación.
- Unificar reglas compartidas del repo para slugs reservados, estructura mínima requerida y semántica de flags orientados a intención de producto.
- Separar conceptualmente generación de app, sincronización de artefactos derivados y validación global para evitar que fallos ajenos destruyan un scaffold válido.
- Reducir complejidad del scaffold eliminando archivos, plantillas y metadatos que no aporten funcionalidad comprobable al flujo actual.
- Alinear scaffold, validación y documentación OpenSpec bajo un contrato único y explícito.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `scaffold-cli`: redefinir el CLI como codificador único de convenciones internas, con semántica clara de flags y menor complejidad estructural.
- `slug-rules`: centralizar la fuente de verdad de nombres reservados y validación de slugs.
- `pwa-conventions`: hacer coherente el comportamiento generado cuando `pwa` representa intención de producto y no solo un toggle técnico.
- `app-config`: revisar qué campos son obligatorios, opcionales o derivados bajo criterio KISS.
- `apps-registry`: asegurar que el registro derivado tolere metadata opcional y siga sirviendo al índice técnico mínimo.
- `validate-miniapps`: alinear la validación con el mismo contrato consumido por el scaffold.

## Impact

- Código afectado: `tooling/create-miniapp/*`, `scripts/lib/miniapps.mjs`, `scripts/validate-miniapps.mjs`, y specs OpenSpec relacionadas.
- Impacto en DX: menor ambiguedad al crear nuevas miniapps y menor riesgo de drift entre plantilla y validación.
- Impacto en mantenimiento: menos duplicación, menos puntos de cambio y contrato del repo más fácil de evolucionar.

## Non-goals

- Rediseñar `apps/home` más allá de su rol como índice técnico mínimo.
- Añadir nuevas capacidades de producto a las miniapps generadas.
- Convertir `create-miniapp` en herramienta reusable fuera del monorepo.

## Evidencia

- `tooling/create-miniapp/src/cli.js`
- `scripts/lib/miniapps.mjs`
- `scripts/validate-miniapps.mjs`
- `scripts/generate-home-registry.mjs`
- `scripts/tests/create-miniapp.test.mjs`
