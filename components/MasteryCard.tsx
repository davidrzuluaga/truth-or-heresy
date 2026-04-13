import { View, Text } from "react-native";
import { MasteryPath, getMasteryMilestone, MasteryProgress } from "../src/gamification/mastery";

interface MasteryCardProps {
  path: MasteryPath;
  progress: MasteryProgress | undefined;
}

export function MasteryCard({ path, progress }: MasteryCardProps) {
  const correct = progress?.correct ?? 0;
  const total = path.totalQuestions;
  const pct = total > 0 ? correct / total : 0;
  const { label } = getMasteryMilestone(correct, total);

  return (
    <View
      style={{
        backgroundColor: "#111113",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: label ? "rgba(245,158,11,0.3)" : "#27272a",
        padding: 16,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: pct > 0 ? "rgba(245,158,11,0.12)" : "rgba(39,39,42,0.5)",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            borderWidth: 1,
            borderColor: pct > 0 ? "rgba(245,158,11,0.25)" : "#27272a",
          }}
        >
          <Text style={{ fontSize: 20 }}>{path.icon}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#f4f4f5", fontSize: 15, fontWeight: "700" }}>
              {path.name}
            </Text>
            {label && (
              <View
                style={{
                  backgroundColor: "rgba(245,158,11,0.15)",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fbbf24", fontSize: 10, fontWeight: "700" }}>
                  {label}
                </Text>
              </View>
            )}
          </View>
          <Text style={{ color: "#71717a", fontSize: 12, marginTop: 2 }}>
            {path.description}
          </Text>
        </View>

        <Text style={{ color: "#a1a1aa", fontSize: 13, fontWeight: "600" }}>
          {correct}/{total}
        </Text>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "#27272a",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor:
              pct >= 1
                ? "#4ade80"
                : pct >= 0.75
                ? "#fbbf24"
                : pct >= 0.5
                ? "#f59e0b"
                : "#d97706",
            width: `${Math.max(pct * 100, pct > 0 ? 2 : 0)}%` as any,
          }}
        />
      </View>

      <Text style={{ color: "#52525b", fontSize: 10, marginTop: 4, textAlign: "right" }}>
        {Math.round(pct * 100)}%
      </Text>
    </View>
  );
}
