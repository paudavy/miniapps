import { headerLabel } from './slots';
import type { Assignment, BoardStats, Profile, ViewMode } from './types';

export function computeStats(
  profiles: Profile[],
  assignments: Assignment[],
  slotCount: number,
  viewMode: ViewMode,
): BoardStats {
  const assignmentCount = assignments.length;
  const profileCount = profiles.length;
  const avgDedicationPct = assignmentCount === 0
    ? 0
    : Math.round(assignments.reduce((total, assignment) => total + assignment.dedicationPct, 0) / assignmentCount);

  const totalEffort = Number(assignments.reduce((total, assignment) => {
    const duration = assignment.endSlot - assignment.startSlot + 1;
    return total + (assignment.dedicationPct / 100) * duration;
  }, 0).toFixed(2));

  const slotActivity = new Map<number, number>();
  for (const assignment of assignments) {
    for (let slotIndex = assignment.startSlot; slotIndex <= assignment.endSlot && slotIndex < slotCount; slotIndex += 1) {
      slotActivity.set(slotIndex, (slotActivity.get(slotIndex) ?? 0) + 1);
    }
  }

  let peakSlotIndex: number | null = null;
  let peakCount = 0;
  for (const [slotIndex, count] of slotActivity) {
    if (count > peakCount) {
      peakSlotIndex = slotIndex;
      peakCount = count;
    }
  }

  return {
    profileCount,
    assignmentCount,
    avgDedicationPct,
    totalEffort,
    peakSlot: peakSlotIndex === null
      ? null
      : { label: headerLabel(peakSlotIndex, viewMode), count: peakCount },
  };
}
