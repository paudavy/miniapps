# Reglas de nombres reservados y validación de slugs

Estado: implementada

Resumen: Conjunto de reglas y validaciones compartidas para slugs de apps (kebab-case), slugs reservados y detección de duplicados.

Evidencia:
- [scripts/lib/miniapps.mjs](scripts/lib/miniapps.mjs) (`isValidSlug`, `RESERVED_APP_NAMES`)
- [tooling/create-miniapp/src/cli.js](tooling/create-miniapp/src/cli.js) (validaciones previas a la generación)

Descripción: La validación se aplica tanto en `scripts/lib/miniapps.mjs` como en el CLI y scripts de validación, evitando drift entre nombres reservados y reglas de formato.

## Purpose

Definir reglas compartidas para slugs y nombres reservados de miniapps en todo el monorepo.

## Requirements

### Requirement: Shared slug rules come from one module
Slug validation rules and reserved app names MUST be defined in one shared repository module consumed by scaffolding and validation flows.

#### Scenario: Reserved names are consistent everywhere
- **WHEN** a reserved app name is added or removed
- **THEN** scaffolding and validation observe the same reserved-name set without duplicate manual updates in multiple files

### Requirement: Scaffold and validation enforce identical slug semantics
The scaffold CLI and repository validation MUST enforce the same slug format and reserved-name rules for miniapps.

#### Scenario: Invalid slug is rejected consistently
- **WHEN** a developer attempts to scaffold or validate an app with an invalid slug
- **THEN** both workflows reject the slug under the same rules
