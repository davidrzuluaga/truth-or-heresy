/**
 * Hearts / Lives system.
 *
 * Players get 5 hearts per day. Lose 1 for every wrong answer.
 * When hearts reach 0, the player can't play quiz or daily challenge
 * (review mode is always free). Hearts reset daily at midnight local time.
 */

// ── Constants ───────────────────────────────────────────────────────────────

export const MAX_HEARTS = 5;

// ── Reset logic ─────────────────────────────────────────────────────────────

/**
 * Get today's date string in YYYY-MM-DD (local time).
 */
function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Check if hearts should reset and return the updated values.
 * Hearts reset when the stored date differs from today (local).
 */
export function checkHeartsReset(
  hearts: number,
  lastHeartReset: string
): { hearts: number; lastHeartReset: string; didReset: boolean } {
  const today = todayLocal();
  if (lastHeartReset !== today) {
    return { hearts: MAX_HEARTS, lastHeartReset: today, didReset: true };
  }
  return { hearts, lastHeartReset, didReset: false };
}

/**
 * Lose one heart (min 0).
 */
export function loseHeart(hearts: number): number {
  return Math.max(0, hearts - 1);
}

/**
 * Seconds until midnight (local time) — for the countdown timer.
 */
export function secondsUntilHeartReset(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

/**
 * Format seconds as HH:MM:SS or MM:SS.
 */
export function formatHeartCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }
  return `${m}m ${String(s).padStart(2, "0")}s`;
}
