import "../global.css";
import "../src/i18n/config";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider } from "../src/context";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function RootStack() {
  const { t } = useTranslation();

  return (
    <>
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
          options={{ title: t("screens.quiz.title") }}
        />

        <Stack.Screen
          name="heresy-selector"
          options={{ title: t("screens.heresySelector.title") }}
        />

        <Stack.Screen
          name="explanation"
          options={{
            title: t("screens.explanation.title"),
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen name="summary" options={{ headerShown: false }} />

        <Stack.Screen
          name="settings"
          options={{ title: t("screens.settings.title") }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <GameProvider>
          <RootStack />
        </GameProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
