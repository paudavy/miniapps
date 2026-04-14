import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { assignments, hoveredBarState, profiles, contextMenuTarget, editingAssignmentId } from '../state/signals';
import './HoverPopover.css';

export function HoverPopover(): h.JSX.Element | null {
  const state = hoveredBarState.value;
  const ref = useRef<HTMLDivElement>(null);
  if (!state) return null;
  if (contextMenuTarget.value || editingAssignmentId.value !== null) return null;

  const assignment = assignments.value.find((item) => item.id === state.assignmentId);
  if (!assignment) return null;

  const profile = profiles.value.find((item) => item.id === assignment.profileId);

  useEffect(() => {
    if (!state.anchorEl || !ref.current) return;

    const updatePosition = async () => {
      if (!state.anchorEl || !ref.current) return;

      const { x, y } = await computePosition(state.anchorEl, ref.current, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [offset(10), flip(), shift({ padding: 8 })],
      });

      if (!ref.current) return;
      ref.current.style.left = `${x}px`;
      ref.current.style.top = `${y}px`;
    };

    void updatePosition();
    return autoUpdate(state.anchorEl, ref.current, updatePosition);
  }, [state]);

  return (
    <div
      ref={ref}
      className="hover-popover visible"
      style={{ left: '0px', top: '0px', zIndex: 50 }}
    >
      <div className="hover-popover__header">
        <span className="hover-popover__dot" style={{ background: profile?.color ?? 'var(--color-accent)' }} />
        <div className="hover-popover__title hover-popover__task">{assignment.task}</div>
      </div>
      <div className="hover-popover__row">
        <span className="hover-popover__lbl">Dedication</span>
        <span className="hover-popover__val">{assignment.dedicationPct}%</span>
      </div>
      <div className="hover-popover__row">
        <span className="hover-popover__lbl">Slots</span>
        <span className="hover-popover__val">{`${assignment.startSlot + 1}-${assignment.endSlot + 1}`}</span>
      </div>
      <div className="hover-popover__row">
        <span className="hover-popover__lbl">Profile</span>
        <span className="hover-popover__val">{profile?.name ?? 'Unknown profile'}</span>
      </div>
      <div className="hover-popover__track">
        <div className="hover-popover__fill" style={{ width: `${assignment.dedicationPct}%`, background: profile?.color ?? 'var(--color-accent)' }} />
      </div>
      <div className="hover-popover__hint">Hover details</div>
    </div>
  );
}
