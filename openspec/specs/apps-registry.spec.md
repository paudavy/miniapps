# Registro de aplicaciones (apps-registry)

Estado: implementada

Resumen: Generación automática del registro de aplicaciones que alimenta la app `home` usando metadata mínima del contrato compartido y tolerando metadata opcional ausente.

Evidencia:
- [scripts/generate-home-registry.mjs](scripts/generate-home-registry.mjs)
- [apps/home/src/generated/apps-registry.ts](apps/home/src/generated/apps-registry.ts)

Descripción: El script `scripts/generate-home-registry.mjs` lee los `app.config.json` de las miniapps, filtra y ordena entradas, y escribe `apps/home/src/generated/apps-registry.ts`. La UI mínima de `home` consume solo los campos necesarios y tolera metadata opcional.

## Purpose

Definir el contrato del registro derivado que alimenta el índice técnico `home`.

## Requirements

### Requirement: Registry generation depends on minimal metadata contract
`generate-home-registry` MUST generate entries for the home index using only the metadata required by the minimal repository contract plus derived URL information.

#### Scenario: Minimal app config still produces registry entry
- **WHEN** a listed miniapp omits optional metadata fields
- **THEN** registry generation still produces a valid entry for the home index using required fields and derived values

### Requirement: Optional metadata does not block the minimal home index
Optional metadata such as `category`, `tags`, or `icon` MUST NOT be required for the generated registry to support the technical minimal home index.

#### Scenario: Home index remains valid without decorative metadata
- **WHEN** optional metadata is absent from a listed app
- **THEN** the generated registry remains consumable by `apps/home` without placeholder-only contract requirements
