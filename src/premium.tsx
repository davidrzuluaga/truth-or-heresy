/**
 * Premium / paywall context.
 *
 * For now this is backed by local AsyncStorage (dev toggle). When RevenueCat
 * is wired up, swap the `isPremium` state source to `Purchases.getCustomerInfo()`
 * and leave the rest of the consumer API unchanged.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "toh.premium.v1";

interface PremiumContextValue {
  /** True if the user has unlocked premium (all paths + infinite hearts). */
  isPremium: boolean;
  /** DEV ONLY — toggle the flag locally. Replace with real purchase flow. */
  setPremium: (value: boolean) => void;
  /** True while loading the stored flag from AsyncStorage. */
  loading: boolean;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => setIsPremium(v === "1"))
      .finally(() => setLoading(false));
  }, []);

  const setPremium = useCallback((value: boolean) => {
    setIsPremium(value);
    AsyncStorage.setItem(STORAGE_KEY, value ? "1" : "0").catch(() => {});
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium, setPremium, loading }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextValue {
  const ctx = useContext(PremiumContext);
  if (!ctx) {
    throw new Error("usePremium must be used inside <PremiumProvider>");
  }
  return ctx;
}
