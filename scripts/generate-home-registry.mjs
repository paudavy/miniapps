import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { HOME_REGISTRY_PATH, readAllAppConfigs } from './lib/miniapps.mjs';

function getRepoBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || process.env.VITE_REPO_NAME || '';
  return repo ? `/${repo}` : '.';
}

const base = getRepoBase();

const entries = readAllAppConfigs()
  .map(({ config }) => config)
  .filter((app) => app.name !== 'home' && app.listed)
  .sort((a, b) => a.title.localeCompare(b.title))
  .map((app) => ({
    name: app.name,
    title: app.title,
    description: app.description,
    href: `${base}/${app.name}/`,
    category: app.category || 'general',
    tags: app.tags || []
  }));

mkdirSync(dirname(HOME_REGISTRY_PATH), { recursive: true });
writeFileSync(HOME_REGISTRY_PATH, `export const appsRegistry = ${JSON.stringify(entries, null, 2)} as const;\n`, 'utf8');
console.log(`Generated ${HOME_REGISTRY_PATH}`);
