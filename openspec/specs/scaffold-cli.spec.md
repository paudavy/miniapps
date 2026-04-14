# CLI de scaffolding de miniapp

Estado: implementada

Resumen: Herramienta CLI interna que crea la estructura mínima de una miniapp desde una única implementación mantenida y ejecuta post-generación (regenerar registry + validar) sin borrar la app si el fallo es global al repo.

Evidencia:
- [tooling/create-miniapp/src/cli.js](tooling/create-miniapp/src/cli.js)
- [scripts/tests/create-miniapp.test.mjs](scripts/tests/create-miniapp.test.mjs)

Descripción: El CLI valida el slug usando contrato compartido, escribe la app, genera artefactos coherentes con `pwa` y `router`, y luego llama a `scripts/generate-home-registry.mjs` y `scripts/validate-miniapps.mjs`.

## Purpose

Definir el contrato del CLI interno que crea miniapps alineadas con las convenciones del monorepo y con el flujo de Pages.

## Requirements

### Requirement: Scaffold CLI has one maintained generation path
The `new:miniapp` workflow MUST use a single maintained generation path for creating miniapps. The repository MUST NOT keep multiple active implementations that encode the same scaffold contract with divergent behavior.

#### Scenario: Scaffold source of truth is unambiguous
- **WHEN** a maintainer inspects the scaffold implementation
- **THEN** there is exactly one maintained code path responsible for generating miniapp files and defaults

### Requirement: Scaffold CLI encodes internal monorepo conventions
The scaffold CLI MUST be treated as an internal monorepo tool and MUST generate files that satisfy the repository contract for miniapps, GitHub Pages deployment, and home registry integration.

#### Scenario: New miniapp is repo-ready after scaffold
- **WHEN** a developer runs `pnpm new:miniapp <slug>` with valid inputs
- **THEN** the generated app structure conforms to the repository contract used by build, validation, and registry generation

### Requirement: Scaffold creation is not destructive on global post-generation failure
If miniapp file generation succeeds but a later global synchronization or repository-wide validation step fails, the command MUST preserve the generated miniapp and report the post-generation failure separately.

#### Scenario: Repo-wide validation fails after successful scaffold
- **WHEN** the scaffold writes a valid new app and a subsequent global validation step fails for an unrelated repository issue
- **THEN** the new app remains on disk and the command reports that scaffold creation succeeded but post-generation checks failed
