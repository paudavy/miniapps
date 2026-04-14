## 1. Token foundation

- [x] 1.1 Define the PUEDATA base CSS token layer for typography, neutral/brand colors, spacing, and radius used by this change
- [x] 1.2 Define the initial semantic token vocabulary for page, surface, text, border, and accent usage used by `home` and the scaffold
- [x] 1.3 Decide and wire the font-loading/fallback approach needed for the PUEDATA typography baseline
- [x] 1.4 Update the default `themeColor` and `backgroundColor` values to `#004F87` and `#FFFFFF` in the shared scaffold defaults

## 2. Home adoption

- [x] 2.1 Refactor `apps/home/src/styles/index.css` to consume the PUEDATA base tokens instead of hardcoded generic values
- [x] 2.2 Verify `apps/home` keeps responsive container and grid behavior after the styling update
- [x] 2.3 Align `apps/home/app.config.json` with the PUEDATA default `themeColor` and `backgroundColor` values used by this change
- [x] 2.4 Apply `background.soft` to the runtime page canvas in `home` while keeping manifest background metadata neutral

## 3. Scaffold adoption

- [x] 3.1 Update `tooling/create-miniapp/src/cli.js` so generated `src/styles/index.css` uses the shared PUEDATA base primitives
- [x] 3.2 Preserve a clear accent override path in generated styles so each miniapp can keep app-specific color treatments
- [x] 3.3 Ensure generated `app.config.json`, `index.html`, and PWA manifest metadata inherit the new default color values unless explicitly overridden

## 4. Validation

- [x] 4.1 Create a fresh miniapp from the scaffold and verify it starts with the PUEDATA base identity
- [x] 4.2 Review `home` and the generated miniapp together to confirm the shared baseline is consistent while allowing local particularities
- [x] 4.3 Update any affected developer-facing documentation that describes `--theme`, `--background`, or scaffold defaults
