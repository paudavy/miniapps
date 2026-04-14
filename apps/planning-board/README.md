# Planning Board

Resource planning board — an installable PWA and static web app for GitHub Pages.

## Tech Stack

- **Vite** + **Preact** + **TypeScript** (strict)
- **@preact/signals** for state
- **D3.js** for drag/resize interaction only
- **Dexie** for IndexedDB persistence
- **vite-plugin-pwa** for offline-first PWA
- **Vitest** for testing

## Prerequisites

- Node.js 20+
- npm

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test:run

# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  app/          App shell, PWA registration, PNG export
  domain/       Pure functions: types, slot math, overload detection, validation
  persistence/  Dexie database and repository layer
  state/        Signals and actions (autosave on every mutation)
  ui/           Preact components with co-located CSS
  styles/       Global CSS tokens and reset
```

## Key Decisions

- **No real dates** — slots are 0-based integers; labels are D1..D60 (days) or W1..W60 (weeks)
- **No backend** — all data persists in IndexedDB via Dexie
- **No external scheduler library** — Preact renders the DOM, D3 handles drag/resize only
- **Autosave on every mutation** — no Save button
- **Over-allocation** detected when total dedication per slot exceeds 100%

## Deployment

Push to `main` to trigger CI (lint, typecheck, test, build) and automatic deploy to GitHub Pages via the `deploy.yml` workflow.

## License

ISC
