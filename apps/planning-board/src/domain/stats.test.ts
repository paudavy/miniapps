import { describe, expect, it } from 'vitest';
import { computeStats } from './stats';
import type { Assignment, Profile } from './types';

const profiles: Profile[] = [
  { id: 'p1', name: 'Alice', category: 'Dev', capacityPct: 100, color: '#4f9cf8', initials: 'AL' },
  { id: 'p2', name: 'Bob', category: 'QA', capacityPct: 100, color: '#34d399', initials: 'BO' },
];

const assignments: Assignment[] = [
  { id: 'a1', profileId: 'p1', task: 'Build', startSlot: 0, endSlot: 1, dedicationPct: 100 },
  { id: 'a2', profileId: 'p1', task: 'Review', startSlot: 1, endSlot: 2, dedicationPct: 50 },
  { id: 'a3', profileId: 'p2', task: 'Test', startSlot: 1, endSlot: 1, dedicationPct: 75 },
];

describe('computeStats', () => {
  it('returns zeroed stats for an empty board', () => {
    expect(computeStats([], [], 60, 'days')).toEqual({
      profileCount: 0,
      assignmentCount: 0,
      avgDedicationPct: 0,
      totalEffort: 0,
      peakSlot: null,
    });
  });

  it('computes aggregate counts and effort', () => {
    const result = computeStats(profiles, assignments, 60, 'days');

    expect(result.profileCount).toBe(2);
    expect(result.assignmentCount).toBe(3);
    expect(result.avgDedicationPct).toBe(75);
    expect(result.totalEffort).toBe(3.75);
  });

  it('reports the peak slot using the active slot label mode', () => {
    const result = computeStats(profiles, assignments, 60, 'weeks');

    expect(result.peakSlot).toEqual({ label: 'W2', count: 3 });
  });
});
