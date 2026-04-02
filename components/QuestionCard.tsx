import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

interface QuestionCardProps {
  statement: string;
  questionNumber: number;
}

export function QuestionCard({ statement, questionNumber }: QuestionCardProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: "#111113",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#27272a",
        paddingHorizontal: 28,
        paddingVertical: 36,
        shadowColor: "#f59e0b",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 20,
        elevation: 4,
      }}
    >
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
            {t("questionCard.question", { n: questionNumber })}
          </Text>
        </View>
      </View>

      <Text
        className="text-white text-xl font-semibold text-center leading-relaxed"
        style={{ lineHeight: 32 }}
      >
        "{statement}"
      </Text>

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

      <Text className="text-zinc-600 text-xs text-center mt-5 uppercase tracking-wide">
        {t("questionCard.hint")}
      </Text>
    </View>
  );
}
