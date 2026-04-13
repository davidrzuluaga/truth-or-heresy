import AsyncStorage from "@react-native-async-storage/async-storage";
import { GamificationData, DEFAULT_DATA } from "./types";

const STORAGE_KEY = "@truth_or_heresy_gamification";

export async function loadGamificationData(): Promise<GamificationData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export async function saveGamificationData(
  data: GamificationData
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silently fail
  }
}
