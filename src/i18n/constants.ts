export const APP_LANGUAGE_KEY = "@truth_or_heresy_language";

export const SUPPORTED_LANGUAGES = [
  { code: "en" as const, nativeName: "English" },
  { code: "es" as const, nativeName: "Español" },
];

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];
