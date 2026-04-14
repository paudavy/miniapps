## Why

Los scripts en `scripts/*.mjs` y `scripts/lib/miniapps.mjs` son infrastructure crítica del monorepo: validan la estructura de mini-apps, generan el registry del home, y orquestan el build. Sin tests, un error ahí rompe silenciosamente todo el pipeline. Ya tenemos 30 tests en planning-board (vitest), pero cero en scripts.

## What Changes

- Agregar tests usando `node:test` (built-in, no requiere nuevas dependencias)
- Tests ubicados en `scripts/` junto a los scripts que testean
- Usar archivos temporales (`os.tmpdir()`) para mock de filesystem

## Capabilities

### New Capabilities

- `script-tests`: Suite de tests unitarios para `scripts/*.mjs` covering:
  - `lib/miniapps.mjs`: isValidSlug, getRepoName, getAppBase, readJson, listAppNames
  - `validate-miniapps.mjs`: detección de slugs inválidos, archivos faltantes, duplicados
  - `generate-home-registry.mjs`: filtering, sorting, estructura del registry

### Modified Capabilities

- (none)

## Impact

- Archivo nuevo: `scripts/lib/miniapps.mjs.test.mjs`
- Archivo nuevo: `scripts/validate-miniapps.test.mjs`
- Archivo nuevo: `scripts/generate-home-registry.test.mjs`
- Script nuevo en package.json root: `"test:scripts": "node --test scripts/**/*.test.mjs"`