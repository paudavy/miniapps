## MODIFIED Requirements

### Requirement: Scaffold SHALL expose a semantic token vocabulary
The generated stylesheet SHALL define a semantic token vocabulary for the most common UI concerns so new miniapps consume semantic names instead of coupling directly to raw palette values.

#### Scenario: Semantic tokens cover common UI usage
- **WHEN** the scaffold generates its default stylesheet
- **THEN** it defines semantic tokens for page background, surface background, primary text, secondary text, border, and primary accent usage

#### Scenario: Generated primitives consume semantic tokens
- **WHEN** the scaffold generates shell, card, button, and form control styles
- **THEN** those rules consume semantic tokens rather than referencing raw brand or neutral palette names directly

#### Scenario: Generated stylesheet separates shared identity from local extension
- **WHEN** the scaffold generates `src/styles/index.css`
- **THEN** the file structure makes explicit which variables come from shared base identity and which variables are app-local semantic extensions

### Requirement: Scaffold SHALL establish the default visual baseline for future miniapps
The generated stylesheet SHALL serve as the default visual baseline for newly created miniapps so future additions start from the same design foundation.

#### Scenario: New miniapps inherit the same design baseline
- **WHEN** two miniapps are created from the scaffold at different times
- **THEN** both start from the same PUEDATA-aligned typography, spacing, radius, and neutral color rules unless intentionally customized afterward

#### Scenario: Generated baseline keeps a migration-friendly extension point
- **WHEN** a team needs to migrate a complex miniapp with pre-existing component styles
- **THEN** the scaffold baseline remains compatible with a temporary alias layer without replacing the shared identity tokens
