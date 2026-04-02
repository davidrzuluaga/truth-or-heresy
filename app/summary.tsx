import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Trophy, RefreshCw, Home } from "lucide-react-native";
import { useGame } from "../src/context";

// ─── Grade config ─────────────────────────────────────────────────────────────

function getGrade(pct: number): {
  letter: string;
  label: string;
  color: string;
  message: string;
} {
  if (pct >= 90)
    return {
      letter: "S",
      label: "Council-Worthy!",
      color: "#f59e0b",
      message:
        "The ancient councils would have you as a delegate. Nicaea would not be complete without you.",
    };
  if (pct >= 75)
    return {
      letter: "A",
      label: "Solid Theologian!",
      color: "#4ade80",
      message:
        "Augustine would give you a nod. A few more pages of Athanasius and you'll be unstoppable.",
    };
  if (pct >= 55)
    return {
      letter: "B",
      label: "Promising Student!",
      color: "#60a5fa",
      message:
        "You know your way around a creed, but a couple of heresies slipped past the guards.",
    };
  if (pct >= 35)
    return {
      letter: "C",
      label: "Keep Studying!",
      color: "#a78bfa",
      message:
        "The heresies are winning. They're clever, ancient, and slightly better at this than you were today.",
    };
  return {
    letter: "F",
    label: "Heresy Suspect…",
    color: "#f87171",
    message:
      "Alarming. Arius himself couldn't have done worse. Try reading the Nicene Creed before your next attempt.",
  };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SummaryScreen() {
  const { state, dispatch } = useGame();
  const { correct, attempted, bestStreak } = state.score;
  const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const grade = getGrade(pct);

  const handlePlayAgain = () => {
    dispatch({ type: "START_GAME" });
    router.replace("/quiz");
  };

  const handleHome = () => {
    dispatch({ type: "START_GAME" });
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 28,
          paddingVertical: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Trophy badge */}
        <View
          style={{
            backgroundColor: "rgba(245,158,11,0.12)",
            borderRadius: 9999,
            padding: 24,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: "rgba(245,158,11,0.25)",
          }}
        >
          <Trophy size={60} color="#f59e0b" />
        </View>

        {/* Eyebrow */}
        <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
          Game Over
        </Text>

        {/* Grade */}
        <Text
          className="text-7xl font-bold mb-2"
          style={{ color: grade.color }}
        >
          {grade.letter}
        </Text>
        <Text
          className="text-xl font-bold mb-4"
          style={{ color: grade.color }}
        >
          {grade.label}
        </Text>
        <Text className="text-zinc-400 text-sm text-center leading-relaxed mb-10 px-2">
          {grade.message}
        </Text>

        {/* Stats card */}
        <View
          className="w-full"
          style={{
            backgroundColor: "#111113",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 24,
            marginBottom: 32,
          }}
        >
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-amber-400 text-3xl font-bold">
                {correct}
              </Text>
              <Text className="text-zinc-500 text-sm mt-1">Correct</Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#3f3f46" }} />
            <View className="items-center">
              <Text className="text-amber-400 text-3xl font-bold">
                {attempted}
              </Text>
              <Text className="text-zinc-500 text-sm mt-1">Attempted</Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#3f3f46" }} />
            <View className="items-center">
              <Text className="text-amber-400 text-3xl font-bold">
                {pct}%
              </Text>
              <Text className="text-zinc-500 text-sm mt-1">Accuracy</Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#27272a",
              marginTop: 20,
              marginBottom: 16,
            }}
          />

          <View className="items-center">
            <Text className="text-amber-400 text-3xl font-bold">
              🔥 {bestStreak}
            </Text>
            <Text className="text-zinc-500 text-sm mt-1">Best Streak</Text>
          </View>
        </View>

        {/* CTAs */}
        <Pressable
          onPress={handlePlayAgain}
          className="w-full rounded-2xl py-5 items-center mb-4 bg-amber-500"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <RefreshCw size={22} color="#1c1917" />
            <Text className="text-zinc-950 text-xl font-bold">Play Again</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleHome}
          className="flex-row items-center py-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, gap: 6 })}
        >
          <Home size={16} color="#71717a" />
          <Text className="text-zinc-500 text-base">Back to Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
