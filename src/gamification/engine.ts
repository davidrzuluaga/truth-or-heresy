import {
  GamificationData,
  XPGain,
  BadgeUnlock,
  BADGES,
  XP_PER_CORRECT,
  XP_HERESY_BONUS,
  XP_PERFECT_SESSION,
  STREAK_MULTIPLIER_THRESHOLD,
  STREAK_MULTIPLIER,
  DAILY_QUESTION_GOAL,
  getLevel,
} from "./types";
import { getMasteryPathForQuestion, MASTERY_PATHS } from "./mastery";
import {
  createReviewItem,
  advanceReviewItem,
  resetReviewItem,
  REVIEW_XP_BONUS,
} from "./spaced";
import { DAILY_XP_MULTIPLIER, todayStr as dailyTodayStr } from "./daily";

// ─── Date helpers ───────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T12:00:00");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10);
}

function isToday(dateStr: string): boolean {
  return dateStr === todayStr();
}

// ─── Streak update ──────────────────────────────────────────────────────────

export function updateDailyStreak(data: GamificationData): GamificationData {
  const today = todayStr();

  if (isToday(data.lastPlayedDate)) {
    return { ...data, questionsToday: data.questionsToday + 1 };
  }

  if (isYesterday(data.lastPlayedDate)) {
    const hadEnoughYesterday = data.questionsToday >= DAILY_QUESTION_GOAL;
    return {
      ...data,
      dailyStreak: hadEnoughYesterday ? data.dailyStreak + 1 : 1,
      lastPlayedDate: today,
      questionsToday: 1,
    };
  }

  return {
    ...data,
    dailyStreak: 1,
    lastPlayedDate: today,
    questionsToday: 1,
  };
}

// ─── XP award on correct answer ─────────────────────────────────────────────

export function awardXP(
  data: GamificationData,
  wasCorrect: boolean,
  wasHeresy: boolean,
  xpMultiplier: number = 1
): { data: GamificationData; xpGains: XPGain[] } {
  const gains: XPGain[] = [];
  let xpEarned = 0;

  if (wasCorrect) {
    const streakMult =
      data.dailyStreak >= STREAK_MULTIPLIER_THRESHOLD ? STREAK_MULTIPLIER : 1;
    const totalMult = streakMult * xpMultiplier;

    const base = Math.floor(XP_PER_CORRECT * totalMult);
    xpEarned += base;
    const parts: string[] = [];
    if (streakMult > 1) parts.push(`×${streakMult} streak`);
    if (xpMultiplier > 1) parts.push(`×${xpMultiplier} daily`);
    const suffix = parts.length > 0 ? ` (${parts.join(", ")})` : "";
    gains.push({
      id: `correct_${Date.now()}_${Math.random()}`,
      amount: base,
      label: `+${base} XP${suffix}`,
    });

    if (wasHeresy) {
      const bonus = Math.floor(XP_HERESY_BONUS * totalMult);
      xpEarned += bonus;
      gains.push({
        id: `heresy_${Date.now()}_${Math.random()}`,
        amount: bonus,
        label: `+${bonus} Heresy Bonus`,
      });
    }
  }

  return {
    data: {
      ...data,
      totalXP: data.totalXP + xpEarned,
      totalAnswered: data.totalAnswered + 1,
      totalCorrect: data.totalCorrect + (wasCorrect ? 1 : 0),
      heresiesIdentified:
        data.heresiesIdentified + (wasCorrect && wasHeresy ? 1 : 0),
    },
    xpGains: gains,
  };
}

// ─── Perfect session bonus ──────────────────────────────────────────────────

export function awardPerfectSession(
  data: GamificationData
): { data: GamificationData; xpGains: XPGain[] } {
  const multiplier =
    data.dailyStreak >= STREAK_MULTIPLIER_THRESHOLD ? STREAK_MULTIPLIER : 1;
  const bonus = XP_PERFECT_SESSION * multiplier;

  return {
    data: {
      ...data,
      totalXP: data.totalXP + bonus,
      perfectSessions: data.perfectSessions + 1,
    },
    xpGains: [
      {
        id: `perfect_${Date.now()}`,
        amount: bonus,
        label: `+${bonus} Perfect Session!`,
      },
    ],
  };
}

// ─── Mastery tracking ───────────────────────────────────────────────────────

export function updateMasteryProgress(
  data: GamificationData,
  questionId: number,
  wasCorrect: boolean
): GamificationData {
  if (!wasCorrect) return data;

  const path = getMasteryPathForQuestion(questionId);
  if (!path) return data;

  const existing = data.masteryProgress[path.id] || {
    correct: 0,
    answeredIds: [],
  };

  // Don't double-count the same question
  if (existing.answeredIds.includes(questionId)) return data;

  return {
    ...data,
    masteryProgress: {
      ...data.masteryProgress,
      [path.id]: {
        correct: existing.correct + 1,
        answeredIds: [...existing.answeredIds, questionId],
      },
    },
  };
}

// ─── Spaced repetition ──────────────────────────────────────────────────────

export function addToReview(
  data: GamificationData,
  questionId: number
): GamificationData {
  // Don't add duplicates
  if (data.reviewItems.some((r) => r.questionId === questionId)) return data;
  return {
    ...data,
    reviewItems: [...data.reviewItems, createReviewItem(questionId)],
  };
}

export function recordReviewResult(
  data: GamificationData,
  questionId: number,
  wasCorrect: boolean
): { data: GamificationData; xpGains: XPGain[] } {
  const idx = data.reviewItems.findIndex((r) => r.questionId === questionId);
  if (idx === -1) return { data, xpGains: [] };

  const item = data.reviewItems[idx];
  const newItems = [...data.reviewItems];
  const gains: XPGain[] = [];

  if (wasCorrect) {
    const advanced = advanceReviewItem(item);
    if (advanced) {
      newItems[idx] = advanced;
    } else {
      // Mastered — remove
      newItems.splice(idx, 1);
    }
    const bonus = REVIEW_XP_BONUS;
    gains.push({
      id: `review_${Date.now()}`,
      amount: bonus,
      label: `+${bonus} Review Bonus`,
    });
    return {
      data: {
        ...data,
        reviewItems: newItems,
        totalXP: data.totalXP + bonus,
        reviewsCompleted: data.reviewsCompleted + 1,
      },
      xpGains: gains,
    };
  } else {
    newItems[idx] = resetReviewItem(item);
    return {
      data: { ...data, reviewItems: newItems },
      xpGains: [],
    };
  }
}

// ─── Daily Challenge completion ─────────────────────────────────────────────

export function recordDailyChallengeComplete(
  data: GamificationData
): { data: GamificationData; xpGains: XPGain[] } {
  const today = todayStr();
  if (data.lastDailyChallengeDate === today) {
    return { data, xpGains: [] }; // already completed today
  }

  const bonus = 25;
  return {
    data: {
      ...data,
      dailyChallengesCompleted: data.dailyChallengesCompleted + 1,
      lastDailyChallengeDate: today,
      totalXP: data.totalXP + bonus,
    },
    xpGains: [
      {
        id: `daily_complete_${Date.now()}`,
        amount: bonus,
        label: `+${bonus} Daily Challenge Complete!`,
      },
    ],
  };
}

// ─── Badge checks ───────────────────────────────────────────────────────────

export function checkBadges(
  data: GamificationData,
  sessionStreak: number
): BadgeUnlock[] {
  const newBadges: BadgeUnlock[] = [];
  const already = new Set(data.unlockedBadges);

  // Check mastery milestones
  let hasAny50 = false;
  let hasAny100 = false;
  for (const path of MASTERY_PATHS) {
    const prog = data.masteryProgress[path.id];
    if (prog) {
      const pct = prog.correct / path.totalQuestions;
      if (pct >= 0.5) hasAny50 = true;
      if (pct >= 1) hasAny100 = true;
    }
  }

  const checks: Record<string, boolean> = {
    first_steps: data.totalAnswered >= 10,
    council_member: data.totalAnswered >= 50,
    theology_nerd: data.totalAnswered >= 100,
    century_club: data.totalCorrect >= 100,
    daily_devotion: data.dailyStreak >= 3,
    streak_master: data.dailyStreak >= 7,
    eternal_flame: data.dailyStreak >= 30,
    orthodoxy_defender:
      data.totalAnswered >= 50 &&
      data.totalCorrect / data.totalAnswered >= 0.95,
    perfect_session: data.perfectSessions >= 1,
    on_fire: sessionStreak >= 10 || data.bestSessionStreak >= 10,
    heresy_hunter: data.heresiesIdentified >= 20,
    heresy_slayer: data.heresiesIdentified >= 50,
    church_father: getLevel(data.totalXP) >= 5,
    scholar: getLevel(data.totalXP) >= 10,
    daily_flame: data.dailyChallengesCompleted >= 1,
    daily_devotee: data.dailyChallengesCompleted >= 7,
    first_mastery: hasAny50,
    grand_master: hasAny100,
  };

  for (const [id, earned] of Object.entries(checks)) {
    if (earned && !already.has(id)) {
      const badge = BADGES.find((b) => b.id === id);
      if (badge) newBadges.push({ badge });
    }
  }

  return newBadges;
}
