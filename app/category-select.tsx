import { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Shuffle, ChevronRight } from "lucide-react-native";
import { useGame } from "../src/context";
import { useGamification } from "../src/gamification/context";
import { MASTERY_PATHS, MasteryPath } from "../src/gamification/mastery";
import { QUESTIONS } from "../src/questions";
import {
  getDifficultyDistribution,
  getQuestionDifficulty,
  Difficulty,
  DIFFICULTY_CONFIG,
} from "../src/difficulty";

export default function CategorySelectScreen() {
  const { dispatch } = useGame();
  const { data, hearts } = useGamification();

  // Redirect to out-of-hearts if no hearts left
  useEffect(() => {
    if (hearts <= 0) {
      router.replace("/out-of-hearts" as any);
    }
  }, [hearts]);
  const accuracy =
    data.totalAnswered > 0 ? data.totalCorrect / data.totalAnswered : 0;

  const handleAll = () => {
    dispatch({
      type: "START_GAME",
      accuracy,
      totalAnswered: data.totalAnswered,
    });
    router.replace("/quiz");
  };

  const handleCategory = (path: MasteryPath) => {
    // Filter questions to only this mastery path's range
    const ids: number[] = [];
    for (let i = path.questionRange[0]; i <= path.questionRange[1]; i++) {
      ids.push(i);
    }
    dispatch({
      type: "START_GAME",
      accuracy,
      totalAnswered: data.totalAnswered,
      filterQuestionIds: ids,
    });
    router.replace("/quiz");
  };

  const handleDifficulty = (diff: Difficulty) => {
    const ids = QUESTIONS.filter(
      (q) => getQuestionDifficulty(q) === diff,
    ).map((q) => q.id);
    dispatch({
      type: "START_GAME",
      accuracy,
      totalAnswered: data.totalAnswered,
      filterQuestionIds: ids,
    });
    router.replace("/quiz");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* All Questions option */}
        <Pressable
          onPress={handleAll}
          style={({ pressed }) => ({
            backgroundColor: "#1c1308",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(245,158,11,0.4)",
            padding: 20,
            marginBottom: 20,
            opacity: pressed ? 0.9 : 1,
            flexDirection: "row",
            alignItems: "center",
          })}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(245,158,11,0.15)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}
          >
            <Shuffle size={22} color="#fbbf24" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fbbf24",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              All Questions
            </Text>
            <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 2 }}>
              Random mix from all 2,055 statements
            </Text>
          </View>
          <ChevronRight size={18} color="#fbbf24" />
        </Pressable>

        {/* Difficulty Filters */}
        <Text
          style={{
            color: "#f4f4f5",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          By Difficulty
        </Text>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
          {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => {
            const config = DIFFICULTY_CONFIG[diff];
            const dist = getDifficultyDistribution(QUESTIONS);
            return (
              <Pressable
                key={diff}
                onPress={() => handleDifficulty(diff)}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: "#111113",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: `${config.color}30`,
                  padding: 16,
                  alignItems: "center",
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <Text style={{ fontSize: 24, marginBottom: 6 }}>
                  {config.icon}
                </Text>
                <Text
                  style={{
                    color: config.color,
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  {config.label}
                </Text>
                <Text
                  style={{ color: "#71717a", fontSize: 11, marginTop: 4 }}
                >
                  {dist[diff]} Qs
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Mastery Paths */}
        <Text
          style={{
            color: "#f4f4f5",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          By Topic
        </Text>

        {MASTERY_PATHS.map((path) => {
          const progress = data.masteryProgress[path.id];
          const correct = progress?.correct ?? 0;
          const pct =
            path.totalQuestions > 0
              ? Math.round((correct / path.totalQuestions) * 100)
              : 0;

          return (
            <Pressable
              key={path.id}
              onPress={() => handleCategory(path)}
              style={({ pressed }) => ({
                backgroundColor: "#111113",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#27272a",
                padding: 16,
                marginBottom: 10,
                opacity: pressed ? 0.9 : 1,
                flexDirection: "row",
                alignItems: "center",
              })}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor:
                    pct > 0
                      ? "rgba(245,158,11,0.12)"
                      : "rgba(39,39,42,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor:
                    pct > 0 ? "rgba(245,158,11,0.25)" : "#27272a",
                }}
              >
                <Text style={{ fontSize: 18 }}>{path.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  {path.name}
                </Text>
                <Text
                  style={{ color: "#71717a", fontSize: 11, marginTop: 2 }}
                >
                  {path.description}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: "#a1a1aa",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {path.totalQuestions} Qs
                </Text>
                {pct > 0 && (
                  <Text
                    style={{
                      color: "#fbbf24",
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    {pct}% mastered
                  </Text>
                )}
              </View>

              <ChevronRight
                size={16}
                color="#52525b"
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
