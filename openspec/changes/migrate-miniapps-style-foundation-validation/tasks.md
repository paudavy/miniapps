## 1. Scaffold contract alignment

- [x] 1.1 Update `tooling/create-miniapp/src/cli.js` so generated `src/styles/index.css` keeps explicit sections for shared base identity, semantic app tokens, and app accent token
- [x] 1.2 Add/adjust scaffold output tests to verify generated miniapps include shared base import and semantic token layer
- [x] 1.3 Validate scaffold post-generation still runs `generate-home-registry` and `validate-miniapps` successfully

## 2. Style validation rules

- [x] 2.1 Extend `scripts/validate-miniapps.mjs` to check `apps/*/src/styles/index.css` imports `styles/base.css`
- [x] 2.2 Add a validation pass for unresolved `var(--token)` usages (with support for `var(--token, fallback)` and configured alias exceptions)
- [x] 2.3 Emit per-app compliance report (status, violations, and recommended fixes) for local and CI execution
- [x] 2.4 Include `component-adjustment-needed` flag with rationale in the per-app compliance report
- [x] 2.5 Add test coverage for style validation rules and report formatting

## 3. App migrations (contract compliance)

- [x] 3.1 Produce app-by-app assessment matrix (`home`, `focus-timer`, `notes`, `planning-board`) with explicit component-adjustment decision and evidence
- [x] 3.2 Migrate `apps/focus-timer` styles to scaffold contract (base import + semantic layer + local accent overrides)
- [x] 3.3 Migrate `apps/notes` styles to scaffold contract (base import + semantic layer + local accent overrides)
- [x] 3.4 Introduce explicit alias layer in `apps/planning-board/src/styles` to bridge component tokens and board tokens without visual regressions
- [x] 3.5 Create a component migration checklist for `planning-board` (topbar/toolbar/scheduler/popovers/rows) and migrate first batch to target token vocabulary

## 4. Enforcement and hardening

- [x] 4.1 Run repository validation and fix all non-alias style contract violations
- [x] 4.2 Switch CI style checks from warning mode to error mode once all apps are compliant
- [x] 4.3 Define and track alias debt exit criteria for `planning-board` (owner, deadline, and removal tasks)
- [x] 4.4 Document migration outcomes and verification evidence in change artifacts before apply/merge
