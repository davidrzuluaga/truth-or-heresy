import { useEffect, useRef, useMemo } from "react";
import { Animated, Dimensions, View } from "react-native";

const COLORS = ["#f59e0b", "#fbbf24", "#fde68a", "#4ade80", "#f87171", "#a78bfa", "#60a5fa"];
const PARTICLE_COUNT = 40;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

interface ConfettiProps {
  active: boolean;
  onDone?: () => void;
}

/**
 * Full-screen confetti explosion overlay.
 * Pass active=true to trigger; fires once and calls onDone.
 */
export function Confetti({ active, onDone }: ConfettiProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_W,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 400,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 120,
      })),
    [active]
  );

  if (!active) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      {particles.map((p) => (
        <ConfettiParticle key={p.id} {...p} onDone={p.id === 0 ? onDone : undefined} />
      ))}
    </View>
  );
}

function ConfettiParticle({
  x,
  color,
  size,
  delay,
  drift,
  onDone,
}: {
  x: number;
  color: string;
  size: number;
  delay: number;
  rotation: number;
  drift: number;
  onDone?: () => void;
}) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 1800 + Math.random() * 800;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_H + 40,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: drift,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 4 + Math.random() * 4,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          delay: duration * 0.6,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onDone?.();
    });
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: -10,
        width: size,
        height: size * 1.4,
        borderRadius: size * 0.25,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: spin }],
      }}
    />
  );
}
