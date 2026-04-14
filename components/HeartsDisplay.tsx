import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { Heart } from "lucide-react-native";
import { MAX_HEARTS } from "../src/gamification/hearts";

interface Props {
  hearts: number;
  /** Show the "x/5" count next to hearts */
  showCount?: boolean;
  /** Size variant */
  size?: "small" | "large";
  /** If true, pulse-animate the last remaining heart */
  pulse?: boolean;
}

export function HeartsDisplay({
  hearts,
  showCount = true,
  size = "small",
  pulse = true,
}: Props) {
  const iconSize = size === "large" ? 22 : 16;
  const gap = size === "large" ? 4 : 3;

  // Pulse animation for low hearts
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (pulse && hearts === 1) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [hearts, pulse]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap }}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => {
        const filled = i < hearts;
        const isLast = hearts === 1 && i === 0;

        const heartIcon = (
          <Heart
            key={i}
            size={iconSize}
            color={filled ? "#ef4444" : "#3f3f46"}
            fill={filled ? "#ef4444" : "transparent"}
          />
        );

        if (isLast && pulse) {
          return (
            <Animated.View
              key={i}
              style={{ transform: [{ scale: pulseAnim }] }}
            >
              {heartIcon}
            </Animated.View>
          );
        }

        return heartIcon;
      })}
      {showCount && (
        <Text
          style={{
            color: hearts > 0 ? "#ef4444" : "#71717a",
            fontSize: size === "large" ? 16 : 13,
            fontWeight: "700",
            marginLeft: 4,
          }}
        >
          {hearts}
        </Text>
      )}
    </View>
  );
}
