## Why

La app `home` y el andamiaje de nuevas miniapps usan estilos base genéricos y hardcodeados que no reflejan la identidad visual de PUEDATA. Definir una base compartida ahora permite alinear tipografía, color, spacing y radius en el punto de entrada del producto y en todas las miniapps nuevas sin forzar una migración completa del repositorio en esta etapa.

## What Changes

- Aplicar una base visual PUEDATA a `apps/home` usando tokens semánticos para tipografía, color, spacing y radius.
- Actualizar el scaffolding de `tooling/create-miniapp` para que las miniapps nuevas nazcan con esa misma base de marca.
- Mantener espacio para particularidades por miniapp, especialmente en acentos y composición, sin romper la identidad base compartida.
- Documentar la traducción de los `design_tokens` entregados a una capa utilizable por CSS del repo.
- Establecer una nomenclatura mínima de tokens semánticos para fondo de página, superficies, texto, bordes y acento antes de implementar la adopción visual.
- Ajustar los valores por defecto de `themeColor` y `backgroundColor` para que el manifest y el scaffold arranquen con la identidad PUEDATA.

## Capabilities

### New Capabilities
- `home-brand-foundation`: define los requisitos visuales base de PUEDATA para la app `home`.
- `miniapp-scaffold-brand-foundation`: define los estilos base y la vocabulario semántico que deben generarse en nuevas miniapps creadas con el scaffold.

### Modified Capabilities
- Ninguna.

## Impact

- `apps/home/src/styles/index.css`
- `apps/home/app.config.json`
- `tooling/create-miniapp/src/cli.js`
- `scripts/lib/miniapps.mjs`
- `README.md`
- Posibles assets o imports tipograficos compartidos para sostener la identidad base
- Nuevas specs OpenSpec para fijar los requisitos visuales y del scaffold

## Non-goals

- Migrar en este cambio todas las miniapps existentes fuera de `apps/home`.
- Rediseñar flujos, layouts o copy de producto mas alla de los ajustes necesarios para adoptar la base visual.
- Eliminar por completo la posibilidad de personalizacion visual por miniapp.

## Evidencia

- `apps/home/src/styles/index.css`
- `apps/home/app.config.json`
- `tooling/create-miniapp/src/cli.js`
- `scripts/lib/miniapps.mjs`
