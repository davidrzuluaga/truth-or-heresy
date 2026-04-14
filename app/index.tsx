import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Flame,
  BookOpen,
  Settings,
  User,
  Sparkles,
  RotateCcw,
  GraduationCap,
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

  const accuracy = data.totalAnswered > 0 ? data.totalCorrect / data.totalAnswered : 0;

  const handleStart = () => {
    if (outOfHearts) {
      router.push("/out-of-hearts" as any);
      return;
    }
    dispatch({ type: "START_GAME", accuracy, totalAnswered: data.totalAnswered });
    router.push("/quiz");
  };

  const handleDaily = () => {
    if (outOfHearts) {
      router.push("/out-of-hearts" as any);
      return;
    }
    dispatch({ type: "START_GAME", accuracy, totalAnswered: data.totalAnswered });
    router.push("/daily-challenge");
  };

  const handleReview = () => {
    dispatch({ type: "START_GAME", accuracy, totalAnswered: data.totalAnswered });
    router.push("/review");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Top bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <HeartsDisplay hearts={hearts} showCount={false} size="small" />
          <Pressable
            onPress={() => router.push("/dashboard")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            })}
          >
            <StreakCounter size="small" />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => router.push("/learning-hub")}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <GraduationCap size={20} color="#a1a1aa" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/dashboard")}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <User size={20} color="#a1a1aa" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/settings")}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Settings size={20} color="#a1a1aa" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={{ alignItems: "center", paddingTop: 24, paddingBottom: 16 }}>
          <View className="bg-amber-500/15 border border-amber-500/30 rounded-full p-5 mb-6">
            <Flame size={48} color="#f59e0b" />
          </View>

          <Text className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">
            The Theology Quiz
          </Text>

          <Text className="text-white text-4xl font-bold text-center leading-tight mb-3">
            Truth or{"\n"}Heresy?
          </Text>

          <Text className="text-zinc-400 text-base text-center leading-relaxed mb-4">
            Spot true doctrine from ancient errors
          </Text>
        </View>

        {/* Level + XP */}
        {data.totalXP > 0 && (
          <View
            style={{
              backgroundColor: "#111113",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#27272a",
              padding: 16,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(245,158,11,0.12)",
                borderWidth: 1.5,
                borderColor: "rgba(245,158,11,0.35)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fbbf24", fontSize: 18, fontWeight: "900" }}>
                {level}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <LevelProgress totalXP={data.totalXP} size="small" />
            </View>
          </View>
        )}

        {/* Daily Challenge Card */}
        <Pressable
          onPress={isDailyCompleted ? undefined : handleDaily}
          style={({ pressed }) => ({
            backgroundColor: isDailyCompleted ? "#111113" : "#1c1308",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isDailyCompleted ? "#27272a" : "rgba(245,158,11,0.4)",
            padding: 18,
            marginBottom: 10,
            opacity: pressed && !isDailyCompleted ? 0.92 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <Sparkles size={20} color={isDailyCompleted ? "#52525b" : "#fbbf24"} />
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
              <View
                style={{
                  backgroundColor: "rgba(245,158,11,0.2)",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fbbf24", fontSize: 11, fontWeight: "700" }}>
                  2.5× XP
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Clock size={12} color="#52525b" />
            <Text style={{ color: "#52525b", fontSize: 11 }}>
              {isDailyCompleted ? "Come back tomorrow!" : `Resets in ${countdown}`}
            </Text>
          </View>
        </Pressable>

        {/* Review Card */}
        {dueReviewCount > 0 && (
          <Pressable
            onPress={handleReview}
            style={({ pressed }) => ({
              backgroundColor: "#0c1317",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(96,165,250,0.3)",
              padding: 18,
              marginBottom: 10,
              opacity: pressed ? 0.92 : 1,
              flexDirection: "row",
              alignItems: "center",
            })}
          >
            <RotateCcw size={20} color="#60a5fa" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: "#60a5fa", fontSize: 15, fontWeight: "800" }}>
                Review Due
              </Text>
              <Text style={{ color: "#71717a", fontSize: 12, marginTop: 2 }}>
                {dueReviewCount} question{dueReviewCount === 1 ? "" : "s"} to review
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(96,165,250,0.2)",
                width: 26,
                height: 26,
                borderRadius: 13,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#60a5fa", fontSize: 13, fontWeight: "800" }}>
                {dueReviewCount}
              </Text>
            </View>
          </Pressable>
        )}

        {/* Main CTA */}
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => ({
            backgroundColor: outOfHearts ? "#27272a" : "#f59e0b",
            borderRadius: 16,
            width: "100%",
            paddingVertical: 20,
            alignItems: "center" as const,
            marginBottom: 12,
            marginTop: 6,
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Text
            style={{
              color: outOfHearts ? "#71717a" : "#09090b",
              fontSize: 20,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            {outOfHearts ? "Out of Hearts" : "Start Quiz"}
          </Text>
          {outOfHearts && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 4,
              }}
            >
              <Clock size={12} color="#ef4444" />
              <Text style={{ color: "#ef4444", fontSize: 12, fontWeight: "600" }}>
                Refills in {heartCountdown}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Learning Hub link */}
        <Pressable
          onPress={() => router.push("/learning-hub")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingVertical: 10,
          })}
        >
          <GraduationCap size={16} color="#71717a" />
          <Text style={{ color: "#71717a", fontSize: 14 }}>
            Learning Hub · Mastery Paths
          </Text>
        </Pressable>
      </ScrollView>

      {/* Footer */}
      <View className="pb-6 items-center">
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <BookOpen size={13} color="#52525b" />
          <Text className="text-zinc-600 text-xs">
            2,055 statements · Powered by the councils
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
