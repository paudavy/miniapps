## ADDED Requirements

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
