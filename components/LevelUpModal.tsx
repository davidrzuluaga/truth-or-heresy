import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useGamification } from "../src/gamification/context";
import { Confetti } from "./Confetti";
import { playLevelUp } from "../src/sound";

/**
 * Full-screen level-up celebration overlay with confetti.
 */
export function LevelUpModal() {
  const { levelUp, dismissLevelUp } = useGamification();
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (levelUp !== null) {
      scale.setValue(0.3);
      opacity.setValue(0);
      setShowConfetti(true);
      playLevelUp();

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [levelUp]);

  if (levelUp === null) return null;

  const handleDismiss = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowConfetti(false);
      dismissLevelUp();
    });
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99998,
      }}
    >
      <Confetti active={showConfetti} />

      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.85)",
          opacity,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale }],
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          {/* Level badge */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(245,158,11,0.15)",
              borderWidth: 3,
              borderColor: "#f59e0b",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 48 }}>⭐</Text>
          </View>

          <Text
            style={{
              color: "#fbbf24",
              fontSize: 14,
              fontWeight: "700",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Level Up!
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 56,
              fontWeight: "900",
              marginBottom: 8,
            }}
          >
            Level {levelUp}
          </Text>

          <Text
            style={{
              color: "#a1a1aa",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 36,
              lineHeight: 24,
            }}
          >
            Your theological knowledge grows stronger.{"\n"}Keep defending orthodoxy!
          </Text>

          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => ({
              backgroundColor: "#f59e0b",
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 48,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text
              style={{
                color: "#09090b",
                fontSize: 18,
                fontWeight: "800",
              }}
            >
              Continue
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
