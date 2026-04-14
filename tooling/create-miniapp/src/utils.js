import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

export const RESERVED = new Set(['home', 'shared', 'config', 'tooling', 'scripts', 'docs']);

export function validateSlug(slug) {
  if (!slug) throw new Error('Debes indicar un slug. Uso: pnpm new:miniapp <slug>');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error(`Slug inválido: "${slug}". Usa kebab-case (solo minúsculas, números y guiones).`);
  if (RESERVED.has(slug))
    throw new Error(`Slug reservado: "${slug}". Elige otro nombre.`);
}

export function titleFromSlug(slug) {
  return slug.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join(' ');
}

/** Writes a file, creating parent directories as needed. */
export function write(absPath, content) {
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content, 'utf-8');
}

export function parseArgs(argv) {
  const args = {
    slug:       argv[2],
    title:      '',
    desc:       '',
    router:     false,
    pwa:        true,
    theme:      '#2563eb',
    background: '#ffffff',
    category:   'utilities',
    tags:       [],
    icon:       'default',
    listed:     true,
  };

  for (let i = 3; i < argv.length; i++) {
    const cur = argv[i];
    if      (cur === '--router')       args.router = true;
    else if (cur === '--no-pwa')       args.pwa = false;
    else if (cur === '--listed=false') args.listed = false;
    else if (cur === '--title')        args.title = argv[++i] || '';
    else if (cur === '--desc')         args.desc  = argv[++i] || '';
    else if (cur === '--theme')        args.theme = argv[++i] || '#2563eb';
    else if (cur === '--background')   args.background = argv[++i] || '#ffffff';
    else if (cur === '--category')     args.category = argv[++i] || 'utilities';
    else if (cur === '--tags')         args.tags = (argv[++i] || '').split(',').filter(Boolean);
    else if (cur === '--icon')         args.icon = argv[++i] || 'default';
    else console.warn(`Opción desconocida: ${cur}`);
  }

  return args;
}
