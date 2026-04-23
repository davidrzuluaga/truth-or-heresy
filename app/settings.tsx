import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Info, Volume2, VolumeX, Crown, Check } from "lucide-react-native";
import { router } from "expo-router";
import { isSoundEnabled, setSoundEnabled } from "../src/sound";
import { usePremium } from "../src/premium";

export default function SettingsScreen() {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const { isPremium } = usePremium();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }} edges={["bottom"]}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Premium ──────────────────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/paywall" as any)}
          style={({ pressed }) => ({
            backgroundColor: isPremium ? "rgba(74,222,128,0.08)" : "rgba(245,158,11,0.1)",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isPremium ? "rgba(74,222,128,0.25)" : "rgba(245,158,11,0.3)",
            padding: 20,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View
            style={{
              backgroundColor: isPremium ? "rgba(74,222,128,0.15)" : "rgba(245,158,11,0.15)",
              borderRadius: 9999,
              padding: 8,
              marginRight: 12,
            }}
          >
            {isPremium ? <Check size={20} color="#4ade80" /> : <Crown size={20} color="#f59e0b" />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffffff", fontSize: 17, fontWeight: "700" }}>
              {isPremium ? "Premium Unlocked" : "Go Premium"}
            </Text>
            <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 2 }}>
              {isPremium
                ? "Infinite hearts · All paths unlocked"
                : "Infinite hearts · 11 more mastery paths"}
            </Text>
          </View>
        </Pressable>

        {/* ── Sound toggle ──────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: "#111113",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <Pressable
            onPress={() => {
              const next = !soundOn;
              setSoundOn(next);
              setSoundEnabled(next);
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View
              style={{
                backgroundColor: soundOn
                  ? "rgba(245,158,11,0.15)"
                  : "rgba(113,113,122,0.15)",
                borderRadius: 9999,
                padding: 8,
                marginRight: 12,
              }}
            >
              {soundOn ? (
                <Volume2 size={20} color="#f59e0b" />
              ) : (
                <VolumeX size={20} color="#71717a" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffffff", fontSize: 17, fontWeight: "700" }}>
                Sound Effects
              </Text>
              <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 2 }}>
                Chimes, buzzes & haptic feedback
              </Text>
            </View>
            <View
              style={{
                width: 50,
                height: 28,
                borderRadius: 14,
                backgroundColor: soundOn ? "#f59e0b" : "#3f3f46",
                justifyContent: "center",
                paddingHorizontal: 3,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#ffffff",
                  alignSelf: soundOn ? "flex-end" : "flex-start",
                }}
              />
            </View>
          </Pressable>
        </View>

        {/* ── About ──────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: "#111113",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Info size={16} color="#71717a" />
            <Text
              style={{
                color: "#71717a",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              About
            </Text>
          </View>
          <Text style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 21 }}>
            Truth or Heresy? tests your knowledge of Christian doctrine across
            2,055 statements — from the classic heresies condemned by the early
            church councils to modern pop-theology errors. Features 16 mastery
            paths, daily challenges, spaced repetition, hearts-based play, and
            adaptive difficulty.
          </Text>
        </View>

        <Text
          style={{
            color: "#3f3f46",
            fontSize: 11,
            textAlign: "center",
            lineHeight: 18,
            paddingHorizontal: 20,
            marginTop: 4,
          }}
        >
          All progress stored locally on your device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
