import { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import { CheckCircle, XCircle, Settings, Trophy, User } from "lucide-react-native";
import { useGame } from "../src/context";
import { useGamification } from "../src/gamification/context";
import { playTap } from "../src/sound";
import { ScoreHeader } from "../components/ScoreHeader";
import { QuestionCard } from "../components/QuestionCard";
import { LevelProgress } from "../components/LevelProgress";
import { HeartsDisplay } from "../components/HeartsDisplay";

export default function QuizScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const { data: gData, hearts } = useGamification();

  // Redirect to out-of-hearts when hearts reach 0
  useEffect(() => {
    if (hearts <= 0) {
      router.replace("/out-of-hearts" as any);
    }
  }, [hearts]);

  if (!currentQuestion) return null;

  const handleTruth = () => {
    playTap();
    dispatch({ type: "ANSWER_TRUTH" });
    router.push("/explanation");
  };

  const handleHeresy = () => {
    playTap();
    dispatch({ type: "ANSWER_HERESY" });
    // If no named heresy, skip the selector and go straight to explanation.
    if (currentQuestion.correctHeresy === null) {
      router.push("/explanation");
    } else {
      router.push("/heresy-selector");
    }
  };

  const handleEndGame = () => {
    router.push("/summary");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      {/* Inject header buttons from inside the screen */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <View className="flex-row items-center" style={{ gap: 18 }}>
              <Pressable
                onPress={() => router.push("/dashboard")}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                hitSlop={8}
              >
                <User size={21} color="#a1a1aa" />
              </Pressable>
              <Pressable
                onPress={handleEndGame}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                hitSlop={8}
              >
                <Trophy size={21} color="#a1a1aa" />
              </Pressable>
              <Pressable
                onPress={() => router.push("/settings")}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                hitSlop={8}
              >
                <Settings size={21} color="#a1a1aa" />
              </Pressable>
            </View>
          ),
        }}
      />

      {/* Hearts + Score strip */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 6 }}>
        <HeartsDisplay hearts={hearts} showCount={false} size="small" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <ScoreHeader score={state.score} />
        </View>
      </View>

      {/* XP progress bar under score */}
      <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 2 }}>
        <LevelProgress totalXP={gData.totalXP} size="small" />
      </View>

      {/* Question */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          statement={currentQuestion.statement}
          questionNumber={state.score.attempted + 1}
        />
      </ScrollView>

      {/* Action buttons */}
      <View className="px-5 pb-7" style={{ gap: 12 }}>
        {/* TRUTH */}
        <Pressable
          onPress={handleTruth}
          className="bg-amber-500 rounded-2xl py-5 items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <CheckCircle size={24} color="#1c1917" />
            <Text className="text-zinc-950 text-xl font-bold">Truth</Text>
          </View>
          <Text className="text-zinc-800 text-sm mt-1">
            This is orthodox doctrine
          </Text>
        </Pressable>

        {/* HERESY */}
        <Pressable
          onPress={handleHeresy}
          className="rounded-2xl py-5 items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            backgroundColor: pressed ? "#7f1d1d" : "#450a0a",
            borderWidth: 1,
            borderColor: "#991b1b",
          })}
        >
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <XCircle size={24} color="#fca5a5" />
            <Text className="text-red-200 text-xl font-bold">Heresy!</Text>
          </View>
          <Text className="text-red-500 text-sm mt-1">
            This contradicts the faith
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
