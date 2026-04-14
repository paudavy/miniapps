import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/preact';
import { Toolbar } from './Toolbar';
import { activeProfileId } from '../state/signals';

vi.mock('./ProfileCreateForm', () => ({ ProfileCreateForm: () => <div>profile-form</div> }));
vi.mock('./ViewToggle', () => ({ ViewToggle: () => <div>view-toggle</div> }));
vi.mock('./ExportButton', () => ({ ExportButton: () => <div>export-button</div> }));
vi.mock('./ZoomControl', () => ({ ZoomControl: () => <div>zoom-control</div> }));
vi.mock('../state/actions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../state/actions')>();
  return {
    ...actual,
    createAssignment: vi.fn(),
  };
});

describe('Toolbar', () => {
  beforeEach(() => {
    activeProfileId.value = null;
  });

  it('shows hint and disables add assignment when no profile is active', () => {
    const { getByText, getByRole } = render(<Toolbar />);

    expect(getByText('Select a profile row to add an assignment')).toBeTruthy();
    expect((getByRole('button', { name: 'Add assignment' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('hides hint when an active profile is selected', () => {
    activeProfileId.value = 'p1';

    const { queryByText, getByRole } = render(<Toolbar />);

    expect(queryByText('Select a profile row to add an assignment')).toBeNull();
    expect((getByRole('button', { name: 'Add assignment' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('renders grouped toolbar structure with separators and right-aligned export', () => {
    const { container, getByRole } = render(<Toolbar />);

    expect(container.querySelectorAll('.toolbar__group').length).toBeGreaterThanOrEqual(4);
    expect(container.querySelectorAll('.toolbar__sep').length).toBeGreaterThanOrEqual(3);
    expect(getByRole('button', { name: 'Add assignment' }).className).toContain('toolbar__btn--primary');
    expect(container.querySelector('.toolbar__spacer')).toBeTruthy();
  });

  it('does not render stale summary text', () => {
    const { queryByText } = render(<Toolbar />);
    expect(queryByText(/DAY · 60 periods/)).toBeNull();
  });

  it('does not duplicate view controls', () => {
    const { getAllByText } = render(<Toolbar />);

    expect(getAllByText('view-toggle')).toHaveLength(1);
    expect(getAllByText('zoom-control')).toHaveLength(1);
  });

  it('does not render an empty summary group', () => {
    const { container } = render(<Toolbar />);

    expect(container.querySelector('.toolbar__group--summary')).toBeNull();
  });
});
