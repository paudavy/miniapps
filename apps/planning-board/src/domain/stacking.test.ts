import { describe, expect, it } from 'vitest';
import { computeAssignmentLanes, rowHeightForLaneCount } from './stacking';
import type { Assignment } from './types';

function assignment(id: string, startSlot: number, endSlot: number): Assignment {
  return {
    id,
    profileId: 'p1',
    task: id,
    startSlot,
    endSlot,
    dedicationPct: 100,
  };
}

describe('computeAssignmentLanes', () => {
  it('returns one lane for non-overlapping assignments', () => {
    const result = computeAssignmentLanes([
      assignment('a1', 0, 1),
      assignment('a2', 2, 3),
      assignment('a3', 4, 5),
    ]);

    expect(result.laneCount).toBe(1);
    expect(result.byId).toEqual({ a1: 0, a2: 0, a3: 0 });
  });

  it('places overlapping assignments on separate lanes', () => {
    const result = computeAssignmentLanes([
      assignment('a1', 0, 2),
      assignment('a2', 1, 3),
      assignment('a3', 2, 4),
    ]);

    expect(result.laneCount).toBe(3);
    expect(result.byId.a1).toBe(0);
    expect(result.byId.a2).toBe(1);
    expect(result.byId.a3).toBe(2);
  });

  it('keeps lane assignment stable for the same input', () => {
    const assignments = [
      assignment('a1', 0, 3),
      assignment('a2', 1, 2),
      assignment('a3', 4, 5),
    ];

    expect(computeAssignmentLanes(assignments)).toEqual(computeAssignmentLanes(assignments));
  });
});

describe('rowHeightForLaneCount', () => {
  it('keeps the base row height for a single lane', () => {
    expect(rowHeightForLaneCount(1)).toBe(48);
  });

  it('grows the row height when extra lanes are required', () => {
    expect(rowHeightForLaneCount(2)).toBeGreaterThan(48);
    expect(rowHeightForLaneCount(3)).toBeGreaterThan(rowHeightForLaneCount(2));
  });
});
