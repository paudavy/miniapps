import type { ComponentChildren } from 'preact';

export function AppShell(props: { children: ComponentChildren }) {
  return (
    <div class="app-shell">
      <header class="app-shell__header">
        <h1>Notes</h1>
        <p>Bloc de notas offline con persistencia local.</p>
      </header>
      <main>{props.children}</main>
    </div>
  );
}
