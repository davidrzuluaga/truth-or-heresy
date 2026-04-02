import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useGame } from "../src/context";
import { HeresyName } from "../src/types";

const HERESY_KEYS: HeresyName[] = [
  "Arianism",
  "Pelagianism",
  "Gnosticism",
  "Modalism",
  "Docetism",
  "Nestorianism",
  "Marcionism",
];

const HERESY_ICONS: Record<HeresyName, string> = {
  Arianism: "⬇️",
  Pelagianism: "💪",
  Gnosticism: "🔮",
  Modalism: "🎭",
  Docetism: "👻",
  Nestorianism: "✌️",
  Marcionism: "⚡",
};

export default function HeresySelectorScreen() {
  const { t } = useTranslation();
  const { dispatch } = useGame();

  const handleSelect = (heresy: HeresyName) => {
    dispatch({ type: "SELECT_HERESY", heresy });
    router.replace("/explanation");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-white text-2xl font-bold mb-1">
          {t("heresySelector.headline")}
        </Text>
        <Text className="text-zinc-400 text-base mb-7 leading-relaxed">
          {t("heresySelector.sub")}
        </Text>

        <View style={{ gap: 12 }}>
          {HERESY_KEYS.map((key) => (
            <Pressable
              key={key}
              onPress={() => handleSelect(key)}
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
                  <Text style={{ fontSize: 22 }}>{HERESY_ICONS[key]}</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-white text-lg font-bold mb-0.5">
                    {t(`heresies.${key}.name`)}
                  </Text>
                  <Text className="text-zinc-400 text-sm">
                    {t(`heresies.${key}.tagline`)}
                  </Text>
                  <Text className="text-zinc-600 text-xs mt-1">
                    {t(`heresies.${key}.council`)}
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
