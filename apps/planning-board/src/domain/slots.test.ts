import { describe, it, expect } from 'vitest';
import {
  slotToPx,
  pxToSlot,
  deltaPxToSlot,
  headerLabel,
  isMilestoneSlot,
  clampSlot,
  clampDedicationPct,
} from './slots';

describe('slotToPx', () => {
  it('converts slot 0 to 0px', () => {
    expect(slotToPx(0, 48)).toBe(0);
  });

  it('converts slot 1 to slotWidth', () => {
    expect(slotToPx(1, 48)).toBe(48);
  });

  it('converts slot 5 to 5 * slotWidth', () => {
    expect(slotToPx(5, 48)).toBe(240);
  });
});

describe('pxToSlot', () => {
  it('converts 0px to slot 0', () => {
    expect(pxToSlot(0, 48)).toBe(0);
  });

  it('rounds to nearest slot', () => {
    expect(pxToSlot(24, 48)).toBe(1);
    expect(pxToSlot(23, 48)).toBe(0);
  });

  it('clamps negative values to 0', () => {
    expect(pxToSlot(-10, 48)).toBe(0);
  });
});

describe('deltaPxToSlot', () => {
  it('preserves negative deltas when moving left', () => {
    expect(deltaPxToSlot(-48, 48)).toBe(-1);
    expect(deltaPxToSlot(-24, 48)).toBe(-1);
  });

  it('preserves positive deltas when moving right', () => {
    expect(deltaPxToSlot(48, 48)).toBe(1);
    expect(deltaPxToSlot(24, 48)).toBe(1);
  });

  it('returns 0 for no movement', () => {
    expect(deltaPxToSlot(0, 48)).toBe(0);
  });
});

describe('headerLabel', () => {
  it('returns D1 for slot 0 in days mode', () => {
    expect(headerLabel(0, 'days')).toBe('D1');
  });

  it('returns D60 for slot 59 in days mode', () => {
    expect(headerLabel(59, 'days')).toBe('D60');
  });

  it('returns W1 for slot 0 in weeks mode', () => {
    expect(headerLabel(0, 'weeks')).toBe('W1');
  });

  it('returns W60 for slot 59 in weeks mode', () => {
    expect(headerLabel(59, 'weeks')).toBe('W60');
  });
});

describe('isMilestoneSlot', () => {
  it('returns true for every fifth slot', () => {
    expect(isMilestoneSlot(4)).toBe(true);
    expect(isMilestoneSlot(9)).toBe(true);
    expect(isMilestoneSlot(14)).toBe(true);
  });

  it('returns false for non-milestone slots', () => {
    expect(isMilestoneSlot(0)).toBe(false);
    expect(isMilestoneSlot(3)).toBe(false);
    expect(isMilestoneSlot(10)).toBe(false);
  });
});

describe('clampSlot', () => {
  it('clamps value within range', () => {
    expect(clampSlot(5, 0, 10)).toBe(5);
  });

  it('clamps below min to min', () => {
    expect(clampSlot(-1, 0, 10)).toBe(0);
  });

  it('clamps above max to max', () => {
    expect(clampSlot(15, 0, 10)).toBe(10);
  });
});

describe('clampDedicationPct', () => {
  it('returns value unchanged if already valid step', () => {
    expect(clampDedicationPct(50)).toBe(50);
  });

  it('clamps below 10 to 10', () => {
    expect(clampDedicationPct(5)).toBe(10);
  });

  it('clamps above 100 to 100', () => {
    expect(clampDedicationPct(150)).toBe(100);
  });

  it('rounds to nearest 5', () => {
    expect(clampDedicationPct(52)).toBe(50);
    expect(clampDedicationPct(53)).toBe(55);
  });
});
