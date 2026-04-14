
/**
 * All file templates for a new miniapp.
 * Functions receive a resolved `ctx` object and return file content strings.
 */

export function appConfigJson(ctx) {
  return JSON.stringify({
    name:            ctx.slug,
    title:           ctx.title,
    description:     ctx.desc,
    listed:          ctx.listed,
    pwa:             ctx.pwa,
    router:          ctx.router,
    themeColor:      ctx.theme,
    backgroundColor: ctx.background,
    icon:            ctx.icon,
    tags:            ctx.tags,
    category:        ctx.category,
  }, null, 2);
}

export function packageJson(ctx) {
  return JSON.stringify({
    name:    `@miniapps/${ctx.slug}`,
    private: true,
    version: '0.1.0',
    type:    'module',
    scripts: {
      dev:     'vite',
      build:   'vite build',
      preview: 'vite preview',
    },
    dependencies: { preact: '^10.26.4' },
    devDependencies: {
      '@preact/preset-vite': '^2.10.1',
      typescript:            '^5.9.3',
      vite:                  '^7.1.0',
      'vite-plugin-pwa':     '^1.0.0',
    },
  }, null, 2);
}

export function tsConfig() {
  return JSON.stringify({
    extends: '../../tsconfig.base.json',
    compilerOptions: { types: ['vite/client'] },
    include: ['src', 'vite.config.ts'],
  }, null, 2);
}

/** vite.config.ts reads name/theme/colors from app.config.json — no hardcoded slug. */
export function viteConfig(ctx) {
  const workbox = ctx.router
    ? `\n      workbox: { navigateFallback: 'index.html' },`
    : '';
  return `\
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import appConfig from './app.config.json';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? process.env.VITE_REPO_NAME ?? '';
const base = repo ? \`/\${repo}/\${appConfig.name}/\` : \`/\${appConfig.name}/\`;

export default defineConfig({
  base,
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name:             appConfig.title,
        short_name:       appConfig.title,
        start_url:        base,
        scope:            base,
        display:          'standalone',
        background_color: appConfig.backgroundColor,
        theme_color:      appConfig.themeColor,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },${workbox}
    }),
  ],
});
`;
}

export function indexHtml(ctx) {
  const routerScript = ctx.router
    ? `\n    <script>
      (function () {
        var qs = new URLSearchParams(window.location.search);
        var redirect = qs.get('redirect');
        if (redirect) history.replaceState(null, '', decodeURIComponent(redirect));
      })();
    </script>`
    : '';
  return `\
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ctx.title}</title>
    <meta name="theme-color" content="${ctx.theme}" />
  </head>
  <body>
    <div id="app"></div>${routerScript}
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * 404.html for SPA routing on GitHub Pages.
 * Uses the slug baked at generation time to locate the correct base segment,
 * making detection robust regardless of whether the repo is at root or subroute.
 */
export function notFoundHtml(ctx) {
  return `\
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${ctx.title} — redirect</title>
    <script>
      (function () {
        var slug  = '${ctx.slug}';
        var parts = window.location.pathname.split('/').filter(Boolean);
        var idx   = parts.lastIndexOf(slug);
        var base  = idx > 0
          ? '/' + parts.slice(0, idx + 1).join('/') + '/'
          : '/' + slug + '/';
        var rest  = parts.slice(idx + 1).join('/');
        var qs    = window.location.search;
        var hash  = window.location.hash;
        window.location.replace(
          base + '?redirect=' + encodeURIComponent('/' + rest + qs + hash)
        );
      })();
    </script>
  </head>
  <body></body>
</html>
`;
}

export function mainTsx() {
  return `\
import { render } from 'preact';
import { App } from './app/App';
import './styles/index.css';

render(<App />, document.getElementById('app')!);
`;
}

export function appTsx(ctx) {
  return `\
import { AppShell } from '../components/AppShell';

export function App() {
  return (
    <AppShell>
      <section class="card">
        <h2>${ctx.title}</h2>
        <p>Plantilla base generada. Implementa aquí la lógica de la miniapp.</p>
      </section>
    </AppShell>
  );
}
`;
}

export function appShellTsx(ctx) {
  return `\
import type { ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
}

export function AppShell({ children }: Props) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <h1>${ctx.title}</h1>
        <p>${ctx.desc}</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
`;
}

/** Fully-typed useLocalStorage hook. */
export function useLocalStorageTs() {
  return `\
import { useEffect, useState } from 'preact/hooks';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.warn('localStorage no disponible');
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
`;
}

export function constantsTs(ctx) {
  return `\
export const APP_NAME      = '${ctx.slug}';
export const STORAGE_KEY   = 'miniapps:${ctx.slug}:';
`;
}

export function indexCss(ctx) {
  return `\
:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #0f172a;
  background: #f8fafc;
}

body { margin: 0; }

.app-shell {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem;
}

.app-shell__header {
  margin-bottom: 1.5rem;
}

.app-shell__header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  color: ${ctx.theme};
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  gap: 1rem;
}

button {
  background: ${ctx.theme};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input, textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  font-family: inherit;
  margin-top: 0.35rem;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}
`;
}

export function featureGitkeep() {
  return '';
}
