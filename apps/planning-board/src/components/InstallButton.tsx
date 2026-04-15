import { useEffect, useState } from 'preact/hooks';
import { getInstallState, subscribeInstallState, triggerInstall } from '../app/registerSW';
import '../features/board/ui/InstallButton.css';

export function InstallButton() {
  const [installState, setInstallState] = useState(() => getInstallState());

  useEffect(() => subscribeInstallState(() => {
    setInstallState(getInstallState());
  }), []);

  if (!installState.canInstall || installState.isInstalled) return null;

  return (
    <button type="button" class="install-btn" onClick={triggerInstall}>
      Install App
    </button>
  );
}
