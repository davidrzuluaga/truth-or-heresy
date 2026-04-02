import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Key, Eye, EyeOff, CheckCircle, Info } from "lucide-react-native";
import { getApiKey, saveApiKey } from "../src/claudeApi";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    (async () => {
      const key = await getApiKey();
      if (key) {
        setApiKey(key);
        setHasExistingKey(true);
      }
    })();
  }, []);

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      Alert.alert(
        t("settings.alertMissingTitle"),
        t("settings.alertMissingBody")
      );
      return;
    }
    if (!trimmed.startsWith("sk-")) {
      Alert.alert(
        t("settings.alertInvalidTitle"),
        t("settings.alertInvalidBody")
      );
      return;
    }
    await saveApiKey(trimmed);
    setSaved(true);
    setHasExistingKey(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
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
          <View className="flex-row items-center mb-4" style={{ gap: 12 }}>
            <View
              style={{
                backgroundColor: "rgba(245,158,11,0.15)",
                borderRadius: 9999,
                padding: 8,
              }}
            >
              <Key size={20} color="#f59e0b" />
            </View>
            <View>
              <Text className="text-white text-lg font-bold">
                {t("settings.apiKeyTitle")}
              </Text>
              {hasExistingKey && (
                <Text className="text-emerald-400 text-xs mt-0.5">
                  {t("settings.keyStored")}
                </Text>
              )}
            </View>
          </View>

          <Text className="text-zinc-400 text-sm leading-relaxed mb-5">
            {t("settings.description", { link: t("settings.linkLabel") })}
          </Text>

          <View
            className="flex-row items-center mb-4"
            style={{
              backgroundColor: "#0a0a0c",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#3f3f46",
              paddingHorizontal: 14,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                color: "#f4f4f5",
                paddingVertical: 14,
                fontSize: 14,
                fontFamily: "monospace",
              }}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder={t("settings.placeholder")}
              placeholderTextColor="#52525b"
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
            <Pressable
              onPress={() => setShowKey((v) => !v)}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
            >
              {showKey ? (
                <EyeOff size={18} color="#71717a" />
              ) : (
                <Eye size={18} color="#71717a" />
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => ({
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              backgroundColor: saved ? "#166534" : "#f59e0b",
              opacity: pressed ? 0.88 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View className="flex-row items-center" style={{ gap: 8 }}>
              {saved && <CheckCircle size={18} color="#ffffff" />}
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  color: saved ? "#ffffff" : "#1c1917",
                }}
              >
                {saved ? t("settings.saved") : t("settings.saveKey")}
              </Text>
            </View>
          </Pressable>
        </View>

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
          <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
            <Info size={16} color="#71717a" />
            <Text className="text-zinc-500 text-xs uppercase tracking-widest">
              {t("settings.about")}
            </Text>
          </View>
          <Text className="text-zinc-400 text-sm leading-relaxed">
            {t("settings.aboutBody")}
          </Text>
          <Text className="text-zinc-600 text-xs mt-4">
            {t("settings.poweredBy")}
          </Text>
        </View>

        <Text className="text-zinc-700 text-xs text-center leading-relaxed px-4">
          {t("settings.privacy")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
