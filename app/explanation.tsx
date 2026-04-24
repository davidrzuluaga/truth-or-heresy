import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  Crown,
} from "lucide-react-native";
import { useGame } from "../src/context";
import { useGamification } from "../src/gamification/context";
import { usePremium } from "../src/premium";
import { getMasteryPathForQuestion } from "../src/gamification/mastery";
import { XPNotificationLayer } from "../components/XPNotification";
import { LevelProgress } from "../components/LevelProgress";
import { HeartsDisplay } from "../components/HeartsDisplay";
import { playCorrect, playWrong } from "../src/sound";
import { getQuestionDifficulty, DIFFICULTY_CONFIG } from "../src/difficulty";

export default function ExplanationScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const { recordAnswer, data: gData, hearts } = useGamification();
  const { isPremium } = usePremium();

  // Upsell: if this question belongs to a locked path (and we're not already
  // in sample mode), show a subtle banner pointing to the paywall.
  const questionPath = currentQuestion
    ? getMasteryPathForQuestion(currentQuestion.id)
    : null;
  const showLockedPathUpsell =
    !isPremium &&
    !state.samplePathId &&
    questionPath !== null &&
    questionPath.isFree !== true;

  const recorded = useRef(false);

  // Record XP for this answer (once) + play sound
  useEffect(() => {
    if (
      !recorded.current &&
      currentQuestion &&
      state.isCorrect !== null &&
      state.userChoice
    ) {
      recorded.current = true;
      const wasCorrect = state.isCorrect;
      const wasHeresy =
        state.userChoice === "heresy" && wasCorrect && !currentQuestion.isTruth;
      recordAnswer(wasCorrect, wasHeresy, state.score.streak, currentQuestion.id, !!state.samplePathId);

      // Sound feedback
      if (wasCorrect) {
        playCorrect();
      } else {
        playWrong();
      }
    }
  }, [state.isCorrect]);

  const handleNext = () => {
    dispatch({ type: "NEXT_QUESTION" });
    router.navigate("/quiz");
  };

  const isCorrect = state.isCorrect;
  const q = currentQuestion;
  const difficulty = q ? getQuestionDifficulty(q) : null;
  const diffConfig = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      {/* XP floating notifications */}
      <XPNotificationLayer />

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Result Banner ──────────────────────────────────────────────── */}
        <View
          style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isCorrect ? "#166534" : "#7f1d1d",
            backgroundColor: isCorrect
              ? "rgba(22,101,52,0.2)"
              : "rgba(127,29,29,0.25)",
            padding: 20,
            marginBottom: 20,
          }}
        >
          <View
            className="flex-row items-center mb-2"
            style={{ gap: 10 }}
          >
            {isCorrect ? (
              <CheckCircle size={32} color="#4ade80" />
            ) : (
              <XCircle size={32} color="#f87171" />
            )}
            <Text
              className="text-2xl font-bold"
              style={{ color: isCorrect ? "#4ade80" : "#f87171" }}
            >
              {isCorrect ? "Correct!" : "Heresy Detected!"}
            </Text>
          </View>
          <Text
            className="text-base leading-relaxed"
            style={{ color: isCorrect ? "#86efac" : "#fca5a5" }}
          >
            {q?.isTruth
              ? "This statement is solid orthodox teaching — a Truth!"
              : q?.correctHeresy
              ? `This is the heresy of ${q.correctHeresy}.`
              : "This statement is heretical!"}
          </Text>
          {!isCorrect && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                backgroundColor: "rgba(239,68,68,0.1)",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                alignSelf: "flex-start",
              }}
            >
              <HeartsDisplay hearts={hearts} showCount={true} size="small" pulse={false} />
              <Text style={{ color: "#f87171", fontSize: 12, fontWeight: "700" }}>
                -1 Heart
              </Text>
            </View>
          )}
          {!isCorrect && state.userChoice === "heresy" && state.selectedHeresy && state.selectedHeresy !== q?.correctHeresy && (
            <Text className="text-zinc-400 text-sm mt-2">
              You named <Text className="text-red-400 font-semibold">{state.selectedHeresy}</Text> — close,{" "}
              but the answer was{" "}
              <Text className="text-amber-400 font-semibold">{q?.correctHeresy}</Text>.
            </Text>
          )}
        </View>

        {/* ── The Statement ──────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: "#111113",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text className="text-zinc-500 text-xs uppercase tracking-widest">
              The Statement
            </Text>
            {diffConfig && (
              <View
                style={{
                  backgroundColor: `${diffConfig.color}15`,
                  borderRadius: 9999,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderWidth: 1,
                  borderColor: `${diffConfig.color}30`,
                }}
              >
                <Text style={{ color: diffConfig.color, fontSize: 10, fontWeight: "700" }}>
                  {diffConfig.icon} {diffConfig.label}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-zinc-300 text-base leading-relaxed italic">
            "{q?.statement}"
          </Text>
        </View>

        {/* ── Explanation Card ───────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: "#111113",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-4">
            The Council Weighs In
          </Text>

          <Text className="text-zinc-200 text-base leading-relaxed">
            {q?.explanation}
          </Text>
        </View>

        {/* ── Locked path upsell ─────────────────────────────────────────── */}
        {showLockedPathUpsell && questionPath && (
          <Pressable
            onPress={() => router.push("/paywall" as any)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: "rgba(245,158,11,0.08)",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.25)",
              padding: 14,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            })}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(245,158,11,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Crown size={18} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fbbf24", fontSize: 13, fontWeight: "700" }}>
                {questionPath.icon} From {questionPath.name}
              </Text>
              <Text style={{ color: "#a1a1aa", fontSize: 11, marginTop: 2 }}>
                Unlock this path and 10 more with Premium.
              </Text>
            </View>
            <ChevronRight size={18} color="#a1a1aa" />
          </Pressable>
        )}

        {/* ── Score snapshot + XP bar ────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: "#111113",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 16,
            marginBottom: 8,
          }}
        >
          <View className="flex-row justify-around" style={{ marginBottom: 14 }}>
            <View className="items-center">
              <Text className="text-amber-400 text-2xl font-bold">
                {state.score.correct}/{state.score.attempted}
              </Text>
              <Text className="text-zinc-500 text-xs mt-1">Score</Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#3f3f46" }} />
            <View className="items-center">
              <Text className="text-amber-400 text-2xl font-bold">
                {state.score.streak}
              </Text>
              <Text className="text-zinc-500 text-xs mt-1">Streak</Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#3f3f46" }} />
            <View className="items-center">
              <Text className="text-amber-400 text-2xl font-bold">
                {state.score.attempted > 0
                  ? Math.round(
                      (state.score.correct / state.score.attempted) * 100
                    )
                  : 0}
                %
              </Text>
              <Text className="text-zinc-500 text-xs mt-1">Accuracy</Text>
            </View>
          </View>

          {/* XP Progress */}
          <LevelProgress totalXP={gData.totalXP} size="small" />
        </View>
      </ScrollView>

      {/* ── Next Question CTA ──────────────────────────────────────────────── */}
      <View className="px-5 pb-7 pt-2">
        <Pressable
          onPress={handleNext}
          className="bg-amber-500 rounded-2xl py-5 items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-zinc-950 text-xl font-bold">
              Next Question
            </Text>
            <ChevronRight size={22} color="#1c1917" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
