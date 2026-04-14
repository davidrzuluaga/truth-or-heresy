import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider } from "../src/context";
import { GamificationProvider } from "../src/gamification/context";
import { LevelUpModal } from "../components/LevelUpModal";
import { BadgeUnlockModal } from "../components/BadgeUnlockModal";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <GamificationProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#09090b" },
              headerTintColor: "#f4f4f5",
              headerTitleStyle: { fontWeight: "700", fontSize: 17 },
              contentStyle: { backgroundColor: "#09090b" },
              animation: "slide_from_right",
              headerBackTitle: "",
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen
              name="quiz"
              options={{ title: "Truth or Heresy?" }}
            />

            <Stack.Screen
              name="heresy-selector"
              options={{ title: "Name That Heresy!" }}
            />

            <Stack.Screen
              name="explanation"
              options={{
                title: "The Verdict",
                headerBackVisible: false,
                gestureEnabled: false,
              }}
            />

            <Stack.Screen name="summary" options={{ headerShown: false }} />

            <Stack.Screen
              name="learning-hub"
              options={{ title: "Learning Hub" }}
            />

            <Stack.Screen
              name="daily-challenge"
              options={{
                title: "Daily Challenge",
                headerBackVisible: false,
                gestureEnabled: false,
              }}
            />

            <Stack.Screen
              name="review"
              options={{
                title: "Review",
                headerBackVisible: false,
                gestureEnabled: false,
              }}
            />

            <Stack.Screen
              name="category-select"
              options={{ title: "Choose Category" }}
            />

            <Stack.Screen name="settings" options={{ title: "Settings" }} />

            <Stack.Screen
              name="out-of-hearts"
              options={{
                title: "Out of Hearts",
                headerBackVisible: false,
                gestureEnabled: false,
              }}
            />
          </Stack>

          {/* Global overlays */}
          <LevelUpModal />
          <BadgeUnlockModal />
        </GamificationProvider>
      </GameProvider>
    </SafeAreaProvider>
  );
}
