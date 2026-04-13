import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGamification } from "../src/gamification/context";
import { StreakCounter } from "../components/StreakCounter";
import { LevelProgress } from "../components/LevelProgress";
import { BadgeGrid } from "../components/BadgeGrid";
import { MasteryCard } from "../components/MasteryCard";
import { MASTERY_PATHS } from "../src/gamification/mastery";

export default function DashboardScreen() {
  const { data } = useGamification();
  const accuracy =
    data.totalAnswered > 0
      ? Math.round((data.totalCorrect / data.totalAnswered) * 100)
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Level & Streak Row ──────────────────────────────────── */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {/* Level Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#111113",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#27272a",
              padding: 20,
              alignItems: "center",
            }}
          >
            <LevelProgress totalXP={data.totalXP} size="large" />
          </View>

          {/* Streak Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#111113",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#27272a",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StreakCounter size="large" />
          </View>
        </View>

        {/* ── Stats Grid ─────────────────────────────────────────── */}
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
          <Text
            style={{
              color: "#f4f4f5",
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 16,
            }}
          >
            Statistics
          </Text>

          <View style={{ gap: 14 }}>
            <StatRow
              label="Total Questions"
              value={data.totalAnswered.toLocaleString()}
              icon="📖"
            />
            <StatRow
              label="Correct Answers"
              value={data.totalCorrect.toLocaleString()}
              icon="✅"
            />
            <StatRow
              label="Accuracy"
              value={`${accuracy}%`}
              icon="🎯"
              highlight={accuracy >= 80}
            />
            <StatRow
              label="Heresies Caught"
              value={data.heresiesIdentified.toLocaleString()}
              icon="🗡️"
            />
            <StatRow
              label="Perfect Sessions"
              value={data.perfectSessions.toLocaleString()}
              icon="👑"
            />
            <StatRow
              label="Best Streak"
              value={`${data.bestSessionStreak} in a row`}
              icon="⚡"
            />
            <StatRow
              label="Daily Challenges"
              value={data.dailyChallengesCompleted.toLocaleString()}
              icon="✨"
            />
            <StatRow
              label="Reviews Completed"
              value={data.reviewsCompleted.toLocaleString()}
              icon="🔄"
            />
          </View>
        </View>

        {/* ── Mastery Paths ──────────────────────────────────────── */}
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
          <Text
            style={{
              color: "#f4f4f5",
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 16,
            }}
          >
            Mastery Paths
          </Text>
          {MASTERY_PATHS.map((path) => (
            <MasteryCard
              key={path.id}
              path={path}
              progress={data.masteryProgress[path.id]}
            />
          ))}
        </View>

        {/* ── Badges ─────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: "#111113",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#27272a",
            padding: 20,
            marginBottom: 24,
          }}
        >
          <BadgeGrid unlockedBadges={data.unlockedBadges} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Stat row ───────────────────────────────────────────────────────────────

function StatRow({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
        <Text style={{ color: "#a1a1aa", fontSize: 14 }}>{label}</Text>
      </View>
      <Text
        style={{
          color: highlight ? "#4ade80" : "#fbbf24",
          fontSize: 16,
          fontWeight: "700",
        }}
      >
        {value}
      </Text>
    </View>
  );
}
