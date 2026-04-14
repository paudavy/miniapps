## Context

El repo ya tiene forma correcta para objetivo principal: monorepo con miniapps PWA independientes en `apps/*`, despliegue a GitHub Pages y un script de scaffold para estandarizar nuevas apps. El problema actual no es falta de capacidades, sino exceso de fuentes de verdad y estado intermedio de refactor.

Hoy `tooling/create-miniapp` mantiene varias representaciones parciales del mismo contrato (`cli.js`, `templates.js`, `utils.js`, `TMP_cli.js`), mientras `scripts/lib/miniapps.mjs` y `scripts/validate-miniapps.mjs` expresan otra parte de las reglas. Esto aumenta complejidad accidental, dificulta cambios futuros y debilita la confianza en `pnpm new:miniapp <slug>`.

## Goals / Non-Goals

**Goals:**
- Reducir complejidad del scaffold sin perder funcionalidad del monorepo.
- Convertir `create-miniapp` en codificador único y explícito de convenciones internas.
- Compartir una sola fuente de verdad para reglas estructurales y semántica de flags.
- Mantener `home` como índice técnico mínimo y preservar el flujo actual de Pages.
- Hacer el flujo de creación menos frágil ante fallos globales del repo.

**Non-Goals:**
- Replantear arquitectura de despliegue del repo.
- Añadir nuevas capacidades de producto a `home`.
- Publicar `create-miniapp` como herramienta genérica fuera del monorepo.
- Reescribir todos los scripts del repo o introducir framework nuevo para tooling.

## Decisions

### 1. `create-miniapp` tendrá una sola implementación activa
Se eliminará la duplicación funcional entre `cli.js`, `templates.js`, `utils.js` y `TMP_cli.js`, dejando un único camino mantenido.

Rationale:
- KISS: menos archivos con responsabilidad duplicada.
- Menor riesgo de drift en plantillas, slugs reservados y comportamiento PWA/router.

Alternatives considered:
- Mantener implementaciones paralelas y documentar cuál manda: rechazado por complejidad accidental.
- Extraer una capa de abstracción mayor para plantillas: rechazado por sobrediseño para tamaño actual del repo.

### 2. `scripts/lib/miniapps.mjs` será fuente de verdad para reglas compartidas
Las reglas de slugs, nombres reservados, estructura requerida y helpers de base path se centralizarán en módulo compartido consumido por scaffold y validación.

Rationale:
- Un cambio de convención debe tocar mínimo número de sitios.
- Alinea generador y validador con mismo contrato.

Alternatives considered:
- Dejar reglas repartidas por cercanía funcional: rechazado porque ya produjo inconsistencias.

### 3. Los flags describen intención de producto y deben reflejarse en archivos generados
`pwa`, `router` y `listed` se tratarán como intención del producto final, no solo toggles técnicos. El scaffold y la validación deberán producir y exigir artefactos coherentes con esa intención.

Rationale:
- Reduce ambiguedad para quien crea nuevas miniapps.
- Hace que el contrato de `app.config.json` sea legible.

Alternatives considered:
- Mantener flags como toggles de implementación: rechazado por semántica engañosa.

### 4. El contrato mínimo de `app.config.json` se reducirá a lo necesario
Se distinguirá entre metadata obligatoria, opcional y derivada. Dado que `home` es índice técnico mínimo, metadata no esencial para build, validación o navegación podrá pasar a opcional.

Rationale:
- Menor fricción al crear apps nuevas.
- Menor costo de mantenimiento del schema sin perder capacidad futura.

Alternatives considered:
- Mantener todos los campos obligatorios por simetría: rechazado si no aportan funcionalidad actual.

### 5. `apps-registry` dependerá solo de metadata mínima y tolerará campos opcionales
La generación de `apps/home/src/generated/apps-registry.ts` se basará en campos mínimos requeridos para el índice técnico (`name`, `title`, `description`, `listed` y la URL derivada). Metadata adicional como `category`, `tags` o `icon` podrá mantenerse como opcional sin bloquear registry ni home.

Rationale:
- Mantiene `home` pequeño y técnico.
- Permite simplificar `app.config.json` sin romper navegación ni build.

Alternatives considered:
- Seguir tratando metadata decorativa como parte del contrato duro del registry: rechazado por complejidad innecesaria.

### 6. Crear app y validar repo completo serán pasos separados dentro del mismo comando
El comando podrá seguir ejecutando post-generación, pero fallos en sincronización o validación global no deberán implicar borrar automáticamente un scaffold ya generado correctamente.

Rationale:
- Mejor DX y menor riesgo de pérdida de trabajo.
- Distingue error local de error global del repo.

Alternatives considered:
- Mantener rollback total: rechazado por mezclar éxito local con fallo global.

## Risks / Trade-offs

- [Cambio de contrato en `app.config.json`] → Mitigar con delta specs claras y validación retrocompatible durante transición.
- [Reducción excesiva de metadata] → Mitigar manteniendo opcionales los campos no esenciales en vez de eliminarlos de golpe.
- [Cambio implícito en `apps-registry`] → Mitigar especificando qué campos mínimos consume `home` y cómo se resuelven campos opcionales.
- [Refactor parcial del scaffold] → Mitigar cerrando primero duplicación estructural antes de ajustes menores.
- [Cambios en semántica `pwa`] → Mitigar especificando con precisión qué archivos/dependencias se generan o se omiten.

## Migration Plan

1. Definir contractualmente reglas nuevas en specs delta.
2. Consolidar fuente de verdad compartida en utilidades del repo.
3. Simplificar `create-miniapp` para usar solo ese contrato.
4. Ajustar `generate-home-registry` y `validate-miniapps` para mismo contrato.
5. Verificar que scaffold, validación, registry y build siguen produciendo miniapps válidas para Pages.

Rollback: revertir cambio completo si scaffold deja de generar apps válidas o si build Pages pierde compatibilidad.

## Open Questions

- `category`, `tags` e `icon` quedan como metadata opcional y solo se escriben cuando el usuario la proporciona.
- `--no-pwa` omite dependencias, iconos y configuración PWA innecesaria.
- Se adopta un `cli.js` único con plantillas inline para mantener el scaffold pequeño y explícito.
