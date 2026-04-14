import type { ComponentChildren } from 'preact';

export function AppShell(props: { children: ComponentChildren }) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <h1>ResPlanner</h1>
        <p>Resource planning board</p>
      </header>
      <main>{props.children}</main>
    </div>
  );
}
