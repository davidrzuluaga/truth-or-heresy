import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  GamificationData,
  DEFAULT_DATA,
  XPGain,
  BadgeUnlock,
  getLevel,
} from "./types";
import { loadGamificationData, saveGamificationData } from "./storage";
import {
  updateDailyStreak,
  awardXP,
  awardPerfectSession,
  checkBadges,
  updateMasteryProgress,
  addToReview,
  recordReviewResult,
  recordDailyChallengeComplete,
} from "./engine";
import { getDueReviews } from "./spaced";
import { DAILY_XP_MULTIPLIER, todayStr } from "./daily";
import { checkHeartsReset, loseHeart } from "./hearts";

// ─── Context shape ──────────────────────────────────────────────────────────

interface GamificationContextType {
  data: GamificationData;
  xpNotifications: XPGain[];
  badgeNotifications: BadgeUnlock[];
  levelUp: number | null;
  /** Current hearts remaining */
  hearts: number;
  /** Standard quiz answer */
  recordAnswer: (
    wasCorrect: boolean,
    wasHeresy: boolean,
    sessionStreak: number,
    questionId?: number
  ) => void;
  /** Daily challenge answer (2.5× XP) */
  recordDailyAnswer: (
    wasCorrect: boolean,
    wasHeresy: boolean,
    questionId: number
  ) => void;
  /** Review mode answer */
  recordReviewAnswer: (questionId: number, wasCorrect: boolean) => void;
  /** Complete daily challenge */
  completeDailyChallenge: () => void;
  recordPerfectSession: (sessionStreak: number) => void;
  /** Number of reviews due today */
  dueReviewCount: number;
  /** Whether today's daily challenge is already completed */
  isDailyCompleted: boolean;
  dismissXP: (id: string) => void;
  dismissBadge: () => void;
  dismissLevelUp: () => void;
  reload: () => void;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

// ─── Helper to run badge/level/xp side-effects ─────────────────────────────

function processSideEffects(
  prev: GamificationData,
  updated: GamificationData,
  xpGains: XPGain[],
  sessionStreak: number,
  setLevelUp: (l: number) => void,
  setBadgeNotifications: React.Dispatch<React.SetStateAction<BadgeUnlock[]>>,
  setXPNotifications: React.Dispatch<React.SetStateAction<XPGain[]>>
): GamificationData {
  const prevLevel = getLevel(prev.totalXP);

  // Check badges
  const newBadges = checkBadges(updated, sessionStreak);
  if (newBadges.length > 0) {
    updated = {
      ...updated,
      unlockedBadges: [
        ...updated.unlockedBadges,
        ...newBadges.map((b) => b.badge.id),
      ],
    };
    setBadgeNotifications((p) => [...p, ...newBadges]);
  }

  // Check level up
  const newLevel = getLevel(updated.totalXP);
  if (newLevel > prevLevel) {
    setLevelUp(newLevel);
  }

  // Push XP notifications
  if (xpGains.length > 0) {
    setXPNotifications((p) => [...p, ...xpGains]);
  }

  return updated;
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GamificationData>({ ...DEFAULT_DATA });
  const [xpNotifications, setXPNotifications] = useState<XPGain[]>([]);
  const [badgeNotifications, setBadgeNotifications] = useState<BadgeUnlock[]>([]);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    loadGamificationData().then((d) => {
      // Check if hearts should reset for a new day
      const resetResult = checkHeartsReset(d.hearts, d.lastHeartReset);
      if (resetResult.didReset) {
        d = { ...d, hearts: resetResult.hearts, lastHeartReset: resetResult.lastHeartReset };
      }
      setData(d);
      loaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (loaded.current) {
      saveGamificationData(data);
    }
  }, [data]);

  const reload = useCallback(() => {
    loadGamificationData().then(setData);
  }, []);

  // ── Standard quiz answer ──────────────────────────────────────────────────

  const recordAnswer = useCallback(
    (
      wasCorrect: boolean,
      wasHeresy: boolean,
      sessionStreak: number,
      questionId?: number
    ) => {
      setData((prev) => {
        // Check for daily hearts reset first
        const resetResult = checkHeartsReset(prev.hearts, prev.lastHeartReset);
        let updated: GamificationData = resetResult.didReset
          ? { ...prev, hearts: resetResult.hearts, lastHeartReset: resetResult.lastHeartReset }
          : prev;

        updated = updateDailyStreak(updated);

        let xpGains: XPGain[] = [];

        if (wasCorrect) {
          // Award XP only on correct answers
          const xpResult = awardXP(updated, wasCorrect, wasHeresy);
          updated = xpResult.data;
          xpGains = xpResult.xpGains;
        } else {
          // Wrong answer: 0 XP, lose a heart, still count as answered
          updated = {
            ...updated,
            totalAnswered: updated.totalAnswered + 1,
            hearts: loseHeart(updated.hearts),
          };
        }

        if (sessionStreak > updated.bestSessionStreak) {
          updated = { ...updated, bestSessionStreak: sessionStreak };
        }

        // Mastery tracking
        if (questionId) {
          updated = updateMasteryProgress(updated, questionId, wasCorrect);
        }

        // Add wrong answers to review queue
        if (!wasCorrect && questionId) {
          updated = addToReview(updated, questionId);
        }

        return processSideEffects(
          prev, updated, xpGains, sessionStreak,
          setLevelUp, setBadgeNotifications, setXPNotifications
        );
      });
    },
    []
  );

  // ── Daily challenge answer (2.5× XP) ─────────────────────────────────────

  const recordDailyAnswer = useCallback(
    (wasCorrect: boolean, wasHeresy: boolean, questionId: number) => {
      setData((prev) => {
        // Check for daily hearts reset first
        const resetResult = checkHeartsReset(prev.hearts, prev.lastHeartReset);
        let updated: GamificationData = resetResult.didReset
          ? { ...prev, hearts: resetResult.hearts, lastHeartReset: resetResult.lastHeartReset }
          : prev;

        updated = updateDailyStreak(updated);

        let xpGains: XPGain[] = [];

        if (wasCorrect) {
          // Award XP with daily multiplier on correct answers
          const xpResult = awardXP(updated, wasCorrect, wasHeresy, DAILY_XP_MULTIPLIER);
          updated = xpResult.data;
          xpGains = xpResult.xpGains;

          // Track daily progress
          updated = {
            ...updated,
            dailyChallengeProgress: updated.dailyChallengeProgress + 1,
          };
        } else {
          // Wrong answer: 0 XP, lose a heart, still count as answered
          updated = {
            ...updated,
            totalAnswered: updated.totalAnswered + 1,
            hearts: loseHeart(updated.hearts),
          };
        }

        updated = updateMasteryProgress(updated, questionId, wasCorrect);
        if (!wasCorrect) {
          updated = addToReview(updated, questionId);
        }

        return processSideEffects(
          prev, updated, xpGains, 0,
          setLevelUp, setBadgeNotifications, setXPNotifications
        );
      });
    },
    []
  );

  // ── Review answer ─────────────────────────────────────────────────────────

  const recordReviewAnswer = useCallback(
    (questionId: number, wasCorrect: boolean) => {
      setData((prev) => {
        const result = recordReviewResult(prev, questionId, wasCorrect);
        return processSideEffects(
          prev, result.data, result.xpGains, 0,
          setLevelUp, setBadgeNotifications, setXPNotifications
        );
      });
    },
    []
  );

  // ── Complete daily challenge ──────────────────────────────────────────────

  const completeDailyChallenge = useCallback(() => {
    setData((prev) => {
      const result = recordDailyChallengeComplete(prev);
      return processSideEffects(
        prev, result.data, result.xpGains, 0,
        setLevelUp, setBadgeNotifications, setXPNotifications
      );
    });
  }, []);

  // ── Perfect session ───────────────────────────────────────────────────────

  const recordPerfectSession = useCallback(
    (sessionStreak: number) => {
      setData((prev) => {
        const result = awardPerfectSession(prev);
        return processSideEffects(
          prev, result.data, result.xpGains, sessionStreak,
          setLevelUp, setBadgeNotifications, setXPNotifications
        );
      });
    },
    []
  );

  // ── Computed values ───────────────────────────────────────────────────────

  const dueReviewCount = getDueReviews(data.reviewItems).length;
  const isDailyCompleted = data.lastDailyChallengeDate === todayStr();

  // Hearts — apply reset check on every render for live updates
  const heartsReset = checkHeartsReset(data.hearts, data.lastHeartReset);
  const hearts = heartsReset.didReset ? heartsReset.hearts : data.hearts;

  // Apply reset if needed (persists to storage via the data effect)
  useEffect(() => {
    if (heartsReset.didReset && loaded.current) {
      setData((prev) => ({
        ...prev,
        hearts: heartsReset.hearts,
        lastHeartReset: heartsReset.lastHeartReset,
      }));
    }
  }, [heartsReset.didReset, heartsReset.lastHeartReset]);

  // ── Dismiss helpers ───────────────────────────────────────────────────────

  const dismissXP = useCallback((id: string) => {
    setXPNotifications((p) => p.filter((n) => n.id !== id));
  }, []);

  const dismissBadge = useCallback(() => {
    setBadgeNotifications((p) => p.slice(1));
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUp(null);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        data,
        xpNotifications,
        badgeNotifications,
        levelUp,
        hearts,
        recordAnswer,
        recordDailyAnswer,
        recordReviewAnswer,
        completeDailyChallenge,
        recordPerfectSession,
        dueReviewCount,
        isDailyCompleted,
        dismissXP,
        dismissBadge,
        dismissLevelUp,
        reload,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification(): GamificationContextType {
  const ctx = useContext(GamificationContext);
  if (!ctx)
    throw new Error("useGamification must be used inside <GamificationProvider>");
  return ctx;
}
