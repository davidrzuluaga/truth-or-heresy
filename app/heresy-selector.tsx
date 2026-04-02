import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useGame } from "../src/context";
import { HeresyName } from "../src/types";

// ─── Heresy catalogue ─────────────────────────────────────────────────────────

const HERESIES: {
  name: HeresyName;
  tagline: string;
  icon: string;
  council: string;
}[] = [
  {
    name: "Arianism",
    tagline: "Jesus is a created, lesser being",
    icon: "⬇️",
    council: "Condemned at Nicaea 325 AD",
  },
  {
    name: "Pelagianism",
    tagline: "Humans can earn salvation by willpower",
    icon: "💪",
    council: "Condemned at Carthage 418 AD",
  },
  {
    name: "Gnosticism",
    tagline: "Secret knowledge saves; matter is evil",
    icon: "🔮",
    council: "Opposed by early fathers, 2nd–3rd c.",
  },
  {
    name: "Modalism",
    tagline: "God wears three masks, not three persons",
    icon: "🎭",
    council: "Rejected by 3rd-century church",
  },
  {
    name: "Docetism",
    tagline: "Jesus only seemed to be human",
    icon: "👻",
    council: "Opposed by Ignatius, c. 107 AD",
  },
  {
    name: "Nestorianism",
    tagline: "Christ is two separate persons",
    icon: "✌️",
    council: "Condemned at Ephesus 431 AD",
  },
  {
    name: "Marcionism",
    tagline: "OT God ≠ NT God; ditch the OT",
    icon: "⚡",
    council: "Excommunicated Marcion, 144 AD",
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HeresySelectorScreen() {
  const { dispatch } = useGame();

  const handleSelect = (heresy: HeresyName) => {
    dispatch({ type: "SELECT_HERESY", heresy });
    // Replace heresy-selector so Back from Explanation goes to Quiz
    router.replace("/explanation");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header copy */}
        <Text className="text-white text-2xl font-bold mb-1">
          Name That Heresy!
        </Text>
        <Text className="text-zinc-400 text-base mb-7 leading-relaxed">
          Which specific heresy is lurking in this statement?
        </Text>

        {/* Heresy grid */}
        <View style={{ gap: 12 }}>
          {HERESIES.map((h) => (
            <Pressable
              key={h.name}
              onPress={() => handleSelect(h.name)}
              style={({ pressed }) => ({
                backgroundColor: pressed ? "#18181b" : "#111113",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: pressed ? "#3f3f46" : "#27272a",
                padding: 16,
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row items-center" style={{ gap: 14 }}>
                {/* Icon badge */}
                <View
                  className="rounded-full items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#1c1c1f",
                    borderWidth: 1,
                    borderColor: "#3f3f46",
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{h.icon}</Text>
                </View>

                {/* Text */}
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold mb-0.5">
                    {h.name}
                  </Text>
                  <Text className="text-zinc-400 text-sm">{h.tagline}</Text>
                  <Text className="text-zinc-600 text-xs mt-1">
                    {h.council}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
