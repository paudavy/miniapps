## ADDED Requirements

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
