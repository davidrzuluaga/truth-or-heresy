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
const TEASER_KEY = "toh.premium.teaserShown.v1";

interface PremiumContextValue {
  /** True if the user has unlocked premium (all paths + infinite hearts). */
  isPremium: boolean;
  /** DEV ONLY — toggle the flag locally. Replace with real purchase flow. */
  setPremium: (value: boolean) => void;
  /** True while loading the stored flag from AsyncStorage. */
  loading: boolean;
  /** True if the first-launch paywall teaser has already been shown. */
  teaserShown: boolean;
  /** Mark the first-launch paywall teaser as shown. */
  markTeaserShown: () => void;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [teaserShown, setTeaserShown] = useState(true); // assume shown until loaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(TEASER_KEY),
    ])
      .then(([premium, teaser]) => {
        setIsPremium(premium === "1");
        setTeaserShown(teaser === "1");
      })
      .finally(() => setLoading(false));
  }, []);

  const setPremium = useCallback((value: boolean) => {
    setIsPremium(value);
    AsyncStorage.setItem(STORAGE_KEY, value ? "1" : "0").catch(() => {});
  }, []);

  const markTeaserShown = useCallback(() => {
    setTeaserShown(true);
    AsyncStorage.setItem(TEASER_KEY, "1").catch(() => {});
  }, []);

  return (
    <PremiumContext.Provider
      value={{ isPremium, setPremium, loading, teaserShown, markTeaserShown }}
    >
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
