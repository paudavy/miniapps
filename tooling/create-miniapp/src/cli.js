#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RESERVED_APP_NAMES, SCAFFOLD_DEFAULTS, isValidSlug } from '../../../scripts/lib/miniapps.mjs';

function parseArgs(argv) {
  const args = { slug: argv[2], ...SCAFFOLD_DEFAULTS };

  for (let index = 3; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === '--router') args.router = true;
    else if (current === '--no-pwa') args.pwa = false;
    else if (current === '--listed=false') args.listed = false;
    else if (current === '--title') args.title = argv[++index] || '';
    else if (current === '--desc') args.desc = argv[++index] || '';
    else if (current === '--theme') args.theme = argv[++index] || SCAFFOLD_DEFAULTS.theme;
    else if (current === '--background') args.background = argv[++index] || SCAFFOLD_DEFAULTS.background;
    else if (current === '--category') args.category = argv[++index] || undefined;
    else if (current === '--tags') args.tags = (argv[++index] || '').split(',').map((value) => value.trim()).filter(Boolean);
    else if (current === '--icon') args.icon = argv[++index] || undefined;
  }

  return args;
}

function ensureValidSlug(slug) {
  if (!slug) throw new Error('Debes indicar un slug.');
  if (!isValidSlug(slug)) throw new Error('Slug inválido. Usa kebab-case.');
  if (RESERVED_APP_NAMES.has(slug)) throw new Error('Slug reservado.');
}

function titleFromSlug(slug) {
  return slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function write(relativePath, content) {
  const filePath = join(process.cwd(), relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

function copyDefaultIcons(appDir) {
  const publicDir = join(appDir, 'public');
  mkdirSync(publicDir, { recursive: true });
  const candidates = [
    resolve(process.cwd(), 'assets/pwa'),
    join(dirname(fileURLToPath(import.meta.url)), '..', 'static')
  ];
  const src = candidates.find((p) => existsSync(p));
  if (!src) {
    console.warn('No default PWA icons found; skipping icon copy.');
    return;
  }
  copyFileSync(join(src, 'pwa-192.png'), join(publicDir, 'pwa-192.png'));
  copyFileSync(join(src, 'pwa-512.png'), join(publicDir, 'pwa-512.png'));
}

function buildIndexHtml({ title, theme, router }) {
  const redirectScript = router
    ? `
    <script>
      const qs = new URLSearchParams(location.search);
      const redirect = qs.get('redirect');
      if (redirect) {
        history.replaceState(null, '', decodeURIComponent(redirect));
      }
    </script>`
    : '';

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="theme-color" content="${theme}" />
  </head>
  <body>
    <div id="app"></div>${redirectScript}
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

function buildViteConfig({ pwa }) {
  const baseLine = `  return repo ? \`/\${repo}/\${appConfig.name}/\` : \`/\${appConfig.name}/\`;`;
  const pwaImport = pwa ? `import { VitePWA } from 'vite-plugin-pwa';
` : '';
  const pwaPlugin = pwa
    ? `,
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192.png', 'pwa-512.png'],
      manifest: {
        name: appConfig.title,
        short_name: appConfig.title,
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: appConfig.backgroundColor,
        theme_color: appConfig.themeColor,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })`
    : '';

  return `import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
${pwaImport}import appConfig from './app.config.json';

function getPagesBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1] || process.env.VITE_REPO_NAME || '';
  ${baseLine}
}

const base = getPagesBase();

export default defineConfig({
  base,
  plugins: [
    preact()${pwaPlugin}
  ]
});
`;
}

function build404Html({ slug, title }) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${title} - redirect</title>
    <script>
      (function(){
        const slug = '${slug}';
        const marker = '/' + slug + '/';
        const idx = location.pathname.lastIndexOf(marker);
        const base = idx !== -1 ? location.pathname.slice(0, idx + marker.length) : marker;
        const path = idx !== -1 ? location.pathname.slice(idx + marker.length) : location.pathname.replace(marker, '');
        const query = location.search || '';
        location.replace(base + '?redirect=' + encodeURIComponent('/' + path + query + location.hash));
      })();
    </script>
  </head>
  <body></body>
</html>`;
}

function generateFiles(args) {
  const slug = args.slug;
  const title = args.title || titleFromSlug(slug);
  const description = args.desc || `${title} offline`;
  const appDir = join('apps', slug);
  const appConfig = {
    name: slug,
    title,
    description,
    listed: args.listed,
    pwa: args.pwa,
    router: args.router,
    themeColor: args.theme,
    backgroundColor: args.background,
    ...(args.icon ? { icon: args.icon } : {}),
    ...(args.tags?.length ? { tags: args.tags } : {}),
    ...(args.category ? { category: args.category } : {})
  };
  const devDependencies = {
    '@preact/preset-vite': '^2.10.1',
    typescript: '^5.9.3',
    vite: '^7.1.0',
    ...(args.pwa ? { 'vite-plugin-pwa': '^1.0.0' } : {})
  };

  write(join(appDir, 'app.config.json'), JSON.stringify(appConfig, null, 2));

  write(join(appDir, 'package.json'), JSON.stringify({
    name: `@miniapps/${slug}`,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      preact: '^10.26.4'
    },
    devDependencies
  }, null, 2));

  write(join(appDir, 'tsconfig.json'), JSON.stringify({
    extends: '../../tsconfig.base.json',
    compilerOptions: { types: ['vite/client'] },
    include: ['src', 'vite.config.ts']
  }, null, 2));

  write(join(appDir, 'index.html'), buildIndexHtml({ title, theme: args.theme, router: args.router }));
  write(join(appDir, 'vite.config.ts'), buildViteConfig({ pwa: args.pwa }));

  if (args.pwa) {
    copyDefaultIcons(appDir);
  }

  if (args.router) {
    write(join(appDir, 'public/404.html'), build404Html({ slug, title }));
  }

  write(join(appDir, 'src/main.tsx'), `import { render } from 'preact';
import { App } from './app/App';
import './styles/index.css';

render(<App />, document.getElementById('app')!);
`);

  write(join(appDir, 'src/app/App.tsx'), `import { AppShell } from '../components/AppShell';

export function App() {
  return (
    <AppShell>
      <section class="card">
        <h2>${title}</h2>
        <p>Plantilla base generada correctamente. Implementa aquí la lógica de la miniapp.</p>
      </section>
    </AppShell>
  );
}
`);

  write(join(appDir, 'src/components/AppShell.tsx'), `import type { ComponentChildren } from 'preact';

export function AppShell(props: { children: ComponentChildren }) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <h1>${title}</h1>
        <p>${description}</p>
      </header>
      <main>{props.children}</main>
    </div>
  );
}
`);

  write(join(appDir, 'src/hooks/useLocalStorage.ts'), `import { useEffect, useState } from 'preact/hooks';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
`);

  write(join(appDir, 'src/lib/constants.ts'), `export const APP_NAME = '${slug}';
export const STORAGE_PREFIX = 'miniapps:${slug}:';
`);
  write(join(appDir, 'src/features/.gitkeep'), '');
  write(join(appDir, 'src/styles/index.css'), `:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #0f172a;
  background: #f8fafc;
}

body { margin: 0; }
.app-shell { max-width: 860px; margin: 0 auto; padding: 2rem; }
.app-shell__header { margin-bottom: 1.5rem; }
.card { background: white; border: 1px solid #cbd5e1; border-radius: 16px; padding: 1rem; }
button { background: ${args.theme}; color: white; border: none; border-radius: 10px; padding: 0.75rem 1rem; }
input, textarea { width: 100%; box-sizing: border-box; padding: 0.75rem; border-radius: 10px; border: 1px solid #cbd5e1; }
`);
}

function runPostGeneration() {
  execFileSync('node', ['scripts/generate-home-registry.mjs'], { stdio: 'inherit' });
  execFileSync('node', ['scripts/validate-miniapps.mjs'], { stdio: 'inherit' });
}

function main() {
  const args = parseArgs(process.argv);
  ensureValidSlug(args.slug);

  const appDir = resolve(process.cwd(), 'apps', args.slug);
  if (existsSync(appDir)) throw new Error(`La app "${args.slug}" ya existe.`);

  try {
    generateFiles(args);
  } catch (error) {
    rmSync(appDir, { recursive: true, force: true });
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  try {
    runPostGeneration();
    console.log(`Miniapp "${args.slug}" creada correctamente.`);
  } catch (error) {
    console.error(`Miniapp "${args.slug}" creada, pero falló la post-generación del repo.`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
