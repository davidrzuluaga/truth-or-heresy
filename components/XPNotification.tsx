import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useGamification } from "../src/gamification/context";

/**
 * Floating +XP labels that animate upward and fade out.
 * Renders in a fixed overlay position — place near the top of a screen.
 */
export function XPNotificationLayer() {
  const { xpNotifications } = useGamification();

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {xpNotifications.map((n) => (
        <FloatingXP key={n.id} id={n.id} label={n.label} />
      ))}
    </View>
  );
}

function FloatingXP({ id, label }: { id: string; label: string }) {
  const { dismissXP } = useGamification();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      // Pop in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      // Hold
      Animated.delay(1200),
      // Float up and fade
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      dismissXP(id);
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }, { scale }],
        marginBottom: 6,
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(245,158,11,0.2)",
          borderWidth: 1,
          borderColor: "rgba(245,158,11,0.4)",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <Text
          style={{
            color: "#fbbf24",
            fontWeight: "800",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}
