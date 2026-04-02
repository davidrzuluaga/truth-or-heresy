import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Flame, BookOpen, Settings } from "lucide-react-native";
import { useGame } from "../src/context";

export default function HomeScreen() {
  const { dispatch } = useGame();

  const handleStart = () => {
    dispatch({ type: "START_GAME" });
    router.push("/quiz");
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Settings shortcut */}
      <View className="absolute top-12 right-5 z-10">
        <Pressable
          onPress={() => router.push("/settings")}
          className="p-2 rounded-full bg-zinc-900 border border-zinc-800"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Settings size={20} color="#a1a1aa" />
        </Pressable>
      </View>

      {/* Hero */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Icon badge */}
        <View className="bg-amber-500/15 border border-amber-500/30 rounded-full p-5 mb-8">
          <Flame size={52} color="#f59e0b" />
        </View>

        {/* Eyebrow */}
        <Text className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-4">
          The Theology Quiz
        </Text>

        {/* Title */}
        <Text className="text-white text-5xl font-bold text-center leading-tight mb-5">
          Truth or{"\n"}Heresy?
        </Text>

        {/* Tagline */}
        <Text className="text-zinc-400 text-lg text-center leading-relaxed mb-14">
          Spot true doctrine from{"\n"}ancient errors
        </Text>

        {/* CTA */}
        <Pressable
          onPress={handleStart}
          className="bg-amber-500 rounded-2xl w-full py-5 items-center mb-5"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Text className="text-zinc-950 text-xl font-bold tracking-wide">
            Start Quiz
          </Text>
        </Pressable>

        <Text className="text-zinc-600 text-sm text-center px-4">
          Can you tell the ancient councils from the ancient chaos?
        </Text>
      </View>

      {/* Footer */}
      <View className="pb-8 items-center">
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <BookOpen size={13} color="#52525b" />
          <Text className="text-zinc-600 text-xs">
            21 statements · 7 classic heresies
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
