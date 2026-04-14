import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react-native";
import { useGame } from "../src/context";
import { fetchExplanation, getApiKey } from "../src/claudeApi";
import { useGamification } from "../src/gamification/context";
import { XPNotificationLayer } from "../components/XPNotification";
import { LevelProgress } from "../components/LevelProgress";
import { HeartsDisplay } from "../components/HeartsDisplay";
import { playCorrect, playWrong } from "../src/sound";
import { getQuestionDifficulty, DIFFICULTY_CONFIG } from "../src/difficulty";

export default function ExplanationScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const { recordAnswer, data: gData, hearts } = useGamification();

  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const recorded = useRef(false);

  // Abort the fetch if the user navigates away before it finishes.
  const abortRef = useRef<AbortController | null>(null);

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
      recordAnswer(wasCorrect, wasHeresy, state.score.streak, currentQuestion.id);

      // Sound feedback
      if (wasCorrect) {
        playCorrect();
      } else {
        playWrong();
      }
    }
  }, [state.isCorrect]);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    loadExplanation(controller.signal);
    return () => controller.abort();
  }, []);

  const loadExplanation = async (signal: AbortSignal) => {
    if (!currentQuestion || state.isCorrect === null || !state.userChoice)
      return;

    // Use the built-in explanation if available.
    if (currentQuestion.explanation) {
      setExplanation(currentQuestion.explanation);
      setLoading(false);
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        if (!signal.aborted) {
          setApiError(
            "No API key found. Tap below to add your Anthropic key in Settings."
          );
          setLoading(false);
        }
        return;
      }

      const text = await fetchExplanation(
        currentQuestion,
        state.isCorrect,
        state.userChoice,
        state.selectedHeresy,
        apiKey,
        signal
      );

      if (!signal.aborted) {
        setExplanation(text);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (!signal.aborted) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setApiError(msg);
        setLoading(false);
      }
    }
  };

  const handleNext = () => {
    abortRef.current?.abort();
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

          {loading ? (
            <View className="items-center py-8" style={{ gap: 14 }}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text className="text-zinc-400 text-base text-center">
                Consulting the ancient councils…
              </Text>
            </View>
          ) : apiError ? (
            <View style={{ gap: 10 }}>
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <AlertTriangle size={18} color="#fbbf24" />
                <Text className="text-amber-400 text-sm font-semibold">
                  Explanation unavailable
                </Text>
              </View>
              <Text className="text-zinc-400 text-sm leading-relaxed">
                {apiError}
              </Text>
              <Pressable
                onPress={() => router.push("/settings")}
                className="flex-row items-center mt-1"
                style={{ gap: 4 }}
              >
                <ExternalLink size={14} color="#f59e0b" />
                <Text className="text-amber-400 text-sm">
                  Go to Settings
                </Text>
              </Pressable>
            </View>
          ) : (
            <Text className="text-zinc-200 text-base leading-relaxed">
              {explanation}
            </Text>
          )}
        </View>

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
