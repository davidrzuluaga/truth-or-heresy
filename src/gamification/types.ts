import { getLevelFromXP } from "./levels";
import { ReviewItem } from "./spaced";
import { MasteryProgress } from "./mastery";

// ─── XP & Levels ────────────────────────────────────────────────────────────

export const XP_PER_CORRECT = 10;
export const XP_HERESY_BONUS = 5;
export const XP_PERFECT_SESSION = 15;
export const STREAK_MULTIPLIER_THRESHOLD = 3; // days
export const STREAK_MULTIPLIER = 2;
export const DAILY_QUESTION_GOAL = 5;

// Re-export curved level helpers as the canonical API
export { getLevelFromXP as getLevel } from "./levels";
export {
  getXPInCurrentLevel,
  getXPNeededForCurrentLevel,
  getLevelProgress,
} from "./levels";

// ─── Badge definitions ──────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "milestone" | "streak" | "accuracy" | "heresy" | "level" | "daily" | "mastery";
}

export const BADGES: Badge[] = [
  // Milestones
  {
    id: "first_steps",
    name: "First Steps",
    description: "Answer 10 questions",
    icon: "👣",
    category: "milestone",
  },
  {
    id: "council_member",
    name: "Council Member",
    description: "Answer 50 questions",
    icon: "🏛️",
    category: "milestone",
  },
  {
    id: "theology_nerd",
    name: "Theology Nerd",
    description: "Answer 100 questions",
    icon: "📚",
    category: "milestone",
  },
  {
    id: "century_club",
    name: "Century Club",
    description: "Get 100 correct answers",
    icon: "💯",
    category: "milestone",
  },
  // Streak
  {
    id: "daily_devotion",
    name: "Daily Devotion",
    description: "3-day streak",
    icon: "🕯️",
    category: "streak",
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "7-day streak",
    icon: "🔥",
    category: "streak",
  },
  {
    id: "eternal_flame",
    name: "Eternal Flame",
    description: "30-day streak",
    icon: "✨",
    category: "streak",
  },
  // Accuracy
  {
    id: "orthodoxy_defender",
    name: "Orthodoxy Defender",
    description: "95%+ accuracy over 50 questions",
    icon: "🛡️",
    category: "accuracy",
  },
  {
    id: "perfect_session",
    name: "Flawless Victory",
    description: "Perfect session — all correct",
    icon: "👑",
    category: "accuracy",
  },
  {
    id: "on_fire",
    name: "On Fire",
    description: "10-question correct streak in a session",
    icon: "⚡",
    category: "accuracy",
  },
  // Heresy-related
  {
    id: "heresy_hunter",
    name: "Heresy Hunter",
    description: "Correctly identify 20 heresies",
    icon: "🗡️",
    category: "heresy",
  },
  {
    id: "heresy_slayer",
    name: "Heresy Slayer",
    description: "Correctly identify 50 heresies",
    icon: "⚔️",
    category: "heresy",
  },
  // Level
  {
    id: "church_father",
    name: "Church Father",
    description: "Reach Level 5",
    icon: "⛪",
    category: "level",
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Reach Level 10",
    icon: "🎓",
    category: "level",
  },
  // Daily Challenge
  {
    id: "daily_flame",
    name: "Daily Flame",
    description: "Complete a Daily Challenge",
    icon: "🌟",
    category: "daily",
  },
  {
    id: "daily_devotee",
    name: "Daily Devotee",
    description: "Complete 7 Daily Challenges",
    icon: "📿",
    category: "daily",
  },
  // Mastery
  {
    id: "first_mastery",
    name: "First Mastery",
    description: "Reach 50% on any mastery path",
    icon: "🏅",
    category: "mastery",
  },
  {
    id: "grand_master",
    name: "Grand Master",
    description: "Reach 100% on any mastery path",
    icon: "🏆",
    category: "mastery",
  },
];

// ─── Persisted state ────────────────────────────────────────────────────────

export interface GamificationData {
  totalXP: number;
  totalAnswered: number;
  totalCorrect: number;
  heresiesIdentified: number;
  bestSessionStreak: number;
  dailyStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  questionsToday: number;
  unlockedBadges: string[];
  perfectSessions: number;
  // Daily Challenge
  dailyChallengesCompleted: number;
  lastDailyChallengeDate: string; // YYYY-MM-DD of last completed daily
  dailyChallengeProgress: number; // how many of today's 7 answered correctly
  // Spaced Repetition
  reviewItems: ReviewItem[];
  reviewsCompleted: number;
  // Mastery Paths — keyed by path ID
  masteryProgress: Record<string, MasteryProgress>;
}

export const DEFAULT_DATA: GamificationData = {
  totalXP: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  heresiesIdentified: 0,
  bestSessionStreak: 0,
  dailyStreak: 0,
  lastPlayedDate: "",
  questionsToday: 0,
  unlockedBadges: [],
  perfectSessions: 0,
  dailyChallengesCompleted: 0,
  lastDailyChallengeDate: "",
  dailyChallengeProgress: 0,
  reviewItems: [],
  reviewsCompleted: 0,
  masteryProgress: {},
};

// ─── Notification types ─────────────────────────────────────────────────────

export interface XPGain {
  id: string;
  amount: number;
  label: string;
}

export interface BadgeUnlock {
  badge: Badge;
}
