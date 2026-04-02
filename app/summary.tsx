import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Trophy, RefreshCw, Home } from "lucide-react-native";
import { useGame } from "../src/context";

type GradeKey = "S" | "A" | "B" | "C" | "F";

function getGradeKey(pct: number): GradeKey {
  if (pct >= 90) return "S";
  if (pct >= 75) return "A";
  if (pct >= 55) return "B";
  if (pct >= 35) return "C";
  return "F";
}

export default function SummaryScreen() {
  const { t } = useTranslation();
  const { state, dispatch } = useGame();
  const { correct, attempted, bestStreak } = state.score;
  const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const gradeKey = getGradeKey(pct);
  const grade = {
    letter: gradeKey,
    label: t(`summary.grades.${gradeKey}.label`),
    color:
      gradeKey === "S"
        ? "#f59e0b"
        : gradeKey === "A"
          ? "#4ade80"
          : gradeKey === "B"
            ? "#60a5fa"
            : gradeKey === "C"
              ? "#a78bfa"
              : "#f87171",
    message: t(`summary.grades.${gradeKey}.message`),
  };

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

        <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
          {t("summary.gameOver")}
        </Text>

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
              <Text className="text-zinc-500 text-sm mt-1">
                {t("summary.correct")}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#3f3f46" }} />
            <View className="items-center">
              <Text className="text-amber-400 text-3xl font-bold">
                {attempted}
              </Text>
              <Text className="text-zinc-500 text-sm mt-1">
                {t("summary.attempted")}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#3f3f46" }} />
            <View className="items-center">
              <Text className="text-amber-400 text-3xl font-bold">
                {pct}%
              </Text>
              <Text className="text-zinc-500 text-sm mt-1">
                {t("summary.accuracy")}
              </Text>
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
            <Text className="text-zinc-500 text-sm mt-1">
              {t("summary.bestStreak")}
            </Text>
          </View>
        </View>

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
            <Text className="text-zinc-950 text-xl font-bold">
              {t("summary.playAgain")}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleHome}
          className="flex-row items-center py-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, gap: 6 })}
        >
          <Home size={16} color="#71717a" />
          <Text className="text-zinc-500 text-base">{t("summary.backHome")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
