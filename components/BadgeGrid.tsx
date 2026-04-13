import { View, Text } from "react-native";
import { BADGES, Badge } from "../src/gamification/types";

interface BadgeGridProps {
  unlockedBadges: string[];
}

/**
 * Beautiful grid of all badges with locked/unlocked states.
 */
export function BadgeGrid({ unlockedBadges }: BadgeGridProps) {
  const unlocked = new Set(unlockedBadges);

  return (
    <View>
      <Text
        style={{
          color: "#f4f4f5",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Badges ({unlockedBadges.length}/{BADGES.length})
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {BADGES.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isUnlocked={unlocked.has(badge.id)}
          />
        ))}
      </View>
    </View>
  );
}

function BadgeCard({
  badge,
  isUnlocked,
}: {
  badge: Badge;
  isUnlocked: boolean;
}) {
  return (
    <View
      style={{
        width: "30%",
        backgroundColor: isUnlocked ? "#111113" : "#0a0a0c",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isUnlocked
          ? "rgba(245,158,11,0.3)"
          : "#1f1f23",
        padding: 12,
        alignItems: "center",
        opacity: isUnlocked ? 1 : 0.45,
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: isUnlocked
            ? "rgba(245,158,11,0.12)"
            : "rgba(39,39,42,0.5)",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 8,
          borderWidth: 1,
          borderColor: isUnlocked
            ? "rgba(245,158,11,0.25)"
            : "#27272a",
        }}
      >
        <Text style={{ fontSize: 24 }}>
          {isUnlocked ? badge.icon : "🔒"}
        </Text>
      </View>

      {/* Name */}
      <Text
        style={{
          color: isUnlocked ? "#f4f4f5" : "#52525b",
          fontSize: 11,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 2,
        }}
        numberOfLines={1}
      >
        {badge.name}
      </Text>

      {/* Description */}
      <Text
        style={{
          color: isUnlocked ? "#a1a1aa" : "#3f3f46",
          fontSize: 9,
          textAlign: "center",
          lineHeight: 13,
        }}
        numberOfLines={2}
      >
        {badge.description}
      </Text>
    </View>
  );
}
