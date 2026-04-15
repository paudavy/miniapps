import { useEffect, useState } from 'preact/hooks';
import { getInstallState, subscribeInstallState, triggerInstall } from '../app/registerSW';

export function InstallButton() {
  const [installState, setInstallState] = useState(() => getInstallState());

  useEffect(() => subscribeInstallState(() => {
    setInstallState(getInstallState());
  }), []);

  if (!installState.canInstall || installState.isInstalled) return null;

  return (
    <button type="button" class="install-btn" onClick={triggerInstall} aria-label="Install app" title="Install app">
      <span class="install-btn__icon" aria-hidden="true">↓</span>
    </button>
  );
}
