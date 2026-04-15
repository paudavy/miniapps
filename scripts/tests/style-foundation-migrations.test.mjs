import assert from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

function readAppStyles(appName) {
  return readFileSync(join('apps', appName, 'src', 'styles', 'index.css'), 'utf8');
}

function readPlanningBoardTokens() {
  return readFileSync(join('apps', 'planning-board', 'src', 'styles', 'tokens.css'), 'utf8');
}

function readPlanningBoardCss(fileName) {
  return readFileSync(join('apps', 'planning-board', 'src', 'features', 'board', 'ui', fileName), 'utf8');
}

function listPlanningBoardUiCssFiles() {
  const uiDir = join('apps', 'planning-board', 'src', 'features', 'board', 'ui');
  return readdirSync(uiDir).filter((fileName) => fileName.endsWith('.css'));
}

test('focus-timer style entrypoint follows scaffold foundation contract', () => {
  const styles = readAppStyles('focus-timer');

  assert.match(styles, /@import\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/styles\/base\.css['"];?/i);
  assert.match(styles, /--app-accent:\s*#dc2626/i);
  assert.match(styles, /--color-bg-page:/);
  assert.match(styles, /--color-bg-surface:/);
  assert.match(styles, /--color-text-primary:/);
  assert.match(styles, /--color-border-subtle:/);
  assert.match(styles, /--color-accent-primary:\s*var\(--app-accent\)/);
});

test('notes style entrypoint follows scaffold foundation contract', () => {
  const styles = readAppStyles('notes');

  assert.match(styles, /@import\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/styles\/base\.css['"];?/i);
  assert.match(styles, /--app-accent:\s*#2563eb/i);
  assert.match(styles, /--color-bg-page:/);
  assert.match(styles, /--color-bg-surface:/);
  assert.match(styles, /--color-text-primary:/);
  assert.match(styles, /--color-border-subtle:/);
  assert.match(styles, /--color-accent-primary:\s*var\(--app-accent\)/);
});

test('planning-board tokens.css no longer provides compatibility aliases', () => {
  const tokens = readPlanningBoardTokens();

  assert.doesNotMatch(tokens, /--color-/);
  assert.doesNotMatch(tokens, /--spacing-/);
  assert.doesNotMatch(tokens, /--font-/);
  assert.doesNotMatch(tokens, /--radius-/);
  assert.doesNotMatch(tokens, /--transition-/);
});

test('planning-board ui stylesheets use board-* tokens only', () => {
  const uiCssFiles = listPlanningBoardUiCssFiles();
  const aliasTokenPattern = /--(?:color|spacing|font|radius|transition)-/;

  for (const fileName of uiCssFiles) {
    const css = readPlanningBoardCss(fileName);

    assert.doesNotMatch(css, aliasTokenPattern, `${fileName} should not reference legacy alias tokens`);
  }
});
