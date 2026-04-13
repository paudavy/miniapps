import type { ComponentChildren } from 'preact';

export function AppShell(props: { children: ComponentChildren }) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <h1>Focus Timer</h1>
        <p>Temporizador pomodoro simple offline.</p>
      </header>
      <main>{props.children}</main>
    </div>
  );
}
