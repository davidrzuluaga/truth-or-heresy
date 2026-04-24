import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Heart, RotateCcw, Clock, Crown, Infinity as InfinityIcon } from "lucide-react-native";
import { useGamification } from "../src/gamification/context";
import { usePremium } from "../src/premium";
import {
  secondsUntilHeartReset,
  formatHeartCountdown,
} from "../src/gamification/hearts";
import { HeartsDisplay } from "../components/HeartsDisplay";

export default function OutOfHeartsScreen() {
  const { data, dueReviewCount } = useGamification();
  const { isPremium } = usePremium();
  const [countdown, setCountdown] = useState(
    formatHeartCountdown(secondsUntilHeartReset(data.lastHeartReset))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatHeartCountdown(secondsUntilHeartReset(data.lastHeartReset)));
    }, 1000);
    return () => clearInterval(interval);
  }, [data.lastHeartReset]);

  // If hearts restored (e.g. via reset), go back automatically
  useEffect(() => {
    if (data.hearts > 0) {
      router.back();
    }
  }, [data.hearts]);

  const handleReview = () => {
    router.replace("/review" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        {/* Broken heart icon */}
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: "rgba(239,68,68,0.1)",
            borderWidth: 2,
            borderColor: "rgba(239,68,68,0.25)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <Heart size={52} color="#ef4444" fill="transparent" />
          <View
            style={{
              position: "absolute",
              width: 60,
              height: 3,
              backgroundColor: "rgba(239,68,68,0.5)",
              transform: [{ rotate: "45deg" }],
            }}
          />
        </View>

        {/* Hearts display */}
        <View style={{ marginBottom: 16 }}>
          <HeartsDisplay hearts={0} showCount={false} size="large" pulse={false} />
        </View>

        <Text
          style={{
            color: "#ef4444",
            fontSize: 13,
            fontWeight: "700",
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Out of Hearts!
        </Text>

        <Text
          style={{
            color: "#f4f4f5",
            fontSize: 28,
            fontWeight: "900",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Out of Hearts!
        </Text>

        <Text
          style={{
            color: "#a1a1aa",
            fontSize: 15,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: 8,
          }}
        >
          Your hearts will refill{"\n"}24 hours after you ran out.
        </Text>

        {/* Countdown */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(239,68,68,0.08)",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(239,68,68,0.15)",
            marginBottom: 32,
          }}
        >
          <Clock size={16} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontSize: 15, fontWeight: "700" }}>
            {countdown}
          </Text>
          <Text style={{ color: "#71717a", fontSize: 13 }}>until reset</Text>
        </View>

        {/* Premium CTA — hearts-exhausted is the highest-intent upsell moment */}
        {!isPremium && (
          <Pressable
            onPress={() => router.push("/paywall" as any)}
            style={({ pressed }) => ({
              backgroundColor: "#f59e0b",
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 24,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
              shadowColor: "#f59e0b",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            })}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(28,25,23,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InfinityIcon size={20} color="#1c1917" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Crown size={14} color="#1c1917" />
                <Text
                  style={{ color: "#1c1917", fontSize: 16, fontWeight: "900" }}
                >
                  Never Run Out Again
                </Text>
              </View>
              <Text
                style={{
                  color: "rgba(28,25,23,0.75)",
                  fontSize: 12,
                  marginTop: 2,
                  fontWeight: "600",
                }}
              >
                Infinite hearts + 11 more paths · $4.99 once
              </Text>
            </View>
          </Pressable>
        )}

        {/* Review option */}
        {dueReviewCount > 0 && (
          <Pressable
            onPress={handleReview}
            style={({ pressed }) => ({
              backgroundColor: "rgba(96,165,250,0.12)",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(96,165,250,0.3)",
              paddingVertical: 16,
              paddingHorizontal: 32,
              opacity: pressed ? 0.9 : 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            })}
          >
            <RotateCcw size={20} color="#60a5fa" />
            <View>
              <Text
                style={{ color: "#60a5fa", fontSize: 16, fontWeight: "800" }}
              >
                Review Mode
              </Text>
              <Text style={{ color: "#71717a", fontSize: 12, marginTop: 2 }}>
                Free — no hearts needed!
              </Text>
            </View>
          </Pressable>
        )}

        {/* Go home */}
        <Pressable
          onPress={() => router.replace("/" as any)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            paddingVertical: 12,
            paddingHorizontal: 24,
          })}
        >
          <Text style={{ color: "#71717a", fontSize: 15 }}>Go Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
