import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, beforeEach, test } from 'node:test';

let tempDir;
let originalCwd;

before(() => {
  originalCwd = process.cwd();
  tempDir = mkdtempSync(join(tmpdir(), 'test-create-miniapp-'));
  mkdirSync(join(tempDir, 'apps'));
  mkdirSync(join(tempDir, 'styles'));
  mkdirSync(join(tempDir, 'tooling', 'create-miniapp', 'src'), { recursive: true });
  mkdirSync(join(tempDir, 'tooling', 'create-miniapp', 'static'), { recursive: true });
  mkdirSync(join(tempDir, 'scripts', 'lib'), { recursive: true });

  copyFileSync(join(originalCwd, 'styles', 'base.css'), join(tempDir, 'styles', 'base.css'));
  copyFileSync(join(originalCwd, 'tooling', 'create-miniapp', 'src', 'cli.js'), join(tempDir, 'tooling', 'create-miniapp', 'src', 'cli.js'));
  copyFileSync(join(originalCwd, 'tooling', 'create-miniapp', 'static', 'pwa-192.png'), join(tempDir, 'tooling', 'create-miniapp', 'static', 'pwa-192.png'));
  copyFileSync(join(originalCwd, 'tooling', 'create-miniapp', 'static', 'pwa-512.png'), join(tempDir, 'tooling', 'create-miniapp', 'static', 'pwa-512.png'));
  copyFileSync(join(originalCwd, 'scripts', 'lib', 'miniapps.mjs'), join(tempDir, 'scripts', 'lib', 'miniapps.mjs'));
  copyFileSync(join(originalCwd, 'scripts', 'generate-home-registry.mjs'), join(tempDir, 'scripts', 'generate-home-registry.mjs'));
  copyFileSync(join(originalCwd, 'scripts', 'validate-miniapps.mjs'), join(tempDir, 'scripts', 'validate-miniapps.mjs'));
  process.chdir(tempDir);
});

after(() => {
  process.chdir(originalCwd);
  rmSync(tempDir, { recursive: true, force: true });
});

beforeEach(() => {
  for (const entry of readdirSync(join(tempDir, 'apps'))) {
    rmSync(join(tempDir, 'apps', entry), { recursive: true, force: true });
  }
  delete process.env.VITE_REPO_NAME;
});

function runCli(args) {
  try {
    const output = execFileSync('node', ['tooling/create-miniapp/src/cli.js', ...args], {
      cwd: tempDir,
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return { exitCode: 0, output };
  } catch (error) {
    return {
      exitCode: error.status || 1,
      output: `${error.stdout || ''}${error.stderr || ''}`
    };
  }
}

function createInvalidApp(name) {
  const appDir = join(tempDir, 'apps', name);
  mkdirSync(appDir, { recursive: true });
  writeFileSync(join(appDir, 'app.config.json'), JSON.stringify({ name, title: name, description: 'broken', listed: true }), 'utf8');
}

function transpileGeneratedRegisterSW(source) {
  return source
    .replace(/interface BeforeInstallPromptEvent[\s\S]*?}\n\n/, '')
    .replace(/interface InstallState[\s\S]*?}\n\n/, '')
    .replace('let installPrompt: BeforeInstallPromptEvent | null = null;', 'let installPrompt = null;')
    .replace('const listeners = new Set<() => void>();', 'const listeners = new Set();')
    .replace('export function registerSW(): void {', 'function registerSW() {')
    .replace('window.addEventListener(\'beforeinstallprompt\', (event: Event) => {', 'window.addEventListener(\'beforeinstallprompt\', (event) => {')
    .replaceAll(' as BeforeInstallPromptEvent', '')
    .replace('export function getInstallState(): InstallState {', 'function getInstallState() {')
    .replace('export function subscribeInstallState(listener: () => void): () => void {', 'function subscribeInstallState(listener) {')
    .replace('export function triggerInstall(): void {', 'function triggerInstall() {');
}

function createGeneratedRegisterSWRuntime(source) {
  const listeners = new Map();
  const registrations = [];
  const window = {
    addEventListener(type, listener) {
      const current = listeners.get(type) || [];
      current.push(listener);
      listeners.set(type, current);
    }
  };
  const navigator = {
    serviceWorker: {
      register(path) {
        registrations.push(path);
        return Promise.resolve();
      }
    }
  };
  const runtime = new Function(
    'window',
    'navigator',
    'console',
    `${transpileGeneratedRegisterSW(source)}\nreturn { registerSW, getInstallState, subscribeInstallState, triggerInstall };`,
  )(window, navigator, console);

  return {
    ...runtime,
    registrations,
    dispatch(type, event = {}) {
      for (const listener of listeners.get(type) || []) {
        listener(event);
      }
    }
  };
}

test('rejects reserved slug from shared repo contract', () => {
  const result = runCli(['docs']);
  assert.notStrictEqual(result.exitCode, 0);
  assert.match(result.output, /Slug reservado/);
  assert.ok(!existsSync(join(tempDir, 'apps', 'docs')));
});

test('scaffolds non-PWA app without unnecessary PWA footprint', () => {
  const result = runCli(['plain-notes', '--no-pwa']);
  assert.strictEqual(result.exitCode, 0, result.output);

  const appDir = join(tempDir, 'apps', 'plain-notes');
  const appConfig = JSON.parse(readFileSync(join(appDir, 'app.config.json'), 'utf8'));
  const packageJson = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'));
  const viteConfig = readFileSync(join(appDir, 'vite.config.ts'), 'utf8');
  const appTsx = readFileSync(join(appDir, 'src', 'app', 'App.tsx'), 'utf8');
  const appShellTsx = readFileSync(join(appDir, 'src', 'components', 'AppShell.tsx'), 'utf8');

  assert.strictEqual(appConfig.pwa, false);
  assert.ok(!('category' in appConfig));
  assert.ok(!('tags' in appConfig));
  assert.ok(!('icon' in appConfig));
  assert.ok(!existsSync(join(appDir, 'public', 'pwa-192.png')));
  assert.ok(!existsSync(join(appDir, 'public', 'pwa-512.png')));
  assert.ok(!('vite-plugin-pwa' in packageJson.devDependencies));
  assert.ok(!viteConfig.includes('VitePWA'));
  assert.ok(!existsSync(join(appDir, 'src', 'app', 'registerSW.ts')));
  assert.ok(!existsSync(join(appDir, 'src', 'components', 'InstallButton.tsx')));
  assert.ok(!appTsx.includes('registerSW'));
  assert.ok(!appTsx.includes('useEffect'));
  assert.ok(!appShellTsx.includes('InstallButton'));
});

test('scaffolds PWA app with plugin, icons, and manifest config', () => {
  const result = runCli(['default-pwa']);
  assert.strictEqual(result.exitCode, 0, result.output);

  const appDir = join(tempDir, 'apps', 'default-pwa');
  const appConfig = JSON.parse(readFileSync(join(appDir, 'app.config.json'), 'utf8'));
  const packageJson = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'));
  const viteConfig = readFileSync(join(appDir, 'vite.config.ts'), 'utf8');
  const indexHtml = readFileSync(join(appDir, 'index.html'), 'utf8');
  const styles = readFileSync(join(appDir, 'src', 'styles', 'index.css'), 'utf8');
  const sharedBaseStyles = readFileSync(join(tempDir, 'styles', 'base.css'), 'utf8');
  const appTsx = readFileSync(join(appDir, 'src', 'app', 'App.tsx'), 'utf8');
  const appShellTsx = readFileSync(join(appDir, 'src', 'components', 'AppShell.tsx'), 'utf8');
  const registerSW = readFileSync(join(appDir, 'src', 'app', 'registerSW.ts'), 'utf8');
  const installButton = readFileSync(join(appDir, 'src', 'components', 'InstallButton.tsx'), 'utf8');

  assert.strictEqual(appConfig.pwa, true);
  assert.strictEqual(appConfig.themeColor, '#004F87');
  assert.strictEqual(appConfig.backgroundColor, '#FFFFFF');
  assert.ok(existsSync(join(appDir, 'public', 'pwa-192.png')));
  assert.ok(existsSync(join(appDir, 'public', 'pwa-512.png')));
  assert.strictEqual(packageJson.devDependencies['vite-plugin-pwa'], '^1.0.0');
  assert.ok(viteConfig.includes('import { VitePWA } from \'vite-plugin-pwa\';'));
  assert.ok(viteConfig.includes('manifest: {'));
  assert.ok(indexHtml.includes('<meta name="theme-color" content="#004F87" />'));
  assert.ok(styles.includes('@import "../../../../styles/base.css";'));
  assert.ok(styles.includes('/* Shared base identity (imported) */'));
  assert.ok(styles.includes('/* App semantic tokens (local mapping) */'));
  assert.ok(styles.includes('/* App accent token (customizable) */'));
  assert.match(styles, /--color-bg-page:/);
  assert.match(styles, /--color-bg-surface:/);
  assert.match(styles, /--color-text-primary:/);
  assert.match(styles, /--color-border-subtle:/);
  assert.match(styles, /--color-accent-primary:/);
  assert.match(sharedBaseStyles, /body\s*\{[^}]*background:\s*var\(--color-bg-page\)/s);
  assert.match(sharedBaseStyles, /\.card\s*\{[^}]*background:\s*var\(--color-bg-surface\)/s);
  assert.match(sharedBaseStyles, /button\.btn,[^]*background:\s*var\(--color-accent-primary\)/s);
  assert.ok(appTsx.includes("import { useEffect } from 'preact/hooks';"));
  assert.ok(appTsx.includes("import { registerSW } from './registerSW';"));
  assert.ok(appTsx.includes('useEffect(() => {'));
  assert.ok(appTsx.includes('registerSW();'));
  assert.ok(appShellTsx.includes("import { InstallButton } from './InstallButton';"));
  assert.ok(appShellTsx.includes('<InstallButton />'));
  assert.ok(registerSW.includes('beforeinstallprompt'));
  assert.ok(registerSW.includes('appinstalled'));
  assert.ok(registerSW.includes('export function registerSW(): void'));
  assert.ok(installButton.includes('export function InstallButton()'));
  assert.ok(installButton.includes('triggerInstall'));
});

test('generated PWA install state starts unavailable and becomes available after beforeinstallprompt', () => {
  const result = runCli(['default-pwa']);
  assert.strictEqual(result.exitCode, 0, result.output);

  const appDir = join(tempDir, 'apps', 'default-pwa');
  const registerSW = readFileSync(join(appDir, 'src', 'app', 'registerSW.ts'), 'utf8');
  const installButton = readFileSync(join(appDir, 'src', 'components', 'InstallButton.tsx'), 'utf8');
  const runtime = createGeneratedRegisterSWRuntime(registerSW);
  let notifications = 0;

  runtime.registerSW();
  const unsubscribe = runtime.subscribeInstallState(() => {
    notifications += 1;
  });

  assert.deepStrictEqual(runtime.getInstallState(), { canInstall: false, isInstalled: false });
  assert.ok(installButton.includes('if (!installState.canInstall || installState.isInstalled) return null;'));

  const promptEvent = {
    prevented: false,
    preventDefault() {
      this.prevented = true;
    },
    prompt() {
      return Promise.resolve();
    },
    userChoice: Promise.resolve({ outcome: 'accepted' })
  };

  runtime.dispatch('beforeinstallprompt', promptEvent);

  assert.strictEqual(promptEvent.prevented, true);
  assert.deepStrictEqual(runtime.getInstallState(), { canInstall: true, isInstalled: false });
  assert.strictEqual(notifications, 1);

  unsubscribe();
});

test('generated PWA install state hides install after appinstalled and registers the service worker on load', async () => {
  const result = runCli(['default-pwa']);
  assert.strictEqual(result.exitCode, 0, result.output);

  const appDir = join(tempDir, 'apps', 'default-pwa');
  const registerSW = readFileSync(join(appDir, 'src', 'app', 'registerSW.ts'), 'utf8');
  const installButton = readFileSync(join(appDir, 'src', 'components', 'InstallButton.tsx'), 'utf8');
  const runtime = createGeneratedRegisterSWRuntime(registerSW);
  let promptCalls = 0;
  let resolveUserChoice;

  runtime.registerSW();
  runtime.dispatch('beforeinstallprompt', {
    preventDefault() {},
    prompt() {
      promptCalls += 1;
      return Promise.resolve();
    },
    userChoice: new Promise((resolve) => {
      resolveUserChoice = resolve;
    })
  });

  runtime.triggerInstall();
  assert.strictEqual(promptCalls, 1);

  resolveUserChoice({ outcome: 'accepted' });
  await Promise.resolve();

  assert.deepStrictEqual(runtime.getInstallState(), { canInstall: false, isInstalled: false });

  runtime.dispatch('beforeinstallprompt', {
    preventDefault() {},
    prompt() {
      return Promise.resolve();
    },
    userChoice: Promise.resolve({ outcome: 'accepted' })
  });
  runtime.dispatch('appinstalled');

  assert.deepStrictEqual(runtime.getInstallState(), { canInstall: false, isInstalled: true });
  assert.ok(installButton.includes('if (!installState.canInstall || installState.isInstalled) return null;'));

  runtime.dispatch('load');
  await Promise.resolve();

  assert.deepStrictEqual(runtime.registrations, ['/sw.js']);
});

test('scaffolds app with custom theme override while keeping shared base import', () => {
  const result = runCli(['custom-theme', '--theme', '#D10053']);
  assert.strictEqual(result.exitCode, 0, result.output);

  const appDir = join(tempDir, 'apps', 'custom-theme');
  const appConfig = JSON.parse(readFileSync(join(appDir, 'app.config.json'), 'utf8'));
  const indexHtml = readFileSync(join(appDir, 'index.html'), 'utf8');
  const styles = readFileSync(join(appDir, 'src', 'styles', 'index.css'), 'utf8');

  assert.strictEqual(appConfig.themeColor, '#D10053');
  assert.ok(indexHtml.includes('<meta name="theme-color" content="#D10053" />'));
  assert.ok(styles.includes('@import "../../../../styles/base.css";'));
  assert.ok(styles.includes('/* Shared base identity (imported) */'));
  assert.ok(styles.includes('/* App semantic tokens (local mapping) */'));
  assert.ok(styles.includes('/* App accent token (customizable) */'));
  assert.match(styles, /--app-accent:\s*#D10053/);
  assert.match(styles, /--color-accent-primary:\s*var\(--app-accent\)/);
});

test('scaffolds router app with GitHub Pages redirect artifact', () => {
  const result = runCli(['routed-app', '--router']);
  assert.strictEqual(result.exitCode, 0, result.output);

  const appDir = join(tempDir, 'apps', 'routed-app');
  const appConfig = JSON.parse(readFileSync(join(appDir, 'app.config.json'), 'utf8'));
  const indexHtml = readFileSync(join(appDir, 'index.html'), 'utf8');
  const redirectHtml = readFileSync(join(appDir, 'public', '404.html'), 'utf8');

  assert.strictEqual(appConfig.router, true);
  assert.ok(indexHtml.includes("qs.get('redirect')") || indexHtml.includes('qs.get("redirect")'));
  assert.ok(redirectHtml.includes("const slug = 'routed-app';"));
});

test('preserves generated app when unrelated repo validation fails', () => {
  createInvalidApp('broken-existing-app');

  const result = runCli(['new-app']);
  assert.notStrictEqual(result.exitCode, 0);
  assert.ok(existsSync(join(tempDir, 'apps', 'new-app')));
  assert.match(result.output, /post-generación|post-generacion|repo/i);
});
