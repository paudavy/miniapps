import type { ComponentChildren } from 'preact';
import { InstallButton } from './InstallButton';

export function AppShell(props: { children: ComponentChildren }) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <div>
          <h1>Focus Timer</h1>
          <p>Temporizador pomodoro simple offline.</p>
        </div>
        <InstallButton />
      </header>
      <main>{props.children}</main>
    </div>
  );
}
