## Context

El monorepo usaNode.js scripts para infraestructura crítica:
- `lib/miniapps.mjs` - helpers compartidos (slug validation, lectura de configs, paths)
- `validate-miniapps.mjs` - valida estructura de mini-apps antes de build
- `generate-home-registry.mjs` - genera el registry para el home
- `build-pages.mjs` -(build + copy a dist-pages)
- `preview-pages.mjs` - serve para preview

No hay test coverage para ningún script. Un error silencioso en un script rompe el pipeline entero.

## Goals / Non-Goals

**Goals:**
- Agregar tests unitarios para `scripts/*.mjs` usando `node:test` (built-in)
- Ubicar tests junto a los scripts (`scripts/*.test.mjs`)
- Mock de filesystem usando archivos temporales reales (no mock de librería)

**Non-Goals:**
- Tests de integración (build-pages, preview-pages que usan execSync)
- Tests end-to-end del pipeline
- Migrar tests existentes de otras apps

## Decisions

### D1: ¿Dónde ubicamos los tests?

**Elegido:** `scripts/` (ej: `scripts/lib/miniapps.test.mjs`)

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| `scripts/` | Co-localizados con código, discover automático con `node --test scripts/**/*.mjs` | - |
| `tests/` | Separado de código | Dos ubicariones para recordar |
| `tests/scripts/` | Claro que son tests | Más profunda la ruta |

**Rationale:** Co-localización es convención común. El flag `node --test` hace discover automático.

### D2: ¿Cómo mockear filesystem?

**Elegido:** Archivos temporales reales (`os.tmpDir()` + `fs.mkdtempSync()`)

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| Archivos reales en temp | tests realistas, cubre path bugs | Cleanup necesario |
| `memfs` o `mock-fs` | No cleanup, rápido | No refleja bugs reales de paths |

**Rationale:** Los scripts deal con paths y filesystem. Mocking con librería puede ocultar bugs. Cleanup con `teardown` function.

### D3: ¿node:test o Vitest?

**Elegido:** `node:test` (built-in en Node.js)

**Rationale:** Scripts son `.mjs`, no tienen imports de vitest. No agregar dependencia nueva. `node --test` funciona native.

## Risks / Trade-offs

- [Risk] Tests que fallan si cambia estructura de apps/ **→** Tests deben crear su propio temp dir con estructura de apps	mockeada, no usar `apps/` real
- [Risk] Tests lentos por I/O real **→** Okay por ahora, son rápidos. Siemperez de más, migrate a memfs
- [Trade-off] No hay coverage reporting **→** `node:test` solo dice pass/fail. Para coverage, necesitaríamos agregar c8

## Migration Plan

1. Crear test file para `lib/miniapps.mjs` (CORE - usado por todos)
2. Crear test file para `validate-miniapps.mjs`
3. Crear test file para `generate-home-registry.mjs`
4. Agregar script `test:scripts` a package.json root
5. Correr y verificar tests pasan

## Open Questions

1. ¿Agregar `test:coverage` con c8? Por ahora no, mantener simple.
2. ¿Tests para `build-pages.mjs`? Son principalmente execSync, difícil unit test. Por ahora skip.