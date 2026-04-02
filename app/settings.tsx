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
import { Key, Eye, EyeOff, CheckCircle, Info } from "lucide-react-native";
import { getApiKey, saveApiKey } from "../src/claudeApi";

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    (async () => {
      const key = await getApiKey();
      if (key) {
        // Show masked value so the user knows one is stored.
        setApiKey(key);
        setHasExistingKey(true);
      }
    })();
  }, []);

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      Alert.alert("Missing key", "Please paste your Anthropic API key first.");
      return;
    }
    if (!trimmed.startsWith("sk-")) {
      Alert.alert(
        "Invalid key",
        'Anthropic API keys start with "sk-". Double-check your key.'
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
        {/* ── API Key card ─────────────────────────────────────────────── */}
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
          {/* Header */}
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
                Anthropic API Key
              </Text>
              {hasExistingKey && (
                <Text className="text-emerald-400 text-xs mt-0.5">
                  ✓ Key stored
                </Text>
              )}
            </View>
          </View>

          {/* Description */}
          <Text className="text-zinc-400 text-sm leading-relaxed mb-5">
            This app uses Claude AI to generate explanations after every answer.
            Get your free key at{" "}
            <Text className="text-amber-400 font-medium">
              console.anthropic.com
            </Text>{" "}
            — it only takes 30 seconds.
          </Text>

          {/* Input */}
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
              placeholder="sk-ant-api03-..."
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

          {/* Save button */}
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
                {saved ? "Saved!" : "Save API Key"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── Info card ─────────────────────────────────────────────────── */}
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
              About
            </Text>
          </View>
          <Text className="text-zinc-400 text-sm leading-relaxed">
            Truth or Heresy? tests your knowledge of Christian doctrine and the
            7 classic heresies condemned by the early church councils — from
            Nicaea to Ephesus. Each explanation is generated live by Claude AI
            so no two sessions are quite alike.
          </Text>
          <Text className="text-zinc-600 text-xs mt-4">
            Powered by claude-3-5-sonnet-20241022
          </Text>
        </View>

        {/* ── Privacy note ──────────────────────────────────────────────── */}
        <Text className="text-zinc-700 text-xs text-center leading-relaxed px-4">
          Your API key is stored only on this device using encrypted local
          storage. It is never sent anywhere except directly to Anthropic's API.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
