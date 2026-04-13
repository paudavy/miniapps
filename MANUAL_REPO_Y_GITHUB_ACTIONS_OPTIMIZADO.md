# Manual detallado: creación y uso del repo, GitHub Pages y GitHub Actions

## 1. Qué resuelve este repositorio

Este repositorio permite alojar varias miniapps PWA independientes en un único monorepo. Cada app vive en `apps/<slug>` y se publica en GitHub Pages como una subruta del repositorio, por ejemplo:

- `https://<usuario>.github.io/<repo>/`
- `https://<usuario>.github.io/<repo>/notes/`
- `https://<usuario>.github.io/<repo>/focus-timer/`

La arquitectura se apoya en GitHub Pages con GitHub Actions como fuente de publicación, Vite como builder estático y `vite-plugin-pwa` para manifest y service worker.

## 2. Requisitos previos

Instala localmente:

- Git
- Node.js 20 o superior
- pnpm 10

Comandos orientativos:

```bash
node -v
pnpm -v
git --version
```

## 3. Crear el repositorio en GitHub

### 3.1. Desde la interfaz web

1. Ve a GitHub.
2. Pulsa **New repository**.
3. Asigna un nombre, por ejemplo `miniapps`.
4. Márcalo como público si quieres el caso más simple con GitHub Pages.
5. Crea el repositorio.

### 3.2. Vincular el repositorio local

```bash
git init
git remote add origin https://github.com/<usuario>/<repo>.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## 4. Estructura del repositorio

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
└─ .github/workflows/
```

## 5. Instalación local

```bash
pnpm install
pnpm validate:miniapps
pnpm generate:home
```

## 6. Ejecutar miniapps en local

```bash
pnpm --filter @miniapps/home dev
pnpm --filter @miniapps/notes dev
pnpm --filter @miniapps/focus-timer dev
```

## 7. Crear una nueva miniapp

```bash
pnpm new:miniapp <slug> [opciones]
```

Ejemplos:

```bash
pnpm new:miniapp shopping-list
pnpm new:miniapp habit-tracker --title "Habit Tracker" --desc "Seguimiento de hábitos" --router --theme "#0f766e"
```

Opciones soportadas:

- `--title <texto>`
- `--desc <texto>`
- `--router`
- `--no-pwa`
- `--theme <hex>`
- `--background <hex>`
- `--category <texto>`
- `--tags <csv>`
- `--icon <nombre>`
- `--listed=false`

Qué hace el comando:

1. valida el slug
2. crea `apps/<slug>`
3. genera archivos base
4. copia iconos PWA por defecto
5. crea `404.html` si hay router
6. actualiza `apps/home/src/generated/apps-registry.ts`
7. deja la app lista para desarrollar

## 8. Validación estructural

```bash
pnpm validate:miniapps
```

Comprueba:

- nombres válidos
- ficheros obligatorios
- coherencia de metadatos
- iconos requeridos
- `404.html` si `router=true`
- ausencia de lógica de redirect en apps sin router

## 9. Regenerar el launcher home

```bash
pnpm generate:home
```

## 10. Build para GitHub Pages

```bash
pnpm build:pages
```

## 11. Previsualización del artefacto final

```bash
pnpm preview:pages
```

## 12. Activar GitHub Pages con GitHub Actions

1. Entra en el repositorio.
2. Ve a **Settings**.
3. Abre **Pages**.
4. En **Build and deployment**, elige **Source: GitHub Actions**.

## 13. Workflow incluido

El workflow hace esto:

1. checkout
2. setup de pnpm y Node
3. `pnpm install --frozen-lockfile`
4. validación del repo
5. build de Pages
6. subida de `dist-pages/`
7. despliegue

## 14. Primer despliegue

```bash
git add .
git commit -m "Add miniapps monorepo"
git push origin main
```

## 15. Base de subruta

En GitHub Pages para repositorios de proyecto, Vite debe construirse con `base: '/<repo>/'` o `base: '/<repo>/<app>/'` según el caso. Este repositorio calcula esa base desde `GITHUB_REPOSITORY` en CI o `VITE_REPO_NAME` en local.

## 16. Recarga en subrutas de SPA

GitHub Pages no resuelve routing server-side para SPAs. Por eso, las apps con router incluyen `public/404.html` y restauración de ruta en `index.html`.

## 17. Problemas comunes

### 17.1. Assets con 404
Revisa `base` y el nombre real del repo.

### 17.2. Una SPA falla al recargar
Revisa `public/404.html` y `router=true`.

### 17.3. `home` no muestra una app
Revisa `listed`, `app.config.json` y ejecuta `pnpm generate:home`.

### 17.4. Falla GitHub Actions
Revisa Node, pnpm y que `pnpm validate:miniapps` pase en local.

## 18. Flujo recomendado

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

## 19. Qué incluye este ejemplo

- `notes`: bloc de notas offline con almacenamiento local
- `focus-timer`: temporizador simple con persistencia local y soporte de router
- `home`: launcher generado
- generador `create-miniapp`
- validación estructural
- build agregador para Pages
- workflow de despliegue
