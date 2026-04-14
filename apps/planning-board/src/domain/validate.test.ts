import { describe, it, expect } from 'vitest';
import { validateProfile, validateAssignment } from './validate';

describe('validateProfile', () => {
  it('accepts valid profile', () => {
    expect(validateProfile('Alice', 'Dev', 100)).toEqual({ valid: true });
  });

  it('rejects empty name', () => {
    expect(validateProfile('')).toEqual({ valid: false, error: 'Name is required' });
    expect(validateProfile('   ')).toEqual({ valid: false, error: 'Name is required' });
  });

  it('rejects name over 60 chars', () => {
    expect(validateProfile('a'.repeat(61))).toEqual({
      valid: false,
      error: 'Name too long (max 60 chars)',
    });
  });

  it('rejects category over 30 chars', () => {
    expect(validateProfile('Alice', 'a'.repeat(31))).toEqual({
      valid: false,
      error: 'Category too long (max 30 chars)',
    });
  });

  it('rejects capacityPct out of range', () => {
    expect(validateProfile('Alice', 'Dev', 0)).toEqual({
      valid: false,
      error: 'Capacity must be 1-100',
    });
    expect(validateProfile('Alice', 'Dev', 101)).toEqual({
      valid: false,
      error: 'Capacity must be 1-100',
    });
  });

  it('trims name before validation', () => {
    expect(validateProfile('  Alice  ')).toEqual({ valid: true });
  });
});

describe('validateAssignment', () => {
  it('accepts valid assignment', () => {
    expect(validateAssignment('Task', 0, 2, 100)).toEqual({ valid: true });
  });

  it('rejects empty task', () => {
    expect(validateAssignment('', 0, 0, 100)).toEqual({ valid: false, error: 'Task name is required' });
    expect(validateAssignment('   ', 0, 0, 100)).toEqual({ valid: false, error: 'Task name is required' });
  });

  it('rejects task over 40 chars', () => {
    expect(validateAssignment('a'.repeat(41), 0, 0, 100)).toEqual({
      valid: false,
      error: 'Task name too long (max 40 chars)',
    });
  });

  it('rejects negative startSlot', () => {
    expect(validateAssignment('Task', -1, 0, 100)).toEqual({
      valid: false,
      error: 'Start slot must be >= 0',
    });
  });

  it('rejects endSlot before startSlot', () => {
    expect(validateAssignment('Task', 5, 3, 100)).toEqual({
      valid: false,
      error: 'End slot must be >= start slot',
    });
  });

  it('accepts endSlot equal to startSlot (1 slot wide)', () => {
    expect(validateAssignment('Task', 3, 3, 100)).toEqual({ valid: true });
  });

  it('rejects dedicationPct out of range', () => {
    expect(validateAssignment('Task', 0, 0, 5)).toEqual({
      valid: false,
      error: 'Dedication must be 10-100',
    });
    expect(validateAssignment('Task', 0, 0, 101)).toEqual({
      valid: false,
      error: 'Dedication must be 10-100',
    });
  });
});
