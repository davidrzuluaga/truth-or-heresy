import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Flame,
  BookOpen,
  Settings,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Clock,
} from "lucide-react-native";
import { useGame } from "../src/context";
import { useGamification } from "../src/gamification/context";
import { StreakCounter } from "../components/StreakCounter";
import { LevelProgress } from "../components/LevelProgress";
import { HeartsDisplay } from "../components/HeartsDisplay";
import { getLevelFromXP } from "../src/gamification/levels";
import { secondsUntilReset, formatCountdown } from "../src/gamification/daily";
import {
  secondsUntilHeartReset,
  formatHeartCountdown,
} from "../src/gamification/hearts";

export default function HomeScreen() {
  const { dispatch } = useGame();
  const { data, dueReviewCount, isDailyCompleted, hearts } = useGamification();
  const level = getLevelFromXP(data.totalXP);
  const [countdown, setCountdown] = useState(formatCountdown(secondsUntilReset()));
  const [heartCountdown, setHeartCountdown] = useState(
    formatHeartCountdown(secondsUntilHeartReset())
  );
  const outOfHearts = hearts <= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(secondsUntilReset()));
      setHeartCountdown(formatHeartCountdown(secondsUntilHeartReset()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const accuracy =
    data.totalAnswered > 0 ? data.totalCorrect / data.totalAnswered : 0;

  const handleStart = useCallback(() => {
    if (outOfHearts) {
      router.push("/out-of-hearts" as any);
      return;
    }
    dispatch({ type: "START_GAME", accuracy, totalAnswered: data.totalAnswered });
    router.push("/quiz");
  }, [outOfHearts, accuracy, data.totalAnswered, dispatch]);

  const handleDaily = useCallback(() => {
    if (outOfHearts) {
      router.push("/out-of-hearts" as any);
      return;
    }
    dispatch({ type: "START_GAME", accuracy, totalAnswered: data.totalAnswered });
    router.push("/daily-challenge");
  }, [outOfHearts, accuracy, data.totalAnswered, dispatch]);

  const handleReview = useCallback(() => {
    dispatch({ type: "START_GAME", accuracy, totalAnswered: data.totalAnswered });
    router.push("/review");
  }, [accuracy, data.totalAnswered, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }}>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <HeartsDisplay hearts={hearts} showCount={false} size="small" />
          <StreakCounter size="small" />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <IconButton
            onPress={() => router.push("/learning-hub")}
            icon={<GraduationCap size={20} color="#a1a1aa" />}
          />
          <IconButton
            onPress={() => router.push("/settings")}
            icon={<Settings size={20} color="#a1a1aa" />}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ────────────────────────────────────────────── */}
        <View style={{ alignItems: "center", paddingTop: 20, paddingBottom: 20 }}>
          <View
            style={{
              backgroundColor: "rgba(245,158,11,0.15)",
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.3)",
              borderRadius: 999,
              padding: 18,
              marginBottom: 18,
            }}
          >
            <Flame size={44} color="#f59e0b" />
          </View>

          <Text
            style={{
              color: "#f59e0b",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            The Theology Quiz
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 36,
              fontWeight: "900",
              textAlign: "center",
              lineHeight: 42,
              marginBottom: 8,
            }}
          >
            Truth or{"\n"}Heresy?
          </Text>

          <Text
            style={{
              color: "#a1a1aa",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            Spot true doctrine from ancient errors
          </Text>
        </View>

        {/* ── Start Quiz (main CTA) — ALWAYS renders ──────────── */}
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => ({
            backgroundColor: outOfHearts ? "#27272a" : "#f59e0b",
            borderRadius: 18,
            paddingVertical: 22,
            paddingHorizontal: 24,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            minHeight: 70,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            style={{
              color: outOfHearts ? "#71717a" : "#09090b",
              fontSize: 20,
              fontWeight: "800",
              letterSpacing: 0.5,
            }}
          >
            {outOfHearts ? "Out of Hearts" : "Start Quiz"}
          </Text>
          {outOfHearts && (
            <Text
              style={{
                color: "#ef4444",
                fontSize: 12,
                marginTop: 4,
                fontWeight: "600",
              }}
            >
              Refills in {heartCountdown}
            </Text>
          )}
        </Pressable>

        {/* ── Level progress ──────────────────────────────────── */}
        {data.totalXP > 0 && (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={styles.levelBadge}>
                <Text style={{ color: "#fbbf24", fontSize: 18, fontWeight: "900" }}>
                  {level}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <LevelProgress totalXP={data.totalXP} size="small" />
              </View>
            </View>
          </View>
        )}

        {/* ── Daily Challenge ────────────────────────────────── */}
        <Pressable
          onPress={isDailyCompleted ? undefined : handleDaily}
          style={({ pressed }) => ({
            backgroundColor: isDailyCompleted ? "#111113" : "#1c1308",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDailyCompleted
              ? "#27272a"
              : "rgba(245,158,11,0.4)",
            padding: 16,
            marginBottom: 10,
            opacity: pressed && !isDailyCompleted ? 0.9 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Sparkles size={18} color={isDailyCompleted ? "#52525b" : "#fbbf24"} />
            <Text
              style={{
                color: isDailyCompleted ? "#71717a" : "#fbbf24",
                fontSize: 15,
                fontWeight: "800",
                marginLeft: 8,
                flex: 1,
              }}
            >
              Doctrine of the Day
            </Text>
            {isDailyCompleted ? (
              <Text style={{ color: "#4ade80", fontSize: 12, fontWeight: "700" }}>
                Done!
              </Text>
            ) : (
              <View style={styles.xpPill}>
                <Text style={{ color: "#fbbf24", fontSize: 11, fontWeight: "700" }}>
                  2.5× XP
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Clock size={11} color="#52525b" />
            <Text style={{ color: "#52525b", fontSize: 11 }}>
              {isDailyCompleted ? "Come back tomorrow!" : `Resets in ${countdown}`}
            </Text>
          </View>
        </Pressable>

        {/* ── Review Due ─────────────────────────────────────── */}
        {dueReviewCount > 0 && (
          <Pressable
            onPress={handleReview}
            style={({ pressed }) => ({
              backgroundColor: "#0c1317",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(96,165,250,0.3)",
              padding: 16,
              marginBottom: 10,
              opacity: pressed ? 0.9 : 1,
              flexDirection: "row",
              alignItems: "center",
            })}
          >
            <RotateCcw size={18} color="#60a5fa" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: "#60a5fa", fontSize: 15, fontWeight: "800" }}>
                Review Due
              </Text>
              <Text style={{ color: "#71717a", fontSize: 12, marginTop: 2 }}>
                {dueReviewCount} question{dueReviewCount === 1 ? "" : "s"} ready
              </Text>
            </View>
            <View style={styles.blueBadge}>
              <Text style={{ color: "#60a5fa", fontSize: 13, fontWeight: "800" }}>
                {dueReviewCount}
              </Text>
            </View>
          </Pressable>
        )}

        {/* ── Learning Hub link ──────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/learning-hub")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 14,
            marginTop: 6,
          })}
        >
          <GraduationCap size={16} color="#71717a" />
          <Text style={{ color: "#71717a", fontSize: 14 }}>
            Learning Hub · Mastery Paths · Stats
          </Text>
        </Pressable>
      </ScrollView>

      {/* ── Footer ────────────────────────────────────────────── */}
      <View
        style={{
          paddingBottom: 20,
          paddingTop: 6,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <BookOpen size={12} color="#52525b" />
        <Text style={{ color: "#52525b", fontSize: 11 }}>
          2,055 statements · Powered by the councils
        </Text>
      </View>
    </SafeAreaView>
  );
}

function IconButton({
  onPress,
  icon,
}: {
  onPress: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        backgroundColor: "#18181b",
        borderWidth: 1,
        borderColor: "#27272a",
        borderRadius: 999,
        padding: 8,
      })}
    >
      {icon}
    </Pressable>
  );
}

const styles = {
  card: {
    backgroundColor: "#111113",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 14,
    marginBottom: 10,
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(245,158,11,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(245,158,11,0.35)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  xpPill: {
    backgroundColor: "rgba(245,158,11,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  blueBadge: {
    backgroundColor: "rgba(96,165,250,0.2)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
};
