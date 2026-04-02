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
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react-native";
import { useGame } from "../src/context";
import { fetchExplanation, getApiKey } from "../src/claudeApi";
import { HeresyName } from "../src/types";

export default function ExplanationScreen() {
  const { t } = useTranslation();
  const { state, dispatch, currentQuestion } = useGame();

  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    loadExplanation(controller.signal);
    return () => controller.abort();
  }, []);

  const heresyDisplay = (h: HeresyName | null | undefined) =>
    h ? t(`heresies.${h}.name`) : "";

  const loadExplanation = async (signal: AbortSignal) => {
    if (!currentQuestion || state.isCorrect === null || !state.userChoice)
      return;

    setLoading(true);
    setApiError(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        if (!signal.aborted) {
          setApiError(t("explanation.noApiKey"));
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
          err instanceof Error ? err.message : t("explanation.genericError");
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

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
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
          <View className="flex-row items-center mb-2" style={{ gap: 10 }}>
            {isCorrect ? (
              <CheckCircle size={32} color="#4ade80" />
            ) : (
              <XCircle size={32} color="#f87171" />
            )}
            <Text
              className="text-2xl font-bold"
              style={{ color: isCorrect ? "#4ade80" : "#f87171" }}
            >
              {isCorrect ? t("explanation.correct") : t("explanation.wrong")}
            </Text>
          </View>
          <Text
            className="text-base leading-relaxed"
            style={{ color: isCorrect ? "#86efac" : "#fca5a5" }}
          >
            {q?.isTruth
              ? t("explanation.orthodoxLine")
              : t("explanation.heresyLine", {
                  heresy: heresyDisplay(q?.correctHeresy ?? null),
                })}
          </Text>
          {!isCorrect &&
            state.userChoice === "heresy" &&
            state.selectedHeresy &&
            state.selectedHeresy !== q?.correctHeresy && (
              <Text className="text-zinc-400 text-sm mt-2">
                {t("explanation.wrongGuess", {
                  guess: heresyDisplay(state.selectedHeresy),
                  correct: heresyDisplay(q?.correctHeresy ?? null),
                })}
              </Text>
            )}
        </View>

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
          <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
            {t("explanation.statementLabel")}
          </Text>
          <Text className="text-zinc-300 text-base leading-relaxed italic">
            "{q?.statement}"
          </Text>
        </View>

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
            {t("explanation.councilWeighs")}
          </Text>

          {loading ? (
            <View className="items-center py-8" style={{ gap: 14 }}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text className="text-zinc-400 text-base text-center">
                {t("explanation.consulting")}
              </Text>
            </View>
          ) : apiError ? (
            <View style={{ gap: 10 }}>
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <AlertTriangle size={18} color="#fbbf24" />
                <Text className="text-amber-400 text-sm font-semibold">
                  {t("explanation.explanationUnavailable")}
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
                  {t("explanation.goToSettings")}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Text className="text-zinc-200 text-base leading-relaxed">
              {explanation}
            </Text>
          )}
        </View>

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
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-amber-400 text-2xl font-bold">
                {state.score.correct}/{state.score.attempted}
              </Text>
              <Text className="text-zinc-500 text-xs mt-1">
                {t("explanation.score")}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#3f3f46" }} />
            <View className="items-center">
              <Text className="text-amber-400 text-2xl font-bold">
                🔥 {state.score.streak}
              </Text>
              <Text className="text-zinc-500 text-xs mt-1">
                {t("explanation.streak")}
              </Text>
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
              <Text className="text-zinc-500 text-xs mt-1">
                {t("explanation.accuracy")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
              {t("explanation.nextQuestion")}
            </Text>
            <ChevronRight size={22} color="#1c1917" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
