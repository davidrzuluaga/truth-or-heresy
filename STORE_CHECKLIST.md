# Store Submission Checklist — Truth or Heresy

Everything scaffolded on the **code** side is done. This file lists only the
steps that require **you** — human decisions, paid accounts, or external
services.

Work roughly top-to-bottom. Anything marked 🔴 is a blocker for submission.

---

## 0 · Accounts & one-time setup

- [ ] 🔴 **Apple Developer Program** membership — $99/year. Sign up at
      https://developer.apple.com/programs/. 24–48h to approve.
- [ ] 🔴 **Google Play Console** — $25 one-time. Sign up at
      https://play.google.com/console/signup.
- [ ] 🔴 **Install EAS CLI + log in:**
      ```bash
      npm install -g eas-cli
      eas login
      eas init          # creates project, fills extra.eas.projectId in app.json
      ```
- [ ] **RevenueCat account** — free tier is fine until you hit $10k MTR.
      Sign up at https://www.revenuecat.com/. Create a new project.

## 1 · App identity you own

- [ ] 🔴 **Confirm bundle IDs** in `app.json`:
      - iOS: `com.truthorheresy.app`
      - Android: `com.truthorheresy.app`
      You cannot change these after first submission. Change now if you
      want a different reverse-DNS prefix (e.g. `com.yourname.truthorheresy`).
- [ ] **Fill `app.json`:**
      - `extra.eas.projectId` — populated by `eas init`
      - `owner` — your Expo org slug (optional, for team accounts)
- [ ] **Fill `eas.json` → `submit.production.ios`:**
      - `appleId` — your Apple ID email
      - `ascAppId` — App Store Connect numeric app ID (you'll get this when
        you create the app record in step 3)
      - `appleTeamId` — 10-char Team ID from Apple Developer → Membership

## 2 · Assets (required, currently missing)

Drop these into an `assets/` folder at the repo root. Paths are already wired
in `app.json`:

- [ ] 🔴 `assets/icon.png` — **1024×1024 PNG, no transparency, no rounded
      corners.** Apple auto-rounds it.
- [ ] 🔴 `assets/adaptive-icon.png` — **1024×1024 PNG with transparency**,
      foreground layer only (bg color is #09090b per `app.json`).
- [ ] 🔴 `assets/splash.png` — **1242×2436 PNG** (taller is fine, Expo scales).
      Centered logo on #09090b works best.
- [ ] `assets/favicon.png` — **48×48 PNG** for web build.

Tool tip: I recommend generating these from a single 1024 master with
[icon.kitchen](https://icon.kitchen) or Figma. Verify with
`npx expo-doctor` after adding.

## 3 · App Store Connect (iOS)

- [ ] 🔴 Log into https://appstoreconnect.apple.com → **My Apps → +** → **New App**
      - Platform: iOS
      - Name: `Truth or Heresy`
      - Primary language: English (U.S.)
      - Bundle ID: `com.truthorheresy.app` (must match, create matching
        App ID in Apple Developer → Identifiers first)
      - SKU: anything, e.g. `toh-1`
- [ ] 🔴 Copy the numeric **App Store Connect app ID** (URL bar, e.g.
      `/apps/1234567890`) into `eas.json` → `ascAppId`.
- [ ] 🔴 **App Store → Pricing and Availability** → set Free + all
      territories.
- [ ] 🔴 **App Privacy** → fill the questionnaire. Since we collect nothing:
      - "Data Collection: NO" on the top-level toggle. Done.
- [ ] 🔴 **App Information:**
      - Paste copy from `STORE_LISTING.md`
      - Primary Category: Education
      - Secondary Category: Reference
      - Privacy Policy URL: host `PRIVACY.md` publicly, paste link
      - Support URL: required, even a GitHub issues link works
- [ ] 🔴 **App Review Information** → paste reviewer notes from
      `STORE_LISTING.md`.
- [ ] 🔴 Upload screenshots (see `STORE_LISTING.md` → Screenshot plan).

## 4 · Google Play Console (Android)

- [ ] 🔴 https://play.google.com/console → **Create app**
      - App name: `Truth or Heresy`
      - Default language: English (United States)
      - App / Game: **App**
      - Free / Paid: **Free** (IAP is separate)
      - Accept policies
- [ ] 🔴 **Set up your app** tasks:
      - Privacy Policy URL — host `PRIVACY.md`, paste link
      - App access — "All functionality available without special access"
      - Ads — "No ads"
      - Content rating — fill questionnaire (Everyone)
      - Target audience — 18+ is easiest; 13+ triggers additional scrutiny
      - News app — No
      - COVID-19 tracing — No
      - Data safety — "No data collected or shared"
      - Government app — No
- [ ] 🔴 **Main store listing** — paste from `STORE_LISTING.md`.
- [ ] 🔴 **Testing → Internal testing** → create track → invite yourself
      and 1+ tester by email. **You must keep ≥12 testers actively opted-in
      for 14 days before you can promote to Production** (new-developer
      rule, enforced since 2024).
- [ ] **Create a service account for EAS submit:**
      1. Play Console → **Users and permissions** → **Invite service
         account** (via Google Cloud console linked from there)
      2. Download JSON key → save as `play-service-account.json` at repo
         root (already gitignored)
      3. Grant it "Release manager" role on your app

## 5 · In-app purchases

### Apple side

- [ ] 🔴 App Store Connect → your app → **In-App Purchases → +**
      - Type: **Non-Consumable**
      - Reference name: `Premium Unlock`
      - Product ID: **`com.truthorheresy.app.premium.unlock`** (must match
        `PRODUCT_IDS.premiumUnlock` in `src/revenuecat.ts`)
      - Pricing: Tier 5 ($4.99 USD)
      - Localized display name + description
      - Review screenshot (required — screenshot of `/paywall`)

### Google side

- [ ] 🔴 Play Console → your app → **Monetize → Products → In-app products → Create**
      - Product ID: **`com.truthorheresy.app.premium.unlock`** (same string)
      - Name, description, price ($4.99)
      - Activate

### RevenueCat side

- [ ] 🔴 RevenueCat dashboard → Project → **Entitlements** → create
      `premium`
- [ ] 🔴 **Products** → add both store products (import from App Store
      Connect + Play Console using the API keys you paste in RC's project
      settings). Attach both to the `premium` entitlement.
- [ ] 🔴 **Offerings** → create `default` offering → attach a single package
      wrapping the product.
- [ ] 🔴 Copy **public SDK keys** (Apple + Android) from RC → Project →
      API keys. Paste into `src/revenuecat.ts`:
      ```ts
      const IOS_KEY = "appl_XXXXXXXXXXXXXXXXXXXX";
      const ANDROID_KEY = "goog_XXXXXXXXXXXXXXXXXXXX";
      ```
      (Prefer reading from `app.config.ts` → `extra` → `expo-constants`, or
      `.env` + `expo-constants`, so the keys aren't in git.)

### Install the real SDK

- [ ] 🔴
      ```bash
      npx expo install react-native-purchases
      ```
- [ ] 🔴 Uncomment the TODO blocks in `src/revenuecat.ts` (each function
      has the exact replacement code commented above the stub).
- [ ] 🔴 In `src/premium.tsx`, replace the AsyncStorage-backed
      `isPremium` with a subscription to RevenueCat:
      ```ts
      useEffect(() => {
        getCurrentCustomerInfo().then((info) => setIsPremium(info.hasPremium));
        const unsub = addCustomerInfoListener((info) => setIsPremium(info.hasPremium));
        return unsub;
      }, []);
      ```
      Remove the `setPremium` dev toggle and the "Reset (dev)" button on
      `/paywall`. Wire the "Unlock Premium" button to `purchasePremium()`.

## 6 · Legal pages (hosted)

Both stores require a **live, public URL** for your privacy policy.
Easiest options:

- GitHub Pages: push `PRIVACY.md` to a `docs/` folder, enable Pages on the
  repo, URL is `https://yourusername.github.io/truth-or-heresy/privacy.html`
- Notion: make the page public
- A simple single-page site on Netlify or Vercel

Do the same for `TERMS.md` (App Store requires this if you have IAP).

Fill in the `REPLACE_ME` placeholders in both files:
- Contact email
- Governing jurisdiction (Terms only)

## 7 · Build & submit

Once everything above is done:

```bash
# Production builds (cloud, ~15-30 min each)
eas build --platform ios --profile production
eas build --platform android --profile production

# Upload to the stores
eas submit --platform ios --latest
eas submit --platform android --latest
```

- **iOS**: submission lands in App Store Connect → TestFlight within
  ~30 min. Test on a real device, then submit for review from App Store
  Connect. Review time: typically 24–48h.
- **Android**: submission lands in your **Internal testing** track per
  `eas.json`. Promote to **Closed testing** → run the 14-day / 12-tester
  period → promote to **Production**.

## 8 · Post-launch housekeeping

- [ ] Set up a Sentry or similar crash reporter (optional but wise — make
      sure the privacy policy is updated if you add any analytics)
- [ ] Watch RevenueCat dashboard for failed purchases
- [ ] Write a short email autoresponder for the support address

---

## Known repo quirks I noticed

- `node_modules/` is currently tracked in git (37k files). This won't
  block submission, but you may want to clean it up one day:
  ```bash
  git rm -r --cached node_modules
  git commit -m "Untrack node_modules"
  ```
  The new `.gitignore` already excludes it for future installs.
