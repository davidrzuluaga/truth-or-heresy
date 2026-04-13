/**
 * Difficulty scaling system.
 *
 * Each question gets an inferred difficulty (easy / medium / hard) based on:
 *   - Statement length (longer = harder to parse)
 *   - Whether it has a named heresy (harder to identify the specific one)
 *   - Question ID position (later IDs = more advanced theology)
 *
 * The adaptive engine picks questions biased toward the player's current skill
 * level, ramping up as accuracy improves.
 */

import { Question } from "./types";

export type Difficulty = "easy" | "medium" | "hard";

// ── Classify a single question ──────────────────────────────────────────────

export function getQuestionDifficulty(q: Question): Difficulty {
  let score = 0;

  // Longer statements are harder to evaluate
  const len = q.statement.length;
  if (len > 140) score += 2;
  else if (len > 90) score += 1;

  // Named heresies require deeper knowledge
  if (q.correctHeresy !== null) score += 2;

  // Advanced theology categories (later IDs)
  if (q.id > 1000) score += 2;      // modern heresies
  else if (q.id > 700) score += 2;  // ecclesiology, grand theology
  else if (q.id > 500) score += 1;  // eschatology, creation & ethics

  // Heresy statements are slightly harder than truth statements
  if (!q.isTruth) score += 1;

  if (score >= 4) return "hard";
  if (score >= 2) return "medium";
  return "easy";
}

// ── Difficulty metadata ─────────────────────────────────────────────────────

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; icon: string; xpMultiplier: number }
> = {
  easy:   { label: "Easy",   color: "#4ade80", icon: "🟢", xpMultiplier: 1.0 },
  medium: { label: "Medium", color: "#fbbf24", icon: "🟡", xpMultiplier: 1.25 },
  hard:   { label: "Hard",   color: "#f87171", icon: "🔴", xpMultiplier: 1.5 },
};

// ── Determine target difficulty from player accuracy ────────────────────────

export function getTargetDifficulty(
  accuracy: number,
  totalAnswered: number,
): Difficulty {
  // New players get easy questions until they've answered at least 10
  if (totalAnswered < 10) return "easy";

  // Ramp up based on accuracy
  if (accuracy >= 0.85) return "hard";
  if (accuracy >= 0.65) return "medium";
  return "easy";
}

// ── Adaptive shuffle — bias question order toward target difficulty ──────────

/**
 * Shuffles questions with a bias toward the target difficulty.
 * Questions matching the target difficulty are 3× more likely to appear early.
 * This isn't a strict filter — all questions still appear, just reordered.
 */
export function adaptiveShuffle(
  questions: Question[],
  targetDifficulty: Difficulty,
): Question[] {
  const pool = [...questions];

  // Assign weights
  const weighted = pool.map((q) => {
    const diff = getQuestionDifficulty(q);
    let weight: number;

    if (diff === targetDifficulty) {
      weight = 3.0;
    } else if (
      (targetDifficulty === "medium" && diff === "easy") ||
      (targetDifficulty === "medium" && diff === "hard") ||
      (targetDifficulty === "hard" && diff === "medium") ||
      (targetDifficulty === "easy" && diff === "medium")
    ) {
      weight = 1.5; // adjacent difficulty
    } else {
      weight = 0.5; // opposite end
    }

    // Add randomness to prevent identical orderings
    return { question: q, sortKey: Math.random() * weight };
  });

  // Sort descending by weighted random — higher weights appear first
  weighted.sort((a, b) => b.sortKey - a.sortKey);

  return weighted.map((w) => w.question);
}

// ── Stats helper — count distribution in a question set ─────────────────────

export function getDifficultyDistribution(
  questions: Question[],
): Record<Difficulty, number> {
  const dist: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const q of questions) {
    dist[getQuestionDifficulty(q)]++;
  }
  return dist;
}
