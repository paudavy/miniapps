## ADDED Requirements

### Requirement: App config distinguishes required and optional metadata
`app.config.json` MUST define a minimal required metadata set for repository operation and MAY allow additional optional metadata that does not affect build, validation, or the minimal home index.

#### Scenario: Minimal app config remains valid
- **WHEN** a developer creates a miniapp with only required metadata fields
- **THEN** the app remains valid for scaffold, validation, registry generation, and GitHub Pages deployment

#### Scenario: Optional metadata does not become mandatory by accident
- **WHEN** optional metadata fields are omitted
- **THEN** validation and registry generation continue working without requiring placeholder values

### Requirement: Product-intent flags are explicit in app config
`app.config.json` MUST remain the explicit configuration contract for product-intent flags such as listing, router support, and PWA behavior.

#### Scenario: Flags drive derived behavior
- **WHEN** tooling reads `app.config.json`
- **THEN** generated artifacts and validations derive behavior from the config instead of duplicating independent flag semantics elsewhere
