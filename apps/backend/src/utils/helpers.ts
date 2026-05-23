// ============================================
// DevScope — Utility Helpers
// ============================================

/**
 * Clamp a number between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Round to N decimal places.
 */
export function round(value: number, decimals: number = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Calculate human-readable account age from ISO date string.
 */
export function getAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

  return parts.join(', ');
}

/**
 * Parse a duration string like "15m", "7d", "1h" to milliseconds.
 */
export function parseDurationMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000; // default 15m

  const value = parseInt(match[1]!, 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default:  return 15 * 60 * 1000;
  }
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize a GitHub username (lowercase, trimmed).
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

/**
 * Calculate the number of days since a given ISO date string.
 */
export function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Logarithmic scaling — maps a raw count to 0-100 using a log curve.
 * `ceiling` is the value at which the score saturates near 100.
 */
export function logScale(value: number, ceiling: number): number {
  if (value <= 0) return 0;
  if (value >= ceiling) return 100;
  return clamp(Math.round((Math.log(value + 1) / Math.log(ceiling + 1)) * 100), 0, 100);
}

/**
 * Linear scaling — maps a raw count to 0-100 linearly.
 */
export function linearScale(value: number, ceiling: number): number {
  if (value <= 0) return 0;
  if (value >= ceiling) return 100;
  return clamp(Math.round((value / ceiling) * 100), 0, 100);
}

/**
 * Group an array of items by a key function.
 */
export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key]!.push(item);
  }
  return groups;
}

/**
 * Get the score label for a given score and category.
 */
export function getScoreLabel(score: number, thresholds: [number, string][]): string {
  for (const [threshold, label] of thresholds) {
    if (score >= threshold) return label;
  }
  return 'Unknown';
}
