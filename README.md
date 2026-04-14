# Miniapps monorepo

Monorepo para alojar múltiples miniapps PWA independientes en GitHub Pages usando un único repositorio. Cada miniapp vive en `apps/<slug>` y se publica como una subruta estática del repositorio.

Ejemplos de URL finales:

- `https://<usuario>.github.io/<repo>/`
- `https://<usuario>.github.io/<repo>/notes/`
- `https://<usuario>.github.io/<repo>/focus-timer/`

La solución está pensada para reducir trabajo manual. El repo incluye un launcher `home`, un generador `pnpm new:miniapp`, validación estructural y un build agregador para Pages.

## Qué incluye

- `pnpm workspaces`
- `Vite + Preact + TypeScript`
- `vite-plugin-pwa` para manifest y service worker
- `apps/home` como launcher
- dos miniapps reales de ejemplo: `notes` y `focus-timer`
- generador `pnpm new:miniapp`
- validación automática del monorepo
- build y previsualización del artefacto final de Pages
- workflow de GitHub Actions para despliegue

## Crear el repositorio en GitHub

### Desde la interfaz web

1. Ve a GitHub.
2. Pulsa **New repository**.
3. Asigna un nombre, por ejemplo `miniapps`.
4. Márcalo como público si quieres el caso más simple con GitHub Pages.
5. Crea el repositorio.

### Vincular el repositorio local

```bash
git init
git remote add origin https://github.com/<usuario>/<repo>.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## Estructura

```text
miniapps/
├─ apps/
│  ├─ home/
│  ├─ notes/
│  └─ focus-timer/
├─ assets/
│  └─ pwa/
├─ tooling/
│  └─ create-miniapp/
├─ scripts/
│  ├─ lib/
│  ├─ build-pages.mjs
│  ├─ generate-home-registry.mjs
│  ├─ validate-miniapps.mjs
│  └─ preview-pages.mjs
├─ docs/
│  └─ MANUAL_REPO_Y_GITHUB_ACTIONS.md
└─ .github/workflows/
```

## Requisitos

- Git
- Node.js 20 o superior
- pnpm 10

Comprobación rápida:

```bash
node -v
pnpm -v
git --version
```

## Instalación local

```bash
pnpm install
pnpm validate:miniapps
pnpm generate:home
```

## Desarrollo local

```bash
pnpm --filter @miniapps/home dev
pnpm --filter @miniapps/notes dev
pnpm --filter @miniapps/focus-timer dev
```

## Crear una nueva miniapp

```bash
pnpm new:miniapp <slug> [opciones]
```

Ejemplos:

```bash
pnpm new:miniapp shopping-list
pnpm new:miniapp habit-tracker --title "Habit Tracker" --desc "Seguimiento de hábitos" --router --theme "#0f766e"
```

Opciones soportadas:

- `--title <texto>`: Nombre amigable de la miniapp. Se usa en el launcher `home` y en el `manifest` PWA.
	- Ejemplo: `--title "Habit Tracker"`

- `--desc <texto>`: Descripción corta de la app que aparece en el launcher y metadatos.
	- Ejemplo: `--desc "Seguimiento de hábitos"`

- `--router`: Activa el modo SPA con enrutador (cliente). El generador establecerá `router: true` en `app.config.json` y creará `public/404.html` para que GitHub Pages reescriba rutas a la app. Usar cuando la app necesita rutas internas (p.ej. `/settings`).

- `--no-pwa`: Genera una miniapp sin huella PWA innecesaria. No añade `vite-plugin-pwa`, no copia iconos PWA y no genera manifest ni service worker.

- `--theme <hex>`: Color primario en formato hexadecimal. Se aplica a `manifest.theme_color`, meta `theme-color` y variables CSS de la plantilla.
	- Ejemplo: `--theme "#0f766e"`

- `--background <hex>`: Color de fondo (hex) para `manifest.background_color` y estilos de pantalla de carga.
	- Ejemplo: `--background "#ffffff"`

- `--category <texto>`: Metadata opcional para clasificación futura. `home` no la necesita para funcionar.
	- Ejemplo: `--category "productivity"`

- `--tags <csv>`: Metadata opcional separada por comas. Se guarda solo si se proporciona.
	- Ejemplo: `--tags "habit,productivity,offline"`

- `--icon <nombre>`: Metadata opcional de icono. Solo se guarda si se proporciona.
	- Ejemplo: `--icon "leaf"`

- `--listed=false`: Indica que la app no debe aparecer listada en el launcher `home`. Por defecto las apps se listan; úsalo para apps privadas o en desarrollo.
	- Ejemplo: `--listed=false`

Ejemplo completo:

```
pnpm new:miniapp habit-tracker \
	--title "Habit Tracker" \
	--desc "Seguimiento de hábitos" \
	--router \
	--theme "#0f766e" \
	--background "#ffffff" \
	--tags "habit,productivity" \
	--icon "leaf"
```

Qué hace el generador:

1. valida el slug
2. crea `apps/<slug>`
3. genera los archivos base de la app
4. copia iconos PWA solo si la app es PWA
5. crea `404.html` si la app usa router
6. regenera el launcher `home`
7. valida el resultado y, si falla por un problema global del repo, conserva la nueva app para revisión

## Validación

```bash
pnpm validate:miniapps
```

Comprueba:

- nombres válidos
- ficheros obligatorios
- coherencia entre `app.config.json` y `package.json`
- iconos requeridos solo para apps PWA
- `404.html` si `router=true`
- ausencia de lógica de redirect en apps sin router

## Generar el launcher home

```bash
pnpm generate:home
```

## Build para GitHub Pages

```bash
pnpm build:pages
```

Genera `dist-pages/` con esta estructura:

```text
dist-pages/
├─ index.html
├─ assets/
├─ notes/
└─ focus-timer/
```

## Previsualización local del artefacto final

```bash
pnpm preview:pages
```

## GitHub Pages y GitHub Actions

1. Crea el repositorio en GitHub.
2. Sube el contenido a la rama `main`.
3. Ve a **Settings > Pages**.
4. En **Build and deployment**, selecciona **GitHub Actions**.
5. Haz push a `main`.

El workflow incluido hace esto:

1. checkout
2. setup de pnpm y Node
3. `pnpm install --frozen-lockfile`
4. validación del repo
5. build de Pages
6. subida de `dist-pages/`
7. despliegue

## Puntos técnicos importantes

### Base de subruta

GitHub Pages para repositorios de proyecto sirve el sitio bajo `/<repo>/`. Por eso cada miniapp debe construir con una base del tipo `/<repo>/<app>/`. Este repo calcula esa base a partir de `GITHUB_REPOSITORY` en CI o `VITE_REPO_NAME` en local.

### Recarga en subrutas de SPA

GitHub Pages no resuelve rutas profundas de SPA. Las apps con router incluyen `public/404.html` y restauran la ruta al arrancar.

## Problemas comunes

### Assets con 404
Revisa `VITE_REPO_NAME`, `GITHUB_REPOSITORY` y el nombre real del repo.

### Una SPA falla al recargar
Revisa `public/404.html` y que `router` esté activado en `app.config.json`.

### `home` no muestra una app
Revisa `listed`, ejecuta `pnpm generate:home` y vuelve a validar.

### Falla GitHub Actions
Comprueba que `pnpm validate:miniapps` y `pnpm build:pages` funcionan en local.

## Ejemplo de flujo completo

```bash
pnpm new:miniapp weekly-planner --title "Weekly Planner" --desc "Planificador semanal offline" --theme "#7c3aed"
pnpm validate:miniapps
pnpm generate:home
pnpm --filter @miniapps/weekly-planner dev
pnpm build:pages
pnpm preview:pages
git add .
git commit -m "Add weekly-planner miniapp"
git push
```

---
