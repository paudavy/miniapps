## MODIFIED Requirements

### Requirement: Validation uses the same structural contract as scaffold
Repository validation MUST consume the same shared contract used by the scaffold for miniapp structure, slug rules, product-intent behavior, and style-foundation conformance.

#### Scenario: Required files match scaffold contract
- **WHEN** the repository contract for generated files changes
- **THEN** validation checks the updated contract from the shared source of truth instead of maintaining a divergent local list

#### Scenario: Style foundation checks align with scaffold baseline
- **WHEN** validation evaluates each miniapp
- **THEN** it verifies that the app style entrypoint follows the scaffold style baseline contract (shared base identity import plus local semantic extension)

#### Scenario: Unresolved style token usage is reported
- **WHEN** a stylesheet uses `var(--token-name)` and no declaration or fallback is resolvable in the app style scope
- **THEN** validation reports the token usage with file and selector context

### Requirement: Validation distinguishes local app defects from global repository defects
Validation and post-generation reporting MUST make it clear whether a failure is caused by the newly scaffolded app or by an unrelated existing repository issue.

#### Scenario: Unrelated repository issue is reported distinctly
- **WHEN** post-generation validation fails because of an unrelated existing app or repository artifact
- **THEN** the output identifies the failure as a repository-wide issue rather than implying that scaffold generation itself failed

#### Scenario: Per-app style report includes component-adjustment decision
- **WHEN** validation runs style conformance checks across miniapps
- **THEN** output includes por app status, violated rules, and a `component-adjustment-needed` decision with rationale
