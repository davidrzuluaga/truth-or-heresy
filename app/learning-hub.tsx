import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Clock,
  BookOpen,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Crown,
} from "lucide-react-native";
import { useGamification } from "../src/gamification/context";
import { useGame } from "../src/context";
import { usePremium } from "../src/premium";
import { LevelProgress } from "../components/LevelProgress";
import { StreakCounter } from "../components/StreakCounter";
import { HeartsDisplay } from "../components/HeartsDisplay";
import { MasteryCard } from "../components/MasteryCard";
import { BadgeGrid } from "../components/BadgeGrid";
import { MASTERY_PATHS } from "../src/gamification/mastery";
import {
  secondsUntilReset,
  formatCountdown,
} from "../src/gamification/daily";

export default function LearningHubScreen() {
  const { data, dueReviewCount, isDailyCompleted, hearts } = useGamification();
  const { dispatch } = useGame();
  const { isPremium } = usePremium();

  const freePaths = MASTERY_PATHS.filter((p) => p.isFree);
  const paidPaths = MASTERY_PATHS.filter((p) => !p.isFree);
  const [countdown, setCountdown] = useState(formatCountdown(secondsUntilReset()));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(secondsUntilReset()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const accuracy =
    data.totalAnswered > 0
      ? Math.round((data.totalCorrect / data.totalAnswered) * 100)
      : 0;

  const handleStartDaily = useCallback(() => {
    dispatch({ type: "START_GAME" });
    router.push("/daily-challenge");
  }, [dispatch]);

  const handleStartReview = useCallback(() => {
    dispatch({ type: "START_GAME" });
    router.push("/review");
  }, [dispatch]);

  const handleStartQuiz = useCallback(() => {
    router.push("/category-select");
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }} edges={["bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Level & Streak ────────────────────────────────────── */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <View style={[styles.card, { flex: 1, alignItems: "center" }]}>
            <LevelProgress totalXP={data.totalXP} size="large" />
          </View>
          <View style={[styles.card, { flex: 1, alignItems: "center", justifyContent: "center" }]}>
            <StreakCounter size="large" />
          </View>
        </View>

        {/* ── Hearts ────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: "#111113",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: hearts > 0 ? "#27272a" : "rgba(239,68,68,0.3)",
            padding: 14,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <HeartsDisplay hearts={hearts} showCount={true} size="large" />
          <Text style={{ color: "#71717a", fontSize: 12 }}>
            {hearts > 0
              ? "Lose a heart for every wrong answer"
              : "Hearts refill tomorrow!"}
          </Text>
        </View>

        {/* ── Quick stats ───────────────────────────────────────── */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <StatPill label="Accuracy" value={`${accuracy}%`} />
          <StatPill label="Answered" value={`${data.totalAnswered}`} />
          <StatPill label="Reviews" value={`${data.reviewsCompleted}`} />
        </View>

        {/* ── Daily Challenge ──────────────────────────────────── */}
        <Pressable
          onPress={isDailyCompleted ? undefined : handleStartDaily}
          style={({ pressed }) => ({
            backgroundColor: isDailyCompleted ? "#111113" : "#1c1308",
            borderRadius: 18,
            borderWidth: 1,
            borderColor: isDailyCompleted ? "#27272a" : "rgba(245,158,11,0.4)",
            padding: 18,
            marginBottom: 10,
            opacity: pressed && !isDailyCompleted ? 0.9 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <Sparkles size={20} color={isDailyCompleted ? "#52525b" : "#fbbf24"} />
            <Text
              style={{
                color: isDailyCompleted ? "#71717a" : "#fbbf24",
                fontSize: 15,
                fontWeight: "800",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Doctrine of the Day
            </Text>
            {isDailyCompleted ? (
              <Text style={{ color: "#4ade80", fontSize: 13, fontWeight: "700" }}>
                Completed!
              </Text>
            ) : (
              <View style={styles.xpPill}>
                <Text style={{ color: "#fbbf24", fontSize: 11, fontWeight: "700" }}>
                  2.5× XP
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              color: isDailyCompleted ? "#52525b" : "#a1a1aa",
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            {isDailyCompleted
              ? "Come back tomorrow for a new set!"
              : "7 curated questions — earn bonus XP."}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Clock size={12} color="#52525b" />
            <Text style={{ color: "#52525b", fontSize: 11 }}>
              Resets in {countdown}
            </Text>
          </View>
        </Pressable>

        {/* ── Review ────────────────────────────────────────────── */}
        <Pressable
          onPress={dueReviewCount > 0 ? handleStartReview : undefined}
          style={({ pressed }) => ({
            backgroundColor: dueReviewCount > 0 ? "#0c1317" : "#111113",
            borderRadius: 18,
            borderWidth: 1,
            borderColor: dueReviewCount > 0 ? "rgba(96,165,250,0.3)" : "#27272a",
            padding: 18,
            marginBottom: 10,
            opacity: pressed && dueReviewCount > 0 ? 0.9 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <RotateCcw size={18} color={dueReviewCount > 0 ? "#60a5fa" : "#52525b"} />
            <Text
              style={{
                color: dueReviewCount > 0 ? "#60a5fa" : "#71717a",
                fontSize: 15,
                fontWeight: "800",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Spaced Review
            </Text>
            {dueReviewCount > 0 && (
              <View style={styles.blueBadge}>
                <Text style={{ color: "#60a5fa", fontSize: 13, fontWeight: "800" }}>
                  {dueReviewCount}
                </Text>
              </View>
            )}
          </View>
          <Text style={{ color: "#71717a", fontSize: 12 }}>
            {dueReviewCount > 0
              ? `${dueReviewCount} question${dueReviewCount === 1 ? "" : "s"} due for review`
              : "No reviews due — keep learning!"}
          </Text>
        </Pressable>

        {/* ── Free Play ────────────────────────────────────────── */}
        <Pressable
          onPress={handleStartQuiz}
          style={({ pressed }) => ({
            backgroundColor: "#111113",
            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 18,
            marginBottom: 24,
            opacity: pressed ? 0.9 : 1,
            flexDirection: "row",
            alignItems: "center",
          })}
        >
          <BookOpen size={18} color="#a1a1aa" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: "#f4f4f5", fontSize: 15, fontWeight: "700" }}>
              Free Play
            </Text>
            <Text style={{ color: "#71717a", fontSize: 12, marginTop: 2 }}>
              Practice from the full 2,055 questions
            </Text>
          </View>
          <ChevronRight size={18} color="#52525b" />
        </Pressable>

        {/* ── Statistics ───────────────────────────────────────── */}
        <View style={[styles.card, { padding: 18, marginBottom: 16 }]}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={{ gap: 12 }}>
            <StatRow label="Total Questions" value={data.totalAnswered.toLocaleString()} icon="📖" />
            <StatRow label="Correct Answers" value={data.totalCorrect.toLocaleString()} icon="✅" />
            <StatRow label="Accuracy" value={`${accuracy}%`} icon="🎯" highlight={accuracy >= 80} />
            <StatRow label="Heresies Caught" value={data.heresiesIdentified.toLocaleString()} icon="🗡️" />
            <StatRow label="Perfect Sessions" value={data.perfectSessions.toLocaleString()} icon="👑" />
            <StatRow label="Best Streak" value={`${data.bestSessionStreak} in a row`} icon="⚡" />
            <StatRow label="Daily Challenges" value={data.dailyChallengesCompleted.toLocaleString()} icon="✨" />
          </View>
        </View>

        {/* ── Mastery Paths ────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Mastery Paths</Text>
        {freePaths.map((path) => (
          <MasteryCard
            key={path.id}
            path={path}
            progress={data.masteryProgress[path.id]}
          />
        ))}

        {/* Unlock CTA (hidden once user is premium) */}
        {!isPremium && paidPaths.length > 0 && (
          <Pressable
            onPress={() => router.push("/paywall" as any)}
            style={({ pressed }) => ({
              backgroundColor: "rgba(245,158,11,0.12)",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.35)",
              padding: 16,
              marginTop: 8,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Crown size={22} color="#f59e0b" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fbbf24", fontSize: 15, fontWeight: "800" }}>
                Unlock {paidPaths.length} More Paths
              </Text>
              <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 2 }}>
                Infinite hearts · Full scholar library
              </Text>
            </View>
            <ChevronRight size={18} color="#f59e0b" />
          </Pressable>
        )}

        {/* Premium (or locked) paths */}
        {paidPaths.map((path) => (
          <MasteryCard
            key={path.id}
            path={path}
            progress={data.masteryProgress[path.id]}
            locked={!isPremium}
          />
        ))}

        {/* ── Badges ───────────────────────────────────────────── */}
        <View style={[styles.card, { padding: 18, marginTop: 12, marginBottom: 16 }]}>
          <BadgeGrid unlockedBadges={data.unlockedBadges} />
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111113",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#27272a",
        paddingVertical: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fbbf24", fontSize: 16, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: "#52525b", fontSize: 10, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function StatRow({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
        <Text style={{ color: "#a1a1aa", fontSize: 13 }}>{label}</Text>
      </View>
      <Text style={{ color: highlight ? "#4ade80" : "#fbbf24", fontSize: 15, fontWeight: "700" }}>
        {value}
      </Text>
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: "#111113",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 14,
  },
  sectionTitle: {
    color: "#f4f4f5",
    fontSize: 17,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  xpPill: {
    backgroundColor: "rgba(245,158,11,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  blueBadge: {
    backgroundColor: "rgba(96,165,250,0.2)",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
};
