// ─── Daily Challenge ("Doctrine of the Day") ───────────────────────────────
// Deterministic 7-question set per calendar day. Same questions for all users
// on the same day, but different every day.

import { QUESTIONS } from "../questions";

const DAILY_COUNT = 7;
export const DAILY_XP_MULTIPLIER = 2.5;

/**
 * Simple deterministic hash from a date string to seed question selection.
 */
function dateHash(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Get today's date string (YYYY-MM-DD).
 */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get the 7 daily challenge question IDs for a given date.
 */
export function getDailyChallengeIds(dateStr: string): number[] {
  const seed = dateHash(dateStr);
  const total = QUESTIONS.length;
  const ids: number[] = [];
  const used = new Set<number>();

  for (let i = 0; ids.length < DAILY_COUNT; i++) {
    const idx = ((seed + i * 7919) % total + total) % total;
    if (!used.has(idx)) {
      used.add(idx);
      ids.push(QUESTIONS[idx].id);
    }
  }
  return ids;
}

/**
 * Get the daily challenge questions for a given date.
 */
export function getDailyChallengeQuestions(dateStr: string) {
  const ids = new Set(getDailyChallengeIds(dateStr));
  return QUESTIONS.filter((q) => ids.has(q.id));
}

/**
 * Seconds until midnight (next daily reset).
 */
export function secondsUntilReset(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

/**
 * Format seconds as "HH:MM:SS".
 */
export function formatCountdown(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
