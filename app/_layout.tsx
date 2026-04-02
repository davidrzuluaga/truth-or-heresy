import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider } from "../src/context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GameProvider>
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
          {/* Home — no header */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Quiz — header injected inside the screen via <Stack.Screen> */}
          <Stack.Screen
            name="quiz"
            options={{ title: "Truth or Heresy?" }}
          />

          {/* Heresy picker */}
          <Stack.Screen
            name="heresy-selector"
            options={{ title: "Name That Heresy!" }}
          />

          {/* Explanation — no back (must tap Next Question) */}
          <Stack.Screen
            name="explanation"
            options={{
              title: "The Verdict",
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />

          {/* Summary — full screen, no header */}
          <Stack.Screen name="summary" options={{ headerShown: false }} />

          {/* Settings */}
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
      </GameProvider>
    </SafeAreaProvider>
  );
}
