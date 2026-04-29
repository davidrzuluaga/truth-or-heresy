import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import {
  getLevelFromXP,
  getXPInCurrentLevel,
  getXPNeededForCurrentLevel,
  getLevelProgress,
} from "../src/gamification/levels";

interface LevelProgressProps {
  totalXP: number;
  size?: "small" | "large";
}

export function LevelProgress({ totalXP, size = "small" }: LevelProgressProps) {
  const level = getLevelFromXP(totalXP);
  const xpInLevel = getXPInCurrentLevel(totalXP);
  const xpNeeded = getXPNeededForCurrentLevel(totalXP);
  const progress = getLevelProgress(totalXP);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: progress,
      tension: 50,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const isLarge = size === "large";

  return (
    <View style={{ alignSelf: "stretch", alignItems: "stretch" }}>
      {isLarge && (
        <>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "rgba(245,158,11,0.12)",
              borderWidth: 2,
              borderColor: "rgba(245,158,11,0.35)",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#fbbf24",
                fontSize: 28,
                fontWeight: "900",
              }}
            >
              {level}
            </Text>
          </View>
          <Text
            style={{
              color: "#a1a1aa",
              fontSize: 13,
              fontWeight: "600",
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            Level {level}
          </Text>
          <Text
            style={{
              color: "#71717a",
              fontSize: 12,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {totalXP.toLocaleString()} total XP
          </Text>
        </>
      )}

      {/* Progress bar — fluid width, no fixed 200px overflow */}
      <View
        style={{
          width: "100%",
          height: isLarge ? 8 : 4,
          borderRadius: 4,
          backgroundColor: "#27272a",
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            borderRadius: 4,
            backgroundColor: "#f59e0b",
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>

      {/* Labels */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 4,
          width: "100%",
        }}
      >
        <Text style={{ color: "#71717a", fontSize: 10 }} numberOfLines={1}>
          {isLarge ? `${xpInLevel}/${xpNeeded} XP` : `Lvl ${level}`}
        </Text>
        <Text style={{ color: "#71717a", fontSize: 10 }} numberOfLines={1}>
          {isLarge
            ? `→ Lvl ${level + 1}`
            : `${xpInLevel}/${xpNeeded}`}
        </Text>
      </View>
    </View>
  );
}
