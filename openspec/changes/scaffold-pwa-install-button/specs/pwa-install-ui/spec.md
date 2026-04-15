## ADDED Requirements

### Requirement: Scaffolded PWA apps include install UI baseline
The scaffold MUST generate a baseline install UI module for miniapps with `pwa: true`, including state for install prompt availability, install trigger action, and a UI component that can render from AppShell.

#### Scenario: Generated PWA app includes install UI modules
- **WHEN** a developer runs the scaffold for a miniapp with default settings (PWA enabled)
- **THEN** the generated source includes install UI modules and wiring required to render an install action in the shell

### Requirement: Install UI is inert unless install prompt is available
The generated install UI component MUST render no interactive install control unless `beforeinstallprompt` has been received and app installation has not already completed.

#### Scenario: No install prompt means no install button
- **WHEN** the app has not received a `beforeinstallprompt` event
- **THEN** the generated install UI component does not render the install control

#### Scenario: Installed app hides install button
- **WHEN** the app receives an `appinstalled` event
- **THEN** the generated install UI component no longer renders the install control
