import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "./config";
import { APP_LANGUAGE_KEY, AppLanguage, SUPPORTED_LANGUAGES } from "./constants";

function resolveInitialLanguage(): AppLanguage {
  const device = Localization.getLocales()[0]?.languageCode;
  if (device === "es") return "es";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
        const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
        if (stored && codes.includes(stored as AppLanguage)) {
          await i18n.changeLanguage(stored);
        } else {
          await i18n.changeLanguage(resolveInitialLanguage());
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#09090b",
        }}
      >
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return <>{children}</>;
}

export async function persistLanguage(lng: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(APP_LANGUAGE_KEY, lng);
  await i18n.changeLanguage(lng);
}
