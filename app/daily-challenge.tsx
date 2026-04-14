import { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CheckCircle, XCircle, ChevronRight, Sparkles } from "lucide-react-native";
import { useGamification } from "../src/gamification/context";
import { getDailyChallengeQuestions, todayStr } from "../src/gamification/daily";
import { QuestionCard } from "../components/QuestionCard";
import { XPNotificationLayer } from "../components/XPNotification";
import { HeartsDisplay } from "../components/HeartsDisplay";
import { Confetti } from "../components/Confetti";
import { Question } from "../src/types";
import { playCorrect, playWrong, playTap, playLevelUp } from "../src/sound";

type Phase = "quiz" | "result" | "complete";

export default function DailyChallengeScreen() {
  const { recordDailyAnswer, completeDailyChallenge, isDailyCompleted, hearts } =
    useGamification();

  const questions = useMemo(() => getDailyChallengeQuestions(todayStr()), []);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(isDailyCompleted ? "complete" : "quiz");

  // Redirect to out-of-hearts if hearts reach 0 during the challenge
  useEffect(() => {
    if (hearts <= 0 && phase !== "complete") {
      router.replace("/out-of-hearts" as any);
    }
  }, [hearts, phase]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQ: Question | undefined = questions[index];
  const total = questions.length;

  const handleAnswer = (choice: "truth" | "heresy") => {
    if (!currentQ) return;
    playTap();
    const correct =
      choice === "truth" ? currentQ.isTruth : !currentQ.isTruth;
    setIsCorrect(correct);
    if (correct) setSessionCorrect((p) => p + 1);

    // Sound feedback
    setTimeout(() => {
      if (correct) playCorrect(); else playWrong();
    }, 100);

    recordDailyAnswer(correct, choice === "heresy" && correct, currentQ.id);
    setPhase("result");
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      // All done
      completeDailyChallenge();
      setShowConfetti(true);
      playLevelUp();
      setPhase("complete");
    } else {
      setIndex((i) => i + 1);
      setIsCorrect(null);
      setPhase("quiz");
    }
  };

  // ── Already completed ───────────────────────────────────────────────────

  if (phase === "complete") {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
        <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(245,158,11,0.12)",
              borderWidth: 2,
              borderColor: "rgba(245,158,11,0.35)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Sparkles size={48} color="#fbbf24" />
          </View>

          <Text
            style={{
              color: "#fbbf24",
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Daily Challenge Complete!
          </Text>

          <Text
            style={{
              color: "#f4f4f5",
              fontSize: 32,
              fontWeight: "900",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {sessionCorrect}/{total}
          </Text>

          <Text
            style={{
              color: "#a1a1aa",
              fontSize: 15,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 36,
            }}
          >
            {sessionCorrect === total
              ? "Perfect! You nailed every question today."
              : "Great work! Come back tomorrow for a new set."}
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              backgroundColor: "#f59e0b",
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 48,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ color: "#09090b", fontSize: 17, fontWeight: "800" }}>
              Done
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Result phase ────────────────────────────────────────────────────────

  if (phase === "result" && currentQ) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
        <XPNotificationLayer />
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress dots */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {questions.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    i < index
                      ? "#4ade80"
                      : i === index
                      ? isCorrect
                        ? "#4ade80"
                        : "#f87171"
                      : "#27272a",
                }}
              />
            ))}
          </View>

          {/* Result banner */}
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {isCorrect ? (
                <CheckCircle size={28} color="#4ade80" />
              ) : (
                <XCircle size={28} color="#f87171" />
              )}
              <Text
                style={{
                  color: isCorrect ? "#4ade80" : "#f87171",
                  fontSize: 22,
                  fontWeight: "800",
                }}
              >
                {isCorrect ? "Correct!" : "Wrong!"}
              </Text>
            </View>
          </View>

          {/* Statement */}
          <View
            style={{
              backgroundColor: "#111113",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#27272a",
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#71717a", fontSize: 11, letterSpacing: 1.5, marginBottom: 8 }}>
              THE STATEMENT
            </Text>
            <Text
              style={{
                color: "#d4d4d8",
                fontSize: 15,
                lineHeight: 22,
                fontStyle: "italic",
              }}
            >
              "{currentQ.statement}"
            </Text>
          </View>

          {/* Explanation */}
          {currentQ.explanation && (
            <View
              style={{
                backgroundColor: "#111113",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#27272a",
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#71717a", fontSize: 11, letterSpacing: 1.5, marginBottom: 8 }}>
                EXPLANATION
              </Text>
              <Text style={{ color: "#d4d4d8", fontSize: 14, lineHeight: 21 }}>
                {currentQ.explanation}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Next button */}
        <View className="px-5 pb-7 pt-2">
          <Pressable
            onPress={handleNext}
            className="bg-amber-500 rounded-2xl py-5 items-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.88 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ color: "#09090b", fontSize: 18, fontWeight: "800" }}>
                {index + 1 >= total ? "Finish" : "Next"}
              </Text>
              <ChevronRight size={20} color="#1c1917" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Quiz phase ──────────────────────────────────────────────────────────

  if (!currentQ) return null;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      {/* Progress dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
          paddingVertical: 12,
        }}
      >
        {questions.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i < index ? "#4ade80" : i === index ? "#f59e0b" : "#27272a",
            }}
          />
        ))}
      </View>

      {/* Daily badge + hearts */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <HeartsDisplay hearts={hearts} showCount={false} size="small" />
        <View
          style={{
            backgroundColor: "rgba(245,158,11,0.15)",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={14} color="#fbbf24" />
          <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700" }}>
            Daily Challenge · 2.5× XP
          </Text>
        </View>
      </View>

      {/* Question */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          statement={currentQ.statement}
          questionNumber={index + 1}
        />
      </ScrollView>

      {/* Buttons */}
      <View className="px-5 pb-7" style={{ gap: 12 }}>
        <Pressable
          onPress={() => handleAnswer("truth")}
          className="bg-amber-500 rounded-2xl py-5 items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <CheckCircle size={24} color="#1c1917" />
            <Text style={{ color: "#09090b", fontSize: 20, fontWeight: "800" }}>
              Truth
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => handleAnswer("heresy")}
          className="rounded-2xl py-5 items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            backgroundColor: pressed ? "#7f1d1d" : "#450a0a",
            borderWidth: 1,
            borderColor: "#991b1b",
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <XCircle size={24} color="#fca5a5" />
            <Text style={{ color: "#fecaca", fontSize: 20, fontWeight: "800" }}>
              Heresy!
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
