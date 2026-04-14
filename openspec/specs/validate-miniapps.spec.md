# Validación de miniapps

Estado: implementada

Resumen: Reglas y script de validación que aseguran: slugs válidos, coincidencia entre directorio y `app.config.json`, presencia de archivos requeridos según contrato compartido, coherencia de `package.json`, y checks de router/404.

Evidencia:
- [scripts/validate-miniapps.mjs](scripts/validate-miniapps.mjs)
- [scripts/lib/miniapps.mjs](scripts/lib/miniapps.mjs)

Descripción: `scripts/validate-miniapps.mjs` ejecuta una batería de comprobaciones sobre cada app usando el contrato y utilidades definidas en `scripts/lib/miniapps.mjs`, incluyendo campos requeridos y requisitos condicionados por `pwa` y `router`.

## Purpose

Definir la validación estructural de miniapps contra contrato compartido del monorepo.

## Requirements

### Requirement: Validation uses the same structural contract as scaffold
Repository validation MUST consume the same shared contract used by the scaffold for miniapp structure, slug rules, and product-intent behavior.

#### Scenario: Required files match scaffold contract
- **WHEN** the repository contract for generated files changes
- **THEN** validation checks the updated contract from the shared source of truth instead of maintaining a divergent local list

### Requirement: Validation distinguishes local app defects from global repository defects
Validation and post-generation reporting MUST make it clear whether a failure is caused by the newly scaffolded app or by an unrelated existing repository issue.

#### Scenario: Unrelated repository issue is reported distinctly
- **WHEN** post-generation validation fails because of an unrelated existing app or repository artifact
- **THEN** the output identifies the failure as a repository-wide issue rather than implying that scaffold generation itself failed
