/**
 * RevenueCat scaffold.
 *
 * This module is a no-op stub that defines the API surface we'll use once
 * `react-native-purchases` is installed. The rest of the app imports from
 * here so that swapping in the real SDK is a single-file change.
 *
 * ──── Switching on the real SDK ────────────────────────────────────────
 *
 * 1. Install the SDK:
 *      npx expo install react-native-purchases
 *
 * 2. Add API keys from the RevenueCat dashboard (Project → API keys):
 *      - iOS public SDK key  → REVENUECAT_IOS_KEY
 *      - Android public SDK key → REVENUECAT_ANDROID_KEY
 *    Wire them through `expo-constants` (app.config.ts `extra`) or a
 *    dedicated env module — do NOT commit them.
 *
 * 3. Replace the TODO sections below with the real Purchases calls
 *    (signatures below match what the RevenueCat SDK exposes).
 *
 * 4. In `src/premium.tsx`, replace the AsyncStorage-backed `isPremium`
 *    source with a subscription to `Purchases.addCustomerInfoUpdateListener`
 *    + the result of `Purchases.getCustomerInfo()` → check
 *    `customerInfo.entitlements.active["premium"]`.
 *
 * 5. Products / Offerings:
 *      - Create a "premium" entitlement in the RevenueCat dashboard.
 *      - Create a one-time-purchase product (Apple: Non-Consumable,
 *        Google: In-App Product) with matching product IDs.
 *      - Attach both to a single Offering ("default") with a single
 *        Package so the paywall has a stable thing to show.
 */

import { Platform } from "react-native";

// ─── Types ─────────────────────────────────────────────────────────────
// These mirror react-native-purchases types so the call sites don't
// need to change when we swap the implementation.

export interface RCProduct {
  identifier: string;
  /** Localized e.g. "$4.99" */
  priceString: string;
  price: number;
  currencyCode: string;
  title: string;
  description: string;
}

export interface RCOffering {
  identifier: string;
  product: RCProduct;
}

export interface RCCustomerInfo {
  /** True if the "premium" entitlement is currently active. */
  hasPremium: boolean;
  /** Raw entitlement IDs that are active. */
  activeEntitlements: string[];
}

type CustomerInfoListener = (info: RCCustomerInfo) => void;

// ─── Config ────────────────────────────────────────────────────────────

const IOS_KEY: string | undefined = undefined; // TODO: process.env or expo-constants
const ANDROID_KEY: string | undefined = undefined; // TODO: process.env or expo-constants

/** Entitlement identifier configured in the RevenueCat dashboard. */
export const PREMIUM_ENTITLEMENT = "premium";

/** Offering identifier configured in the RevenueCat dashboard. */
export const DEFAULT_OFFERING = "default";

/**
 * Store product IDs. Use the SAME string on both platforms so
 * RevenueCat / App Store Connect / Play Console stay in lockstep.
 *
 *   - App Store Connect → In-App Purchases → Non-Consumable
 *   - Play Console → Monetize → Products → In-app products (one-time)
 *   - RevenueCat → Products → add both, attach to "premium" entitlement
 */
export const PRODUCT_IDS = {
  premiumUnlock: "com.truthorheresy.app.premium.unlock",
} as const;

let initialized = false;
const listeners = new Set<CustomerInfoListener>();

// ─── Public API ────────────────────────────────────────────────────────

/**
 * Initialize the SDK. Safe to call multiple times; no-op after first call.
 * Call once at app startup (e.g. in `_layout.tsx`).
 */
export async function initRevenueCat(appUserId?: string): Promise<void> {
  if (initialized) return;
  initialized = true;

  // TODO: replace with real SDK once installed:
  //
  //   import Purchases, { LOG_LEVEL } from "react-native-purchases";
  //   Purchases.setLogLevel(LOG_LEVEL.WARN);
  //   const apiKey = Platform.OS === "ios" ? IOS_KEY : ANDROID_KEY;
  //   if (!apiKey) throw new Error("RevenueCat key missing");
  //   await Purchases.configure({ apiKey, appUserID: appUserId ?? null });
  //   Purchases.addCustomerInfoUpdateListener((info) => {
  //     const mapped = mapCustomerInfo(info);
  //     listeners.forEach((l) => l(mapped));
  //   });

  if (__DEV__) {
    const key = Platform.OS === "ios" ? IOS_KEY : ANDROID_KEY;
    // eslint-disable-next-line no-console
    console.log(
      "[revenuecat] stub init",
      { appUserId, hasKey: !!key, platform: Platform.OS }
    );
  }
}

/**
 * Fetch the default offering (the single product we sell). Returns null
 * if the SDK isn't configured yet.
 */
export async function fetchDefaultOffering(): Promise<RCOffering | null> {
  // TODO: replace with real SDK:
  //
  //   const offerings = await Purchases.getOfferings();
  //   const offering = offerings.all[DEFAULT_OFFERING] ?? offerings.current;
  //   const pkg = offering?.availablePackages[0];
  //   if (!pkg) return null;
  //   return {
  //     identifier: pkg.identifier,
  //     product: {
  //       identifier: pkg.product.identifier,
  //       priceString: pkg.product.priceString,
  //       price: pkg.product.price,
  //       currencyCode: pkg.product.currencyCode,
  //       title: pkg.product.title,
  //       description: pkg.product.description,
  //     },
  //   };

  return null;
}

/**
 * Purchase the premium unlock. Throws on failure.
 * Caller is responsible for reflecting the new entitlement in app state
 * (the CustomerInfo listener in `src/premium.tsx` will handle that).
 */
export async function purchasePremium(offering: RCOffering): Promise<RCCustomerInfo> {
  // TODO: replace with real SDK:
  //
  //   const { customerInfo } = await Purchases.purchasePackage(pkg);
  //   return mapCustomerInfo(customerInfo);

  throw new Error(
    "RevenueCat not configured yet. Use the DEV toggle on /paywall."
  );
}

/**
 * Restore prior purchases (required by Apple App Review).
 */
export async function restorePurchases(): Promise<RCCustomerInfo> {
  // TODO: replace with real SDK:
  //
  //   const customerInfo = await Purchases.restorePurchases();
  //   return mapCustomerInfo(customerInfo);

  return { hasPremium: false, activeEntitlements: [] };
}

/**
 * One-shot read of current entitlements.
 */
export async function getCurrentCustomerInfo(): Promise<RCCustomerInfo> {
  // TODO: replace with real SDK:
  //
  //   const customerInfo = await Purchases.getCustomerInfo();
  //   return mapCustomerInfo(customerInfo);

  return { hasPremium: false, activeEntitlements: [] };
}

/**
 * Subscribe to entitlement changes. Returns an unsubscribe function.
 */
export function addCustomerInfoListener(fn: CustomerInfoListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ─── Internal helpers (for when we wire the real SDK) ───────────────────

// function mapCustomerInfo(info: PurchasesCustomerInfo): RCCustomerInfo {
//   const active = Object.keys(info.entitlements.active);
//   return {
//     hasPremium: active.includes(PREMIUM_ENTITLEMENT),
//     activeEntitlements: active,
//   };
// }
