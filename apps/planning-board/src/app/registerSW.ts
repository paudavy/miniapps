import { installPrompt, installPromptVersion, isInstalled } from '../features/board/state/signals';
import type { BeforeInstallPromptEvent } from '../features/board/state/signals';

let hasRegistered = false;

export function registerSW(): void {
  if (hasRegistered) return;
  hasRegistered = true;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    installPrompt.value = e as BeforeInstallPromptEvent;
    installPromptVersion.value += 1;
  });

  window.addEventListener('appinstalled', () => {
    isInstalled.value = true;
    installPrompt.value = null;
    installPromptVersion.value += 1;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      }).catch((error) => {
        console.error('[registerSW] service worker registration failed', error);
      });
    }, { once: true });
  }
}

export function triggerInstall(): void {
  const prompt = installPrompt.value;
  if (prompt) {
    prompt.prompt();
    prompt.userChoice.then(() => {
      installPrompt.value = null;
      installPromptVersion.value += 1;
    });
  }
}
