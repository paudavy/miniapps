import type { ComponentChildren } from 'preact';
import { InstallButton } from './InstallButton';

export function AppShell(props: { children: ComponentChildren }) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <div>
          <h1>Notes</h1>
          <p>Bloc de notas offline con persistencia local.</p>
        </div>
        <InstallButton />
      </header>
      <main>{props.children}</main>
    </div>
  );
}
