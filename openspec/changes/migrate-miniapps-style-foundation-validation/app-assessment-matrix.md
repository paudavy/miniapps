# App Assessment Matrix (Style Foundation Migration)

| App | Contract Status | component-adjustment-needed | Decision Rationale | Evidence |
|---|---|---:|---|---|
| home | compliant baseline | false | Already follows base + local semantic mapping pattern | apps/home/src/styles/index.css |
| focus-timer | migrated in this change | false | Migration completed at style-entrypoint level; no mandatory component rewrites needed | apps/focus-timer/src/styles/index.css |
| notes | migrated in this change | false | Migration completed at style-entrypoint level; no mandatory component rewrites needed | apps/notes/src/styles/index.css |
| planning-board | migrated in this change | false | UI component styles now use `--board-*` tokens directly and compatibility aliases were removed from tokens | apps/planning-board/src/styles/tokens.css, apps/planning-board/src/features/board/ui/TopBar.css, apps/planning-board/src/features/board/ui/Toolbar.css, apps/planning-board/src/features/board/ui/ProfileRow.css |

Notes:
- `planning-board` has completed component token migration and no longer requires compatibility aliases in `tokens.css`.
- Status aligns with style validation report emitted by `scripts/validate-miniapps.mjs`.
