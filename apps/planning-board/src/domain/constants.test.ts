import { describe, expect, it } from 'vitest';
import { BOARD_DEFAULTS, VALIDATION_LIMITS } from './constants';

describe('domain constants', () => {
  it('exports shared validation limits', () => {
    expect(VALIDATION_LIMITS.PROFILE_NAME_MAX).toBe(60);
    expect(VALIDATION_LIMITS.PROFILE_CATEGORY_MAX).toBe(30);
    expect(VALIDATION_LIMITS.ASSIGNMENT_TASK_MAX).toBe(40);
    expect(VALIDATION_LIMITS.ASSIGNMENT_DEDICATION_MIN).toBe(10);
    expect(VALIDATION_LIMITS.ASSIGNMENT_DEDICATION_MAX).toBe(100);
  });

  it('exports shared board defaults and bounds', () => {
    expect(BOARD_DEFAULTS.SLOT_WIDTH_DEFAULT).toBe(48);
    expect(BOARD_DEFAULTS.SLOT_COUNT_DEFAULT).toBe(60);
    expect(BOARD_DEFAULTS.SLOT_WIDTH_MIN).toBe(30);
    expect(BOARD_DEFAULTS.SLOT_WIDTH_MAX).toBe(110);
    expect(BOARD_DEFAULTS.SLOT_COUNT_MIN).toBe(5);
    expect(BOARD_DEFAULTS.SLOT_COUNT_MAX).toBe(120);
  });
});
