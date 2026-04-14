## ADDED Requirements

### Requirement: PWA flag expresses product intent
The `pwa` setting in `app.config.json` and related scaffold flags MUST represent product intent. Generated files, dependencies, and validation rules MUST be coherent with whether the miniapp is intended to be a PWA.

#### Scenario: PWA-enabled app gets PWA assets and config
- **WHEN** a miniapp is scaffolded with `pwa: true`
- **THEN** the generated app includes the PWA-related assets and configuration required by the repository contract

#### Scenario: Non-PWA app avoids unnecessary PWA footprint
- **WHEN** a miniapp is scaffolded with `pwa: false`
- **THEN** the generated app omits PWA-specific files, dependencies, or configuration that are not needed for the non-PWA contract

### Requirement: Router flag keeps GitHub Pages behavior coherent
When router support is enabled, the scaffold and validation MUST generate and require the artifacts needed for GitHub Pages SPA routing. When router support is disabled, those artifacts MUST NOT be generated or required.

#### Scenario: Router-enabled app requires redirect artifact
- **WHEN** a miniapp is scaffolded or validated with `router: true`
- **THEN** the GitHub Pages redirect artifact required by the contract is present

#### Scenario: Router-disabled app stays free of router-only artifacts
- **WHEN** a miniapp is scaffolded or validated with `router: false`
- **THEN** router-only artifacts are absent and not required
