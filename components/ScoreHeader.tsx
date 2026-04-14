import { memo } from "react";
import { View, Text } from "react-native";
import { Flame } from "lucide-react-native";
import { GameScore } from "../src/types";

interface ScoreHeaderProps {
  score: GameScore;
}

/**
 * Compact score strip shown at the top of the Quiz screen.
 * Shows: Score  |  Accuracy  |  🔥 Streak
 */
export const ScoreHeader = memo(function ScoreHeader({ score }: ScoreHeaderProps) {
  const { correct, attempted, streak } = score;
  const pct =
    attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const streakActive = streak >= 2;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: "rgba(17,17,19,0.9)",
        borderBottomWidth: 1,
        borderBottomColor: "#1f1f23",
      }}
    >
      {/* Score */}
      <View className="items-center">
        <Text className="text-amber-400 text-xl font-bold">
          {correct}/{attempted}
        </Text>
        <Text className="text-zinc-600 text-xs mt-0.5">Score</Text>
      </View>

      {/* Divider */}
      <View style={{ width: 1, height: 32, backgroundColor: "#27272a" }} />

      {/* Accuracy */}
      <View className="items-center">
        <Text className="text-amber-400 text-xl font-bold">{pct}%</Text>
        <Text className="text-zinc-600 text-xs mt-0.5">Accuracy</Text>
      </View>

      {/* Divider */}
      <View style={{ width: 1, height: 32, backgroundColor: "#27272a" }} />

      {/* Streak */}
      <View className="items-center">
        <View className="flex-row items-center" style={{ gap: 4 }}>
          <Flame
            size={16}
            color={streakActive ? "#f59e0b" : "#52525b"}
            fill={streakActive ? "#f59e0b" : "transparent"}
          />
          <Text
            className="text-xl font-bold"
            style={{ color: streakActive ? "#f59e0b" : "#71717a" }}
          >
            {streak}
          </Text>
        </View>
        <Text className="text-zinc-600 text-xs mt-0.5">Streak</Text>
      </View>
    </View>
  );
});
