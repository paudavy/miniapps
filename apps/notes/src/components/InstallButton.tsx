import { useEffect, useState } from 'preact/hooks';
import { getInstallState, subscribeInstallState, triggerInstall } from '../app/registerSW';

export function InstallButton() {
  const [installState, setInstallState] = useState(() => getInstallState());

  useEffect(() => subscribeInstallState(() => {
    setInstallState(getInstallState());
  }), []);

  if (!installState.canInstall || installState.isInstalled) return null;

  return (
    <button type="button" onClick={triggerInstall}>
      Install App
    </button>
  );
}
