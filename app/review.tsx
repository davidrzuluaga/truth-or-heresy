import { useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react-native";
import { useGamification } from "../src/gamification/context";
import { getDueReviews } from "../src/gamification/spaced";
import { QUESTIONS } from "../src/questions";
import { QuestionCard } from "../components/QuestionCard";
import { XPNotificationLayer } from "../components/XPNotification";
import { Question } from "../src/types";
import { playCorrect, playWrong, playTap } from "../src/sound";

type Phase = "quiz" | "result" | "complete";

export default function ReviewScreen() {
  const { data, recordReviewAnswer } = useGamification();

  // Get due review questions
  const reviewQuestions = useMemo(() => {
    const dueItems = getDueReviews(data.reviewItems);
    const qMap = new Map(QUESTIONS.map((q) => [q.id, q]));
    return dueItems
      .map((item) => qMap.get(item.questionId))
      .filter(Boolean) as Question[];
  }, []);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(
    reviewQuestions.length === 0 ? "complete" : "quiz"
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const currentQ = reviewQuestions[index];
  const total = reviewQuestions.length;

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

    recordReviewAnswer(currentQ.id, correct);
    setPhase("result");
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setPhase("complete");
    } else {
      setIndex((i) => i + 1);
      setIsCorrect(null);
      setPhase("quiz");
    }
  };

  // ── Complete / Empty ────────────────────────────────────────────────────

  if (phase === "complete") {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
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
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: "rgba(96,165,250,0.12)",
              borderWidth: 2,
              borderColor: "rgba(96,165,250,0.3)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <RotateCcw size={42} color="#60a5fa" />
          </View>

          <Text
            style={{
              color: "#60a5fa",
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {total === 0 ? "All Clear!" : "Review Complete!"}
          </Text>

          <Text
            style={{
              color: "#f4f4f5",
              fontSize: 24,
              fontWeight: "800",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {total === 0
              ? "No reviews due"
              : `${sessionCorrect}/${total} correct`}
          </Text>

          <Text
            style={{
              color: "#71717a",
              fontSize: 14,
              textAlign: "center",
              lineHeight: 21,
              marginBottom: 32,
            }}
          >
            {total === 0
              ? "Keep answering questions — wrong answers will appear here for review."
              : "Spaced repetition will schedule follow-up reviews automatically."}
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              backgroundColor: "#60a5fa",
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 44,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ color: "#09090b", fontSize: 16, fontWeight: "800" }}>
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
          {/* Progress */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 20 }}>
            {reviewQuestions.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    i < index ? "#60a5fa" : i === index ? (isCorrect ? "#4ade80" : "#f87171") : "#27272a",
                }}
              />
            ))}
          </View>

          {/* Result */}
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
                {isCorrect ? "Remembered!" : "Still tricky..."}
              </Text>
            </View>
            {!isCorrect && (
              <Text style={{ color: "#fca5a5", fontSize: 13, marginTop: 6 }}>
                This will come back for review again soon.
              </Text>
            )}
          </View>

          {/* Statement + Explanation */}
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
            <Text style={{ color: "#d4d4d8", fontSize: 15, lineHeight: 22, fontStyle: "italic" }}>
              "{currentQ.statement}"
            </Text>
          </View>

          {currentQ.explanation && (
            <View
              style={{
                backgroundColor: "#111113",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#27272a",
                padding: 16,
              }}
            >
              <Text style={{ color: "#d4d4d8", fontSize: 14, lineHeight: 21 }}>
                {currentQ.explanation}
              </Text>
            </View>
          )}
        </ScrollView>

        <View className="px-5 pb-7 pt-2">
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => ({
              backgroundColor: "#60a5fa",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              opacity: pressed ? 0.88 : 1,
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
      {/* Progress */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: 12 }}>
        {reviewQuestions.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i < index ? "#60a5fa" : i === index ? "#60a5fa" : "#27272a",
            }}
          />
        ))}
      </View>

      {/* Review badge */}
      <View style={{ alignItems: "center", marginBottom: 4 }}>
        <View
          style={{
            backgroundColor: "rgba(96,165,250,0.15)",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <RotateCcw size={14} color="#60a5fa" />
          <Text style={{ color: "#60a5fa", fontSize: 12, fontWeight: "700" }}>
            Review · {index + 1}/{total}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard statement={currentQ.statement} questionNumber={index + 1} />
      </ScrollView>

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
            <Text style={{ color: "#09090b", fontSize: 20, fontWeight: "800" }}>Truth</Text>
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
            <Text style={{ color: "#fecaca", fontSize: 20, fontWeight: "800" }}>Heresy!</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
