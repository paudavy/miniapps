#!/usr/bin/env node
/**
 * create-miniapp CLI
 * Usage: node tooling/create-miniapp/src/cli.js <slug> [options]
 *   or:  pnpm new:miniapp <slug> [options]
 */

import { existsSync, rmSync, copyFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import { parseArgs, validateSlug, titleFromSlug, write } from './utils.js';
import {
  appConfigJson, packageJson, tsConfig, viteConfig,
  indexHtml, notFoundHtml, mainTsx, appTsx, appShellTsx,
  useLocalStorageTs, constantsTs, indexCss,
} from './templates.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = resolve(__dirname, '../../static');

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const rawArgs = parseArgs(process.argv);
  const { slug } = rawArgs;

  try {
    validateSlug(slug);
  } catch (err) {
    console.error(`\n✗ ${err.message}\n`);
    process.exit(1);
  }

  const appDir = resolve(process.cwd(), 'apps', slug);
  if (existsSync(appDir)) {
    console.error(`\n✗ La app "${slug}" ya existe en apps/${slug}\n`);
    process.exit(1);
  }

  const ctx = {
    ...rawArgs,
    title: rawArgs.title || titleFromSlug(slug),
    desc:  rawArgs.desc  || `${rawArgs.title || titleFromSlug(slug)} offline`,
  };

  console.log(`\nCreando miniapp "${slug}"...`);

  try {
    generateFiles(ctx, appDir);
    copyIcons(ctx, appDir);
    runPostGeneration();
    printSuccess(ctx);
  } catch (err) {
    console.error(`\n✗ Error al generar: ${err.message}`);
    rmSync(appDir, { recursive: true, force: true });
    process.exit(1);
  }
}

// ── File generation ───────────────────────────────────────────────────────────

function generateFiles(ctx, appDir) {
  const a = (rel) => join(appDir, rel);

  write(a('app.config.json'),              appConfigJson(ctx));
  write(a('package.json'),                 packageJson(ctx));
  write(a('tsconfig.json'),                tsConfig());
  write(a('vite.config.ts'),               viteConfig(ctx));
  write(a('index.html'),                   indexHtml(ctx));
  write(a('src/main.tsx'),                 mainTsx());
  write(a('src/app/App.tsx'),              appTsx(ctx));
  write(a('src/components/AppShell.tsx'),  appShellTsx(ctx));
  write(a('src/hooks/useLocalStorage.ts'), useLocalStorageTs());
  write(a('src/lib/constants.ts'),         constantsTs(ctx));
  write(a('src/styles/index.css'),         indexCss(ctx));
  write(a('src/features/.gitkeep'),        '');

  if (ctx.router) {
    write(a('public/404.html'), notFoundHtml(ctx));
  }
}

function copyIcons(ctx, appDir) {
  const publicDir = join(appDir, 'public');
  for (const icon of ['pwa-192.png', 'pwa-512.png']) {
    const src = join(STATIC_DIR, icon);
    if (!existsSync(src)) {
      throw new Error(`Icono por defecto no encontrado: ${src}`);
    }
    write(join(publicDir, icon), '');            // ensure dir exists
    copyFileSync(src, join(publicDir, icon));
  }
}

function runPostGeneration() {
  execFileSync('node', ['scripts/generate-home-registry.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/validate-miniapps.mjs'], { stdio: 'inherit' });
}

function printSuccess(ctx) {
  console.log(`
✓ Miniapp "${ctx.slug}" creada correctamente.

  Desarrollar:
    pnpm --filter @miniapps/${ctx.slug} dev

  Build:
    pnpm --filter @miniapps/${ctx.slug} build

  Siguiente paso:
    Implementa la lógica en apps/${ctx.slug}/src/app/App.tsx
`);
}

main();
