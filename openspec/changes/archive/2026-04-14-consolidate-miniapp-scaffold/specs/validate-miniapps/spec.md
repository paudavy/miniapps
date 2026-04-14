## ADDED Requirements

### Requirement: Validation uses the same structural contract as scaffold
Repository validation MUST consume the same shared contract used by the scaffold for miniapp structure, slug rules, and product-intent behavior.

#### Scenario: Required files match scaffold contract
- **WHEN** the repository contract for generated files changes
- **THEN** validation checks the updated contract from the shared source of truth instead of maintaining a divergent local list

### Requirement: Validation distinguishes local app defects from global repository defects
Validation and post-generation reporting MUST make it clear whether a failure is caused by the newly scaffolded app or by an unrelated existing repository issue.

#### Scenario: Unrelated repository issue is reported distinctly
- **WHEN** post-generation validation fails because of an unrelated existing app or repository artifact
- **THEN** the output identifies the failure as a repository-wide issue rather than implying that scaffold generation itself failed
