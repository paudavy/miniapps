import { describe, it, expect } from 'vitest';
import { detectOverloads } from './overload';
import type { Assignment } from './types';

function a(id: string, start: number, end: number, pct: number): Assignment {
  return { id, profileId: 'p1', task: 't', startSlot: start, endSlot: end, dedicationPct: pct };
}

describe('detectOverloads', () => {
  it('returns empty when no assignments', () => {
    expect(detectOverloads('p1', [], 60)).toEqual([]);
  });

  it('returns empty when total dedication <= 100', () => {
    const assignments = [a('a1', 2, 4, 50), a('a2', 3, 5, 40)];
    expect(detectOverloads('p1', assignments, 60)).toEqual([]);
  });

  it('detects single overloaded slot', () => {
    const assignments = [a('a1', 2, 4, 60), a('a2', 3, 5, 50)];
    const result = detectOverloads('p1', assignments, 60);
    expect(result).toHaveLength(2);
    expect(result[0].slotIndex).toBe(3);
    expect(result[0].totalPct).toBe(110);
    expect(result[1].slotIndex).toBe(4);
    expect(result[1].totalPct).toBe(110);
  });

  it('returns empty for non-overlapping assignments', () => {
    const assignments = [a('a1', 0, 2, 80), a('a2', 3, 5, 90)];
    expect(detectOverloads('p1', assignments, 60)).toEqual([]);
  });

  it('detects multiple overlapping assignments', () => {
    const assignments = [a('a1', 4, 6, 40), a('a2', 5, 7, 35), a('a3', 5, 5, 30)];
    const result = detectOverloads('p1', assignments, 60);
    expect(result).toHaveLength(1);
    expect(result[0].slotIndex).toBe(5);
    expect(result[0].totalPct).toBe(105);
    expect(result[0].assignmentIds).toContain('a1');
    expect(result[0].assignmentIds).toContain('a2');
    expect(result[0].assignmentIds).toContain('a3');
  });

  it('only considers assignments for the given profileId', () => {
    const assignments = [
      { ...a('a1', 0, 2, 80), profileId: 'p1' },
      { ...a('a2', 0, 2, 80), profileId: 'p2' },
    ];
    expect(detectOverloads('p1', assignments, 60)).toEqual([]);
    expect(detectOverloads('p2', assignments, 60)).toEqual([]);
  });

  it('respects slotCount boundary', () => {
    const assignments = [a('a1', 58, 59, 60), a('a2', 59, 60, 60)];
    const result = detectOverloads('p1', assignments, 60);
    expect(result).toHaveLength(1);
    expect(result[0].slotIndex).toBe(59);
  });
});
