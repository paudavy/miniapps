import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, readFileSync, copyFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let tempDir;
let originalCwd;

before(function() {
  originalCwd = process.cwd();
  tempDir = mkdtempSync(join(tmpdir(), 'test-validate-'));
  mkdirSync(join(tempDir, 'apps'));
  mkdirSync(join(tempDir, 'scripts', 'lib'), { recursive: true });
  copyFileSync(join(originalCwd, 'scripts', 'lib', 'miniapps.mjs'), join(tempDir, 'scripts', 'lib', 'miniapps.mjs'));
  copyFileSync(join(originalCwd, 'scripts', 'validate-miniapps.mjs'), join(tempDir, 'scripts', 'validate-miniapps.mjs'));
  process.chdir(tempDir);
});

after(() => {
  process.chdir(originalCwd);
  rmSync(tempDir, { recursive: true, force: true });
});

beforeEach(() => {
  const appsDir = join(tempDir, 'apps');
  if (existsSync(appsDir)) {
    for (const name of readdirSync(appsDir)) {
      rmSync(join(appsDir, name), { recursive: true, force: true });
    }
  }
});

function runValidate() {
  try {
    const result = execSync('node scripts/validate-miniapps.mjs', { cwd: tempDir, stdio: 'pipe' });
    return { exitCode: 0, output: result.toString('utf8') };
  } catch (err) {
    return { exitCode: err.status || 1, output: (err.message || err.stdout?.toString() || '') };
  }
}

function createMinimalApp(name, overrides = {}) {
  const appDir = join(tempDir, 'apps', name);
  mkdirSync(join(appDir, 'src', 'app'), { recursive: true });
  mkdirSync(join(appDir, 'src', 'components'), { recursive: true });
  mkdirSync(join(appDir, 'src', 'styles'), { recursive: true });
  mkdirSync(join(appDir, 'public'), { recursive: true });

  const config = {
    name,
    title: name,
    description: `${name} description`,
    listed: true,
    pwa: true,
    router: false,
    themeColor: '#2563eb',
    backgroundColor: '#ffffff',
    icon: 'default',
    tags: [],
    category: 'utilities',
    ...overrides
  };
  writeFileSync(join(appDir, 'app.config.json'), JSON.stringify(config), 'utf8');
  writeFileSync(join(appDir, 'package.json'), JSON.stringify({
    name: `@miniapps/${name}`,
    private: true,
    version: '0.1.0',
    type: 'module'
  }), 'utf8');
  writeFileSync(join(appDir, 'index.html'), '<!doctype html><html><head></head><body><div id="app"></div></body></html>', 'utf8');
  writeFileSync(join(appDir, 'vite.config.ts'), 'export default {}', 'utf8');
  writeFileSync(join(appDir, 'src', 'main.tsx'), 'import {}', 'utf8');
  writeFileSync(join(appDir, 'src', 'app', 'App.tsx'), 'export const App = () => null;', 'utf8');
  writeFileSync(join(appDir, 'public', 'pwa-192.png'), 'fake', 'utf8');
  writeFileSync(join(appDir, 'public', 'pwa-512.png'), 'fake', 'utf8');
}

test('detecta slug inválido', () => {
  createMinimalApp('testapp', { name: 'foo_Bar' });
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('Slug inválido'));
});

test('detecta directorio no coincide con nombre', () => {
  createMinimalApp('testapp', { name: 'different-name' });
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('no coincide'));
});

test('detecta reserved name', () => {
  createMinimalApp('config');
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('reservado'));
});

test('detecta slug duplicado', () => {
  createMinimalApp('myapp');
  createMinimalApp('other', { name: 'myapp' });
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('duplicado'));
});

test('detecta archivo requerido faltante', () => {
  createMinimalApp('testapp');
  rmSync(join(tempDir, 'apps', 'testapp', 'package.json'));
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.exitCode !== 0, 'debería fallar');
});

test('detecta router sin 404.html', () => {
  createMinimalApp('testapp', { router: true });
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('router pero no tiene'));
});

test('detecta no-router con 404.html sobrante', () => {
  createMinimalApp('testapp', { router: false });
  writeFileSync(join(tempDir, 'apps', 'testapp', 'public', '404.html'), '<!doctype html>', 'utf8');
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('no usa router y no debería'));
});

test('detecta package.json.name no coincide', () => {
  createMinimalApp('testapp');
  const pkgPath = join(tempDir, 'apps', 'testapp', 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.name = '@other/wrong';
  writeFileSync(pkgPath, JSON.stringify(pkg), 'utf8');
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('Inconsistencia'));
});

test('no-router con inline redirect script', () => {
  createMinimalApp('testapp', { router: false });
  const htmlPath = join(tempDir, 'apps', 'testapp', 'index.html');
  const html = `<!doctype html><html><head></head><body><div id="app"></div><script>qs.get("redirect")</script></body></html>`;
  writeFileSync(htmlPath, html, 'utf8');
  const result = runValidate();
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('no debería incluir'));
});

test('app válida pasa sin errores', () => {
  createMinimalApp('testapp');
  const result = runValidate();
  assert.strictEqual(result.exitCode, 0);
  assert.ok(result.output.includes('Validación correcta'));
});

test('app no PWA válida no requiere iconos', () => {
  createMinimalApp('plain-app', {
    pwa: false,
    category: undefined,
    tags: undefined,
    icon: undefined
  });

  const appDir = join(tempDir, 'apps', 'plain-app');
  const configPath = join(appDir, 'app.config.json');
  writeFileSync(configPath, JSON.stringify({
    name: 'plain-app',
    title: 'plain-app',
    description: 'plain-app description',
    listed: true,
    pwa: false,
    router: false,
    themeColor: '#2563eb',
    backgroundColor: '#ffffff'
  }), 'utf8');
  rmSync(join(appDir, 'public', 'pwa-192.png'));
  rmSync(join(appDir, 'public', 'pwa-512.png'));

  const result = runValidate();
  assert.strictEqual(result.exitCode, 0, result.output);
});
