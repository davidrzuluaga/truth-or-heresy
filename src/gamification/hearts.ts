/**
 * Hearts / Lives system.
 *
 * Players get 5 hearts. Lose 1 for every wrong answer.
 * When hearts reach 0 the player can't play quiz or daily challenge
 * (review mode is always free). Hearts refill 24 hours after the last
 * heart was lost.
 */

// ── Constants ───────────────────────────────────────────────────────────────

export const MAX_HEARTS = 5;

// ── Reset logic ─────────────────────────────────────────────────────────────

const REFILL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check if hearts should reset and return the updated values.
 * Hearts reset 24 hours after lastHeartReset (an ISO timestamp set when
 * hearts hit 0). If hearts > 0 or no timestamp is recorded, no reset.
 */
export function checkHeartsReset(
  hearts: number,
  lastHeartReset: string
): { hearts: number; lastHeartReset: string; didReset: boolean } {
  if (hearts > 0 || !lastHeartReset) {
    return { hearts, lastHeartReset, didReset: false };
  }
  const elapsed = Date.now() - new Date(lastHeartReset).getTime();
  if (elapsed >= REFILL_MS) {
    return { hearts: MAX_HEARTS, lastHeartReset: "", didReset: true };
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
 * Seconds until hearts refill (24h after lastHeartReset timestamp).
 * Pass the stored lastHeartReset ISO string from gamification data.
 */
export function secondsUntilHeartReset(lastHeartReset: string): number {
  if (!lastHeartReset) return REFILL_MS / 1000;
  const refillAt = new Date(lastHeartReset).getTime() + REFILL_MS;
  return Math.max(0, Math.floor((refillAt - Date.now()) / 1000));
}

/**
 * Format seconds as "Xh MMm" or "Mm SSs".
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
