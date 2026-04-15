## 1. Scaffold generation updates

- [x] 1.1 Añadir en tooling/create-miniapp/src/cli.js la generación condicional (solo PWA) de módulos de instalación y su wiring en App.tsx
- [x] 1.2 Actualizar la plantilla de AppShell en el scaffold para incluir el render point del botón de instalación en la variante PWA
- [x] 1.3 Asegurar que la ruta no-PWA no genere archivos, imports ni render de instalación

## 2. Contract and template consistency

- [x] 2.1 Confirmar que la variante PWA generada reutiliza sólo APIs web estándar (`beforeinstallprompt`, `appinstalled`) y no introduce dependencias nuevas
- [x] 2.2 Verificar que la plantilla generada mantiene el comportamiento de shell limpio y que el control de instalación sólo aparece cuando el prompt está disponible

## 3. Tests and validation

- [x] 3.1 Extender scripts/tests/create-miniapp.test.mjs para verificar artefactos de instalación en scaffold PWA
- [x] 3.2 Extender scripts/tests/create-miniapp.test.mjs para verificar ausencia total de artefactos de instalación en scaffold no-PWA
- [x] 3.3 Ejecutar tests y validaciones del repo relacionadas al scaffold y registrar resultados
