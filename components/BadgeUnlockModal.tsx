import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useGamification } from "../src/gamification/context";
import { Confetti } from "./Confetti";
import { playStreak } from "../src/sound";

/**
 * Shows one badge unlock at a time with a celebration animation.
 */
export function BadgeUnlockModal() {
  const { badgeNotifications, dismissBadge } = useGamification();
  const badge = badgeNotifications[0];
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (badge) {
      scale.setValue(0);
      opacity.setValue(0);
      setShowConfetti(true);
      playStreak();

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
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
  }, [badge?.badge.id]);

  if (!badge) return null;

  const handleDismiss = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowConfetti(false);
      dismissBadge();
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
        zIndex: 99997,
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
          {/* Badge icon */}
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: "rgba(245,158,11,0.12)",
              borderWidth: 2,
              borderColor: "rgba(245,158,11,0.4)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 52 }}>{badge.badge.icon}</Text>
          </View>

          <Text
            style={{
              color: "#fbbf24",
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Badge Unlocked!
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: "800",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {badge.badge.name}
          </Text>

          <Text
            style={{
              color: "#a1a1aa",
              fontSize: 15,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            {badge.badge.description}
          </Text>

          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => ({
              backgroundColor: "#f59e0b",
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 44,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text
              style={{
                color: "#09090b",
                fontSize: 17,
                fontWeight: "800",
              }}
            >
              Awesome!
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
