import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Flame } from "lucide-react-native";
import { GameScore } from "../src/types";

interface ScoreHeaderProps {
  score: GameScore;
}

export function ScoreHeader({ score }: ScoreHeaderProps) {
  const { t } = useTranslation();
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
      <View className="items-center">
        <Text className="text-amber-400 text-xl font-bold">
          {correct}/{attempted}
        </Text>
        <Text className="text-zinc-600 text-xs mt-0.5">{t("scoreHeader.score")}</Text>
      </View>

      <View style={{ width: 1, height: 32, backgroundColor: "#27272a" }} />

      <View className="items-center">
        <Text className="text-amber-400 text-xl font-bold">{pct}%</Text>
        <Text className="text-zinc-600 text-xs mt-0.5">
          {t("scoreHeader.accuracy")}
        </Text>
      </View>

      <View style={{ width: 1, height: 32, backgroundColor: "#27272a" }} />

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
        <Text className="text-zinc-600 text-xs mt-0.5">{t("scoreHeader.streak")}</Text>
      </View>
    </View>
  );
}
