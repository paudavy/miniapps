## Why

El repositorio ya tiene una base de identidad compartida en `styles/base.css`, pero no todas las miniapps la consumen de forma consistente y `planning-board` usa una convención de tokens en componentes que no coincide con los tokens definidos en su capa `--board-*`. Esto dificulta mantener una identidad común, introduce deuda visual y aumenta el riesgo de regresiones al scaffold y al build.

## What Changes

- Estandarizar el contrato “identidad base + extensión por app” para todas las miniapps.
- Migrar por app:
  - `home`: mantener patrón actual y endurecer cumplimiento (sin ajuste de componentes esperado).
  - `focus-timer` y `notes`: adoptar import de `base.css` y tokens semánticos del scaffold (ajustes de componentes sólo si el estilo inline o clases actuales impiden consumir tokens semánticos).
  - `planning-board`: aplicar estrategia híbrida (alias temporal + migración progresiva de componentes), con ajuste de componentes requerido.
- Actualizar el scaffold para que el estilo generado deje explícita la frontera entre base compartida y capa local.
- Añadir reglas automáticas de validación de estilos para detectar:
  - apps sin import de `base.css`,
  - uso de tokens no declarados,
  - desalineación entre vocabulario de tokens y andamiaje.
- Emitir un reporte de cumplimiento por app para guiar la migración y evitar regresiones futuras, incluyendo si requiere ajuste de componentes para alinearse al andamiaje vigente.

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `miniapp-scaffold-brand-foundation`: reforzar que el scaffold genera una capa local compatible con la identidad base y con una ruta de evolución explícita para apps complejas (alias temporal y migración progresiva).
- `validate-miniapps`: ampliar la validación estructural existente para incluir contrato de estilos, reporte por app y trazabilidad de necesidad de ajuste de componentes.

## Impact

- Código afectado:
  - `tooling/create-miniapp/src/cli.js`
  - `scripts/validate-miniapps.mjs` y utilidades relacionadas
  - `apps/focus-timer/src/styles/index.css`
  - `apps/notes/src/styles/index.css`
  - `apps/planning-board/src/styles/*` y componentes CSS de `features/board/ui`
- Sin cambios en APIs públicas externas.
- Incremento moderado de checks en CI/local.

## Non-goals

- Rediseñar la identidad visual PUEDATA o reemplazar `styles/base.css`.
- Reescribir por completo `planning-board` en una sola iteración.
- Introducir CSS-in-JS o cambiar de stack de estilos.

## Evidencia

- Base de identidad compartida: `styles/base.css`
- Scaffold ya importa base y define capa local: `tooling/create-miniapp/src/cli.js`
- `home` ya usa base + capa local: `apps/home/src/styles/index.css`
- `focus-timer` sin base importado actualmente: `apps/focus-timer/src/styles/index.css`
- `notes` sin base importado actualmente: `apps/notes/src/styles/index.css`
- `planning-board` importa base pero usa vocabulario de tokens no alineado en componentes: `apps/planning-board/src/styles/index.css`, `apps/planning-board/src/styles/tokens.css`, `apps/planning-board/src/features/board/ui/Toolbar.css`
