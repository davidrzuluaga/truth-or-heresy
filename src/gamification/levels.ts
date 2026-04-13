// ─── Curved XP progression ──────────────────────────────────────────────────
// Early levels are fast and rewarding; later levels ramp up meaningfully.

/**
 * Total XP required to REACH a given level (cumulative).
 * Level 1 = 0 XP, Level 2 = 180 XP, Level 3 = 360 XP, ...
 */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let l = 2; l <= level; l++) {
    total += xpForSingleLevel(l);
  }
  return total;
}

/**
 * XP needed to advance FROM (level-1) TO level.
 */
export function xpForSingleLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= 5) return level * 180; // 360, 540, 720, 900
  if (level <= 10) return Math.floor(900 + (level - 5) * 280); // 1180..2300
  return Math.floor(2200 + Math.pow(level - 10, 2.1) * 90); // ramps up
}

/**
 * Derive level from total XP.
 */
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

/**
 * How much XP the user has earned within their current level.
 */
export function getXPInCurrentLevel(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  return totalXP - xpRequiredForLevel(level);
}

/**
 * How much total XP is needed to go from start of current level to the next.
 */
export function getXPNeededForCurrentLevel(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  return xpForSingleLevel(level + 1);
}

/**
 * Progress through the current level as a 0–1 fraction.
 */
export function getLevelProgress(totalXP: number): number {
  const needed = getXPNeededForCurrentLevel(totalXP);
  if (needed <= 0) return 1;
  return getXPInCurrentLevel(totalXP) / needed;
}
