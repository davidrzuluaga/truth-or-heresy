import { memo } from "react";
import { View, Text } from "react-native";

interface QuestionCardProps {
  statement: string;
  questionNumber: number;
}

/**
 * The big dramatic card that shows the theological statement.
 * Designed to feel like a parchment from the council archives.
 */
export const QuestionCard = memo(function QuestionCard({ statement, questionNumber }: QuestionCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#111113",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#27272a",
        paddingHorizontal: 28,
        paddingVertical: 36,
        // Subtle inner glow effect via shadow
        shadowColor: "#f59e0b",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 20,
        elevation: 4,
      }}
    >
      {/* Question badge */}
      <View className="items-center mb-6">
        <View
          style={{
            backgroundColor: "rgba(245,158,11,0.12)",
            borderRadius: 9999,
            paddingHorizontal: 14,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: "rgba(245,158,11,0.2)",
          }}
        >
          <Text className="text-amber-500 text-xs font-bold tracking-widest uppercase">
            Question {questionNumber}
          </Text>
        </View>
      </View>

      {/* The statement */}
      <Text
        className="text-white text-xl font-semibold text-center leading-relaxed"
        style={{ lineHeight: 32 }}
      >
        "{statement}"
      </Text>

      {/* Decorative divider */}
      <View className="flex-row justify-center mt-8" style={{ gap: 6 }}>
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 9999,
            backgroundColor: "#3f3f46",
          }}
        />
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 9999,
            backgroundColor: "#52525b",
          }}
        />
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 9999,
            backgroundColor: "#3f3f46",
          }}
        />
      </View>

      {/* Instruction hint */}
      <Text className="text-zinc-600 text-xs text-center mt-5 uppercase tracking-wide">
        Is this Truth or Heresy?
      </Text>
    </View>
  );
});
