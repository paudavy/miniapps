import { h } from 'preact';
import { installPrompt, installPromptVersion, isInstalled } from '../state/signals';
import { triggerInstall } from '../../../app/registerSW';
import './InstallButton.css';

export function InstallButton(): h.JSX.Element | null {
  void installPromptVersion.value;
  if (!installPrompt.value || isInstalled.value) return null;
  return (
    <button className="install-btn" onClick={triggerInstall}>Install App</button>
  );
}
