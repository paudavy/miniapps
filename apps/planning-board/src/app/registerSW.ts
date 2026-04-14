import { installPrompt, isInstalled } from '../state/signals';
import type { BeforeInstallPromptEvent } from '../state/signals';

export function registerSW(): void {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    installPrompt.value = e as BeforeInstallPromptEvent;
  });

  window.addEventListener('appinstalled', () => {
    isInstalled.value = true;
    installPrompt.value = null;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('[registerSW] service worker registration failed', error);
      });
    });
  }
}

export function triggerInstall(): void {
  const prompt = installPrompt.value;
  if (prompt) {
    prompt.prompt();
    prompt.userChoice.then(() => {
      installPrompt.value = null;
    });
  }
}
