## MODIFIED Requirements

### Requirement: Scaffold CLI encodes internal monorepo conventions
The scaffold CLI MUST be treated as an internal monorepo tool and MUST generate files that satisfy the repository contract for miniapps, GitHub Pages deployment, and home registry integration. For miniapps with `pwa: true`, the generated source MUST include the baseline install UI wiring in shared shell structure. For miniapps with `pwa: false`, scaffold output MUST omit install UI-specific source artifacts.

#### Scenario: New miniapp is repo-ready after scaffold
- **WHEN** a developer runs `pnpm new:miniapp <slug>` with valid inputs
- **THEN** the generated app structure conforms to the repository contract used by build, validation, and registry generation

#### Scenario: PWA scaffold includes install UI in AppShell
- **WHEN** a developer scaffolds a miniapp with `pwa: true`
- **THEN** the generated app includes install UI wiring rendered from AppShell and required setup for install prompt handling

#### Scenario: Non-PWA scaffold excludes install UI artifacts
- **WHEN** a developer scaffolds a miniapp with `pwa: false`
- **THEN** the generated app omits install UI-specific modules, imports, and render points
