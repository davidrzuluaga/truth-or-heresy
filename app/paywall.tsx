import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Crown, Heart, BookOpen, Infinity as InfinityIcon, Check } from "lucide-react-native";
import { usePremium } from "../src/premium";
import { MASTERY_PATHS } from "../src/gamification/mastery";
import { restorePurchases } from "../src/revenuecat";

const PERKS = [
  { icon: InfinityIcon, title: "Infinite Hearts", blurb: "Never stop studying — play as much as you want." },
  { icon: BookOpen, title: "11 Scholar Paths", blurb: "Full library: Hermeneutics, Pauline, Systematic, Church History & more." },
  { icon: Heart, title: "Support the App", blurb: "One-time unlock. No subscription. No ads." },
];

export default function PaywallScreen() {
  const { isPremium, setPremium } = usePremium();
  const { from, pathId } = useLocalSearchParams<{ from?: string; pathId?: string }>();
  const paidCount = MASTERY_PATHS.filter((p) => !p.isFree).length;
  const totalQuestions = MASTERY_PATHS.filter((p) => !p.isFree).reduce((n, p) => n + p.totalQuestions, 0);
  const samplePath = MASTERY_PATHS.find((p) => p.id === pathId);
  const cameFromSample = from === "sample" && samplePath;

  const handleUnlock = () => {
    // DEV ONLY — when RevenueCat is wired up, replace this with
    // await Purchases.purchasePackage(pkg)
    setPremium(true);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Crown badge */}
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 24 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "rgba(245,158,11,0.12)",
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Crown size={44} color="#f59e0b" />
          </View>
        </View>

        {cameFromSample && (
          <View
            style={{
              backgroundColor: "rgba(245,158,11,0.08)",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.25)",
              padding: 12,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fbbf24", fontSize: 13, fontWeight: "700" }}>
              {samplePath!.icon} Preview complete — {samplePath!.name}
            </Text>
            <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4, textAlign: "center" }}>
              {samplePath!.totalQuestions - 5}+ more questions in this path alone.
            </Text>
          </View>
        )}

        <Text
          style={{
            color: "#f4f4f5",
            fontSize: 32,
            fontWeight: "900",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {cameFromSample ? "Ready for the full path?" : "Go Premium"}
        </Text>
        <Text
          style={{
            color: "#a1a1aa",
            fontSize: 15,
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 22,
          }}
        >
          Unlock {paidCount} scholar paths ({totalQuestions.toLocaleString()}+ more questions) and never run out of hearts.
        </Text>

        {/* Perk rows */}
        <View style={{ gap: 14, marginBottom: 28 }}>
          {PERKS.map((perk) => (
            <View
              key={perk.title}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#111113",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#27272a",
                padding: 16,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(245,158,11,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <perk.icon size={20} color="#f59e0b" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#f4f4f5", fontSize: 15, fontWeight: "700" }}>
                  {perk.title}
                </Text>
                <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 2 }}>
                  {perk.blurb}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Price + CTA */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Text style={{ color: "#71717a", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>
            One-time purchase
          </Text>
          <Text style={{ color: "#f4f4f5", fontSize: 40, fontWeight: "900", marginTop: 4 }}>
            $4.99
          </Text>
        </View>

        <Pressable
          onPress={handleUnlock}
          disabled={isPremium}
          style={({ pressed }) => ({
            backgroundColor: isPremium ? "#3f3f46" : "#f59e0b",
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            opacity: pressed ? 0.88 : 1,
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          })}
        >
          {isPremium && <Check size={20} color="#a1a1aa" />}
          <Text style={{ color: isPremium ? "#a1a1aa" : "#1c1917", fontSize: 17, fontWeight: "800" }}>
            {isPremium ? "Already Unlocked" : "Unlock Premium"}
          </Text>
        </Pressable>

        {/* Restore + dev toggle */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 16 }}>
          <Pressable
            onPress={async () => {
              const info = await restorePurchases();
              if (info.hasPremium) setPremium(true);
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={{ color: "#71717a", fontSize: 13 }}>Restore Purchases</Text>
          </Pressable>
          {isPremium && (
            <Pressable
              onPress={() => setPremium(false)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={{ color: "#71717a", fontSize: 13 }}>Reset (dev)</Text>
            </Pressable>
          )}
        </View>

        <Text
          style={{
            color: "#3f3f46",
            fontSize: 11,
            textAlign: "center",
            marginTop: 20,
            lineHeight: 16,
          }}
        >
          Payment handled by the App Store / Google Play.{"\n"}
          No subscription. No recurring charges.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
