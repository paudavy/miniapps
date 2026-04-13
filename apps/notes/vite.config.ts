import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import appConfig from './app.config.json';

function getPagesBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || process.env.VITE_REPO_NAME || '';
  return repo ? `/${repo}/notes/` : '/notes/';
}

const base = getPagesBase();

export default defineConfig({
  base,
  plugins: [
    preact(),
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
      },
      workbox: {
        navigateFallback: 'index.html'
      }
    })
  ]
});
