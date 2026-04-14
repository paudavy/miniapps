import { describe, expect, it } from 'vitest';
import { PROFILE_COLOR_PALETTE, generateInitials, getProfileColor, hexToRgba } from './color';

describe('getProfileColor', () => {
  it('returns colors from the palette', () => {
    expect(getProfileColor(0)).toBe(PROFILE_COLOR_PALETTE[0]);
    expect(getProfileColor(1)).toBe(PROFILE_COLOR_PALETTE[1]);
  });

  it('wraps around the palette for larger indexes', () => {
    expect(getProfileColor(PROFILE_COLOR_PALETTE.length)).toBe(PROFILE_COLOR_PALETTE[0]);
  });
});

describe('generateInitials', () => {
  it('uses the first character of the first two words', () => {
    expect(generateInitials('Alice Baker')).toBe('AB');
  });

  it('uses up to two characters for a single word', () => {
    expect(generateInitials('Alice')).toBe('AL');
  });

  it('returns a fallback for empty names', () => {
    expect(generateInitials('   ')).toBe('??');
  });
});

describe('hexToRgba', () => {
  it('converts a hex color to rgba', () => {
    expect(hexToRgba('#4f9cf8', 0.5)).toBe('rgba(79, 156, 248, 0.5)');
  });
});
