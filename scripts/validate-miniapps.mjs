import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  REQUIRED_APP_FILES,
  RESERVED_APP_NAMES,
  isValidSlug,
  readAllAppConfigs,
  readJson
} from './lib/miniapps.mjs';

const errors = [];
const seen = new Set();

for (const { appName, appDir, configPath, config } of readAllAppConfigs()) {
  if (!isValidSlug(config.name)) {
    errors.push(`Slug inválido en ${configPath}`);
  }

  if (config.name !== appName) {
    errors.push(`El directorio ${appName} no coincide con el nombre configurado ${config.name}`);
  }

  if (RESERVED_APP_NAMES.has(config.name) && config.name !== 'home') {
    errors.push(`Slug reservado en ${configPath}`);
  }

  if (seen.has(config.name)) {
    errors.push(`Slug duplicado: ${config.name}`);
  }
  seen.add(config.name);

  for (const relativeFile of REQUIRED_APP_FILES) {
    const filePath = join(appDir, relativeFile);
    if (!existsSync(filePath)) {
      errors.push(`Falta ${filePath}`);
    }
  }

  if (config.router && !existsSync(join(appDir, 'public/404.html'))) {
    errors.push(`La app ${config.name} usa router pero no tiene public/404.html`);
  }

  if (!config.router && existsSync(join(appDir, 'public/404.html'))) {
    errors.push(`La app ${config.name} no usa router y no debería tener public/404.html`);
  }

  const pkg = readJson(join(appDir, 'package.json'));
  if (pkg.name !== `@miniapps/${config.name}`) {
    errors.push(`Inconsistencia entre package.json y app.config.json en ${config.name}`);
  }

  const indexHtml = readFileSync(join(appDir, 'index.html'), 'utf8');
  if (!config.router && indexHtml.includes("qs.get('redirect')")) {
    errors.push(`La app ${config.name} no usa router y no debería incluir restauración de redirect en index.html`);
  }
}

if (errors.length > 0) {
  console.error('Errores de validación:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Validación correcta.');
