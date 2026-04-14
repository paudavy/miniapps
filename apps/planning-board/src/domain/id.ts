import { nanoid } from 'nanoid';

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // Fall back to nanoid when randomUUID is unavailable at runtime.
    }
  }

  return nanoid();
}
