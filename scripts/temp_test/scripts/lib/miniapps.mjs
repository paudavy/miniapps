import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const APPS_DIR = join(process.cwd(), 'apps');
export const HOME_DIR = join(APPS_DIR, 'home');
export const HOME_REGISTRY_PATH = join(HOME_DIR, 'src', 'generated', 'apps-registry.ts');
export const RESERVED_APP_NAMES = new Set(['home', 'shared', 'config', 'tooling']);
export const REQUIRED_APP_FILES = [
  'package.json',
  'index.html',
  'vite.config.ts',
  'src/main.tsx',
  'src/app/App.tsx',
  'public/pwa-192.png',
  'public/pwa-512.png'
];

export function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function getRepoName() {
  return (process.env.GITHUB_REPOSITORY?.split('/')[1] || process.env.VITE_REPO_NAME || '').trim();
}

export function getAppBase(appName) {
  const repo = getRepoName();
  return repo ? `/${repo}/${appName}/` : `/${appName}/`;
}

export function getHomeBase() {
  const repo = getRepoName();
  return repo ? `/${repo}/` : '/';
}

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export function listAppNames() {
  return readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function getAppDir(appName) {
  return join(APPS_DIR, appName);
}

export function getAppConfigPath(appName) {
  return join(getAppDir(appName), 'app.config.json');
}

export function readAppConfig(appName) {
  return readJson(getAppConfigPath(appName));
}

export function readAllAppConfigs() {
  return listAppNames()
    .map((appName) => ({ appName, appDir: getAppDir(appName), configPath: getAppConfigPath(appName) }))
    .filter((entry) => existsSync(entry.configPath))
    .map((entry) => ({ ...entry, config: readJson(entry.configPath) }));
}
