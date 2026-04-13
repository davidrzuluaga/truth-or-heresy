import { View, Text } from "react-native";
import { Flame } from "lucide-react-native";
import { useGamification } from "../src/gamification/context";
import {
  STREAK_MULTIPLIER_THRESHOLD,
  DAILY_QUESTION_GOAL,
} from "../src/gamification/types";

interface StreakCounterProps {
  size?: "small" | "large";
}

/**
 * Duolingo-style flame streak counter.
 * Shows day count + multiplier status when active.
 */
export function StreakCounter({ size = "small" }: StreakCounterProps) {
  const { data } = useGamification();
  const { dailyStreak, questionsToday } = data;
  const isLarge = size === "large";

  const hasMultiplier = dailyStreak >= STREAK_MULTIPLIER_THRESHOLD;
  const active = dailyStreak > 0;
  const dailyProgress = Math.min(questionsToday / DAILY_QUESTION_GOAL, 1);

  if (isLarge) {
    return (
      <View style={{ alignItems: "center" }}>
        {/* Big flame */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: active
              ? "rgba(245,158,11,0.15)"
              : "rgba(63,63,70,0.3)",
            borderWidth: 2,
            borderColor: active
              ? "rgba(245,158,11,0.4)"
              : "rgba(63,63,70,0.4)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Flame
            size={40}
            color={active ? "#f59e0b" : "#52525b"}
            fill={active ? "#f59e0b" : "transparent"}
          />
        </View>

        <Text
          style={{
            color: active ? "#fbbf24" : "#71717a",
            fontSize: 32,
            fontWeight: "900",
          }}
        >
          {dailyStreak}
        </Text>
        <Text
          style={{
            color: active ? "#d97706" : "#52525b",
            fontSize: 13,
            fontWeight: "600",
            marginTop: 2,
          }}
        >
          {dailyStreak === 1 ? "day streak" : "day streak"}
        </Text>

        {hasMultiplier && (
          <View
            style={{
              backgroundColor: "rgba(245,158,11,0.15)",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 4,
              marginTop: 8,
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.3)",
            }}
          >
            <Text
              style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700" }}
            >
              ×2 XP Active!
            </Text>
          </View>
        )}

        {/* Daily progress */}
        <View style={{ marginTop: 12, alignItems: "center" }}>
          <View
            style={{
              width: 100,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#27272a",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${dailyProgress * 100}%` as any,
                height: 4,
                borderRadius: 2,
                backgroundColor: dailyProgress >= 1 ? "#4ade80" : "#f59e0b",
              }}
            />
          </View>
          <Text
            style={{
              color: "#71717a",
              fontSize: 11,
              marginTop: 4,
            }}
          >
            {questionsToday}/{DAILY_QUESTION_GOAL} today
          </Text>
        </View>
      </View>
    );
  }

  // Small inline version
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Flame
        size={16}
        color={active ? "#f59e0b" : "#52525b"}
        fill={active ? "#f59e0b" : "transparent"}
      />
      <Text
        style={{
          color: active ? "#f59e0b" : "#71717a",
          fontSize: 16,
          fontWeight: "800",
        }}
      >
        {dailyStreak}
      </Text>
    </View>
  );
}
