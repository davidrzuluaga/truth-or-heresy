import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Flame, BookOpen, Settings } from "lucide-react-native";
import { useGame } from "../src/context";
import {
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from "../src/i18n/constants";
import { persistLanguage } from "../src/i18n/LanguageProvider";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { dispatch } = useGame();

  const handleStart = () => {
    dispatch({ type: "START_GAME" });
    router.push("/quiz");
  };

  const selectLanguage = async (code: AppLanguage) => {
    await persistLanguage(code);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="absolute top-12 right-5 z-10">
        <Pressable
          onPress={() => router.push("/settings")}
          className="p-2 rounded-full bg-zinc-900 border border-zinc-800"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Settings size={20} color="#a1a1aa" />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <View className="bg-amber-500/15 border border-amber-500/30 rounded-full p-5 mb-8">
          <Flame size={52} color="#f59e0b" />
        </View>

        <Text className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-4">
          {t("home.eyebrow")}
        </Text>

        <Text className="text-white text-5xl font-bold text-center leading-tight mb-5">
          {t("home.titleLine1")}
          {"\n"}
          {t("home.titleLine2")}
        </Text>

        <Text className="text-zinc-400 text-lg text-center leading-relaxed mb-6">
          {t("home.taglineLine1")}
          {"\n"}
          {t("home.taglineLine2")}
        </Text>

        <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">
          {t("home.languageLabel")}
        </Text>
        <View
          className="flex-row flex-wrap justify-center mb-10"
          style={{ gap: 10 }}
        >
          {SUPPORTED_LANGUAGES.map(({ code, nativeName }) => {
            const current =
              (i18n.resolvedLanguage ?? i18n.language).split("-")[0] ?? "";
            const active = current === code;
            return (
              <Pressable
                key={code}
                onPress={() => void selectLanguage(code)}
                className="px-5 py-2.5 rounded-xl border"
                style={({ pressed }) => ({
                  backgroundColor: active ? "rgba(245,158,11,0.2)" : "#18181b",
                  borderColor: active ? "#f59e0b" : "#3f3f46",
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: active ? "#fbbf24" : "#a1a1aa" }}
                >
                  {nativeName}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleStart}
          className="bg-amber-500 rounded-2xl w-full py-5 items-center mb-5"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Text className="text-zinc-950 text-xl font-bold tracking-wide">
            {t("home.startQuiz")}
          </Text>
        </Pressable>

        <Text className="text-zinc-600 text-sm text-center px-4">
          {t("home.footerHint")}
        </Text>
      </View>

      <View className="pb-8 items-center">
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <BookOpen size={13} color="#52525b" />
          <Text className="text-zinc-600 text-xs">{t("home.statsLine")}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
