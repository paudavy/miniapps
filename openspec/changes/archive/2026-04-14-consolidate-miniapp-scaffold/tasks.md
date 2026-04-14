## 1. Consolidate scaffold contract

- [x] 1.1 Choose and keep one maintained scaffold implementation path in `tooling/create-miniapp`, removing duplicate or dead generator paths.
- [x] 1.2 Move shared slug rules, reserved names, and required file contract into one shared module consumed by scaffold and validation.
- [x] 1.3 Update scaffold tests or add coverage to verify the kept generation path remains the only active source of truth.

## 2. Align product-intent semantics

- [x] 2.1 Define the minimal required vs optional fields in `app.config.json` under the new KISS contract.
- [x] 2.2 Update scaffold generation so `pwa`, `router`, and `listed` produce artifacts that match product intent rather than partial technical toggles.
- [x] 2.3 Update validation rules so optional metadata can be omitted without placeholder values while required metadata remains enforced.
- [x] 2.4 Update registry generation so listed apps still appear in `home` when optional metadata is omitted.

## 3. Make post-generation flow safer

- [x] 3.1 Refactor `new:miniapp` flow to distinguish scaffold creation success from repo-wide post-generation failures.
- [x] 3.2 Update command output so developers can tell whether a failure came from the new app or from an unrelated repository issue.
- [x] 3.3 Verify that a successful scaffold is preserved on disk when global registry generation or validation fails afterward.

## 4. Verify repository behavior end-to-end

- [x] 4.1 Run or extend validation/build checks to confirm scaffold, registry generation, and Pages build still work with the consolidated contract.
- [x] 4.2 Update affected OpenSpec and repo documentation so scaffold behavior, flag semantics, and contract ownership are explicit.
