import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Flame,
  Clock,
  BookOpen,
  RotateCcw,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";
import { useGamification } from "../src/gamification/context";
import { useGame } from "../src/context";
import { LevelProgress } from "../components/LevelProgress";
import { StreakCounter } from "../components/StreakCounter";
import { HeartsDisplay } from "../components/HeartsDisplay";
import { MasteryCard } from "../components/MasteryCard";
import { MASTERY_PATHS } from "../src/gamification/mastery";
import { getDueReviews } from "../src/gamification/spaced";
import {
  secondsUntilReset,
  formatCountdown,
  todayStr,
} from "../src/gamification/daily";

export default function LearningHubScreen() {
  const { data, dueReviewCount, isDailyCompleted, hearts } = useGamification();
  const { dispatch } = useGame();
  const [countdown, setCountdown] = useState(formatCountdown(secondsUntilReset()));

  // Countdown timer
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

  const handleStartDaily = () => {
    dispatch({ type: "START_GAME" });
    router.push("/daily-challenge");
  };

  const handleStartReview = () => {
    dispatch({ type: "START_GAME" });
    router.push("/review");
  };

  const handleStartQuiz = () => {
    router.push("/category-select");
  };

  const handleCategorySelect = () => {
    router.push("/category-select");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats Overview ─────────────────────────────────────── */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#111113",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#27272a",
              padding: 16,
              alignItems: "center",
            }}
          >
            <LevelProgress totalXP={data.totalXP} size="large" />
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#111113",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#27272a",
              padding: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StreakCounter size="large" />
          </View>
        </View>

        {/* Hearts display */}
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

        {/* Quick stats row */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <StatPill label="Accuracy" value={`${accuracy}%`} />
          <StatPill label="Answered" value={`${data.totalAnswered}`} />
          <StatPill label="Reviews" value={`${data.reviewsCompleted}`} />
        </View>

        {/* ── Daily Challenge ────────────────────────────────────── */}
        <Pressable
          onPress={isDailyCompleted ? undefined : handleStartDaily}
          style={({ pressed }) => ({
            backgroundColor: isDailyCompleted ? "#111113" : "#1c1308",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isDailyCompleted
              ? "#27272a"
              : "rgba(245,158,11,0.4)",
            padding: 20,
            marginBottom: 12,
            opacity: pressed && !isDailyCompleted ? 0.9 : 1,
            transform: [{ scale: pressed && !isDailyCompleted ? 0.98 : 1 }],
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Sparkles
              size={22}
              color={isDailyCompleted ? "#52525b" : "#fbbf24"}
            />
            <Text
              style={{
                color: isDailyCompleted ? "#71717a" : "#fbbf24",
                fontSize: 16,
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
              <View
                style={{
                  backgroundColor: "rgba(245,158,11,0.2)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700" }}>
                  2.5× XP
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              color: isDailyCompleted ? "#52525b" : "#a1a1aa",
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            {isDailyCompleted
              ? "Come back tomorrow for a new set!"
              : "7 curated questions — earn bonus XP for today's challenge."}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Clock size={14} color="#52525b" />
            <Text style={{ color: "#52525b", fontSize: 12 }}>
              Resets in {countdown}
            </Text>
          </View>
        </Pressable>

        {/* ── Review Mode ────────────────────────────────────────── */}
        <Pressable
          onPress={dueReviewCount > 0 ? handleStartReview : undefined}
          style={({ pressed }) => ({
            backgroundColor: dueReviewCount > 0 ? "#0c1317" : "#111113",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: dueReviewCount > 0 ? "rgba(96,165,250,0.3)" : "#27272a",
            padding: 20,
            marginBottom: 12,
            opacity: pressed && dueReviewCount > 0 ? 0.9 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <RotateCcw
              size={20}
              color={dueReviewCount > 0 ? "#60a5fa" : "#52525b"}
            />
            <Text
              style={{
                color: dueReviewCount > 0 ? "#60a5fa" : "#71717a",
                fontSize: 16,
                fontWeight: "800",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Spaced Review
            </Text>
            {dueReviewCount > 0 && (
              <View
                style={{
                  backgroundColor: "rgba(96,165,250,0.2)",
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#60a5fa", fontSize: 14, fontWeight: "800" }}>
                  {dueReviewCount}
                </Text>
              </View>
            )}
          </View>
          <Text style={{ color: "#71717a", fontSize: 13 }}>
            {dueReviewCount > 0
              ? `${dueReviewCount} question${dueReviewCount === 1 ? "" : "s"} due for review`
              : "No reviews due — keep learning!"}
          </Text>
        </Pressable>

        {/* ── Free Play ──────────────────────────────────────────── */}
        <Pressable
          onPress={handleStartQuiz}
          style={({ pressed }) => ({
            backgroundColor: "#111113",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 20,
            marginBottom: 24,
            opacity: pressed ? 0.9 : 1,
            flexDirection: "row",
            alignItems: "center",
          })}
        >
          <BookOpen size={20} color="#a1a1aa" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: "#f4f4f5", fontSize: 15, fontWeight: "700" }}>
              Free Play
            </Text>
            <Text style={{ color: "#71717a", fontSize: 12, marginTop: 2 }}>
              Practice from the full 2,055-question bank
            </Text>
          </View>
          <ChevronRight size={18} color="#52525b" />
        </Pressable>

        {/* ── Mastery Paths ──────────────────────────────────────── */}
        <Text
          style={{
            color: "#f4f4f5",
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 14,
          }}
        >
          Mastery Paths
        </Text>

        {MASTERY_PATHS.map((path) => (
          <MasteryCard
            key={path.id}
            path={path}
            progress={data.masteryProgress[path.id]}
          />
        ))}

        <View style={{ height: 24 }} />
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
      <Text style={{ color: "#fbbf24", fontSize: 16, fontWeight: "800" }}>
        {value}
      </Text>
      <Text style={{ color: "#52525b", fontSize: 10, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}
