export const PROFILE_COLOR_PALETTE = [
  '#004F87',
  '#34d399',
  '#fbbf24',
  '#f472b6',
  '#a78bfa',
  '#22d3ee',
  '#fb923c',
  '#4ade80',
];

export function getProfileColor(index: number): string {
  return PROFILE_COLOR_PALETTE[index % PROFILE_COLOR_PALETTE.length];
}

export function generateInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '??';
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function normalizeInitials(value: string, fallbackName: string): string {
  const trimmed = value.trim();
  if (trimmed) return trimmed.slice(0, 2).toUpperCase();
  return generateInitials(fallbackName);
}

export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((part) => `${part}${part}`).join('')
    : normalized;
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
