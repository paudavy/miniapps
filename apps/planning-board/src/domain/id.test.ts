import { afterEach, describe, it, expect, vi } from 'vitest';
import { generateId } from './id';

describe('generateId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('returns unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('uses crypto.randomUUID when available', () => {
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'uuid-from-crypto') });

    expect(generateId()).toBe('uuid-from-crypto');
  });

  it('falls back to a modern generated id when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', undefined);

    const id = generateId();

    expect(id).toMatch(/^[A-Za-z0-9_-]{10,}$/);
  });

  it('falls back when crypto.randomUUID throws', () => {
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => { throw new Error('no uuid'); }) });

    const id = generateId();

    expect(id).toMatch(/^[A-Za-z0-9_-]{10,}$/);
  });
});
