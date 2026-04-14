import type { ComponentChildren } from 'preact';

export function AppShell(props: { children: ComponentChildren }) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <h1>Habit Tracker</h1>
        <p>Seguimiento de hábitos</p>
      </header>
      <main>{props.children}</main>
    </div>
  );
}
