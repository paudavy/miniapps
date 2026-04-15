## MODIFIED Requirements

### Requirement: PWA flag expresses product intent
The `pwa` setting in `app.config.json` and related scaffold flags MUST represent product intent. Generated files, dependencies, and validation rules MUST be coherent with whether the miniapp is intended to be a PWA. Install experience in generated UI MUST follow the same intent: apps with `pwa: true` SHALL include a shell-level install entry point, and apps with `pwa: false` SHALL NOT include that entry point.

#### Scenario: PWA-enabled app gets PWA assets and config
- **WHEN** a miniapp is scaffolded with `pwa: true`
- **THEN** the generated app includes the PWA-related assets and configuration required by the repository contract

#### Scenario: Non-PWA app avoids unnecessary PWA footprint
- **WHEN** a miniapp is scaffolded with `pwa: false`
- **THEN** the generated app omits PWA-specific files, dependencies, or configuration that are not needed for the non-PWA contract

#### Scenario: PWA-enabled app exposes shell install entry point
- **WHEN** a miniapp is scaffolded with `pwa: true`
- **THEN** AppShell includes a render point for install action that appears only when the install prompt is available
