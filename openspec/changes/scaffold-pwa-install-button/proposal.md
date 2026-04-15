## Why

Las miniapps PWA creadas con el andamiaje no incluyen una experiencia estándar para instalación desde la UI, lo que produce implementación ad hoc por app y menor consistencia. Esto ya aparece en una app existente y conviene normalizarlo ahora para reducir duplicación y acelerar nuevas miniapps.

## What Changes

- Añadir en el andamiaje una variante genérica de botón de instalación para miniapps PWA.
- Ubicar su render en AppShell para que sea un punto común de UI.
- Condicionar su presencia a apps con pwa=true (sin huella en apps no PWA).
- Ajustar la plantilla de App.tsx para registrar eventos de instalación solo en apps PWA.
- Actualizar pruebas del generador para validar presencia/ausencia del botón según configuración PWA.
- Dejar planning-board como referencia funcional existente, pero fuera del alcance de implementación de este cambio.

## Capabilities

### New Capabilities
- `pwa-install-ui`: Componente y cableado base de instalación PWA reutilizable en miniapps generadas.

### Modified Capabilities
- `scaffold-cli`: La salida generada cambia para incluir artefactos de instalación PWA solo cuando aplica.
- `pwa-conventions`: Se extiende la convención para incluir punto de entrada visual de instalación en AppShell.

## Impact

- Código afectado:
  - tooling/create-miniapp/src/cli.js
  - scripts/tests/create-miniapp.test.mjs
  - plantilla generada de src/app/App.tsx y src/components/AppShell.tsx
- Sin cambios en APIs públicas externas.
- Dependencias: sin nuevas dependencias esperadas; se reutiliza lo ya disponible para PWA.

## Non-goals

- No rediseñar estilos globales ni layout completo de AppShell.
- No forzar botón de instalación en apps con pwa=false.
- No modificar miniapps existentes como parte necesaria de este cambio; el foco principal es el andamiaje.

## Evidencia

- planning-board ya implementa lógica de instalación de forma específica en:
  - apps/planning-board/src/features/board/ui/InstallButton.tsx
  - apps/planning-board/src/app/registerSW.ts
- El scaffold ya diferencia apps PWA/no-PWA con bandera y generación condicional en:
  - tooling/create-miniapp/src/cli.js
- Las pruebas del generador ya cubren escenarios PWA y no-PWA en:
  - scripts/tests/create-miniapp.test.mjs
