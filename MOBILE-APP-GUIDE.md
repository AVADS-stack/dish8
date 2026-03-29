# Dish8 — iOS & Android App Publishing Guide

Your web app is wrapped as a native app using Capacitor. The same codebase powers the website, iOS app, and Android app.

---

## Prerequisites

### For iOS (App Store)
- A **Mac** with macOS 13+ (required by Apple — no way around this)
- **Xcode 15+** installed from Mac App Store
- **Apple Developer Account** ($99/year) — [developer.apple.com](https://developer.apple.com)
- Apple Developer Program enrollment approved

### For Android (Google Play)
- **Android Studio** installed — [developer.android.com/studio](https://developer.android.com/studio)
- Works on Mac, Windows, or Linux
- **Google Play Developer Account** ($25 one-time) — [play.google.com/console](https://play.google.com/console)

---

## iOS App — Step by Step

### 1. Open the iOS project

```bash
cd /storage2/aveerappa/website
npm run build
npx cap sync ios
npx cap open ios
```

This opens the project in Xcode.

### 2. Configure in Xcode

1. Select the **App** target in the project navigator
2. Under **General**:
   - Display Name: `Dish8`
   - Bundle Identifier: `com.dish8.app`
   - Version: `1.0.0`
   - Build: `1`
3. Under **Signing & Capabilities**:
   - Team: Select your Apple Developer team
   - Check "Automatically manage signing"
4. Under **Info**:
   - Add `Privacy - Location When In Use Usage Description`: "Dish8 uses your location to suggest nearby delivery addresses"

### 3. App Icons

You need app icons in these sizes. Use a tool like [appicon.co](https://www.appicon.co/) to generate all sizes from a single 1024x1024 PNG:

1. Create a 1024x1024 PNG of the Dish8 logo (red background, white DISH8 text)
2. Upload to appicon.co → download the iOS icon set
3. In Xcode, open `ios/App/App/Assets.xcassets/AppIcon.appiconset`
4. Replace the placeholder icons with your generated icons

### 4. Splash Screen

1. In Xcode, open `ios/App/App/Assets.xcassets/Splash.imageset`
2. Replace with a dark (#141414) image with the Dish8 logo centered
3. The Capacitor config already sets `backgroundColor: "#141414"`

### 5. Test on Simulator

1. In Xcode, select an iPhone simulator (e.g., iPhone 16 Pro)
2. Click the Play button (or Cmd+R)
3. Test the full flow: signup → subscribe → order

### 6. Build for App Store

1. In Xcode: **Product → Archive**
2. In the Organizer window, click **Distribute App**
3. Choose **App Store Connect**
4. Follow the prompts to upload

### 7. Submit in App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create a new app:
   - Name: `Dish8 — Food Delivery`
   - Primary Language: English
   - Bundle ID: `com.dish8.app`
   - SKU: `dish8`
3. Fill in:
   - Description, keywords, categories (Food & Drink)
   - Screenshots (take from simulator for each required size)
   - App Review Information
   - Privacy Policy URL: `https://www.dish8.com/privacy`
4. Select your build → Submit for Review

**Apple review typically takes 1-3 days.**

---

## Android App — Step by Step

### 1. Open the Android project

```bash
cd /storage2/aveerappa/website
npm run build
npx cap sync android
npx cap open android
```

This opens the project in Android Studio.

### 2. Configure in Android Studio

1. Open `android/app/build.gradle`
2. Verify:
   - `applicationId "com.dish8.app"`
   - `versionCode 1`
   - `versionName "1.0.0"`
   - `minSdk 23` (Android 6.0+)
   - `targetSdk 34`

### 3. App Icons

1. In Android Studio: **File → New → Image Asset**
2. Select **Launcher Icons (Adaptive and Legacy)**
3. Upload your 1024x1024 Dish8 logo
4. Set background color to `#e50914` (Dish8 red)
5. Click **Next → Finish** — generates all required sizes

### 4. Splash Screen

The Capacitor config already handles the splash screen with `backgroundColor: "#141414"`.

For a custom splash image:
1. Place your splash image in `android/app/src/main/res/drawable/splash.png`
2. It will display during app launch

### 5. Test on Emulator or Device

1. In Android Studio, create an AVD (Android Virtual Device) or connect a physical device
2. Click the Run button (green triangle)
3. Test the full flow

### 6. Build Release APK / AAB

```bash
cd android
./gradlew assembleRelease    # APK
./gradlew bundleRelease      # AAB (required for Play Store)
```

Or in Android Studio: **Build → Generate Signed Bundle / APK**

You'll need to create a keystore:
```bash
keytool -genkey -v -keystore dish8-release.keystore -alias dish8 -keyalg RSA -keysize 2048 -validity 10000
```

### 7. Submit to Google Play

1. Go to [play.google.com/console](https://play.google.com/console)
2. Create a new app:
   - App name: `Dish8 — Food Delivery`
   - Default language: English
   - App type: App
   - Free / Paid: Free (revenue is through subscriptions)
   - Category: Food & Drink
3. Complete the store listing:
   - Short description (80 chars): "19+ world cuisines delivered. $9.99/meal."
   - Full description
   - Screenshots (phone, tablet)
   - Feature graphic (1024×500)
   - Privacy Policy URL: `https://www.dish8.com/privacy`
4. Upload your AAB file to **Production → Create new release**
5. Submit for review

**Google review typically takes a few hours to 2 days.**

---

## Updating the Apps

Whenever you update the website:

```bash
npm run build
npx cap sync
```

Then rebuild and resubmit in Xcode / Android Studio.

Since the app loads from `https://www.dish8.com` (configured in `capacitor.config.json`), most updates to the website are **instant** — no app store update needed. Only native-level changes (icons, permissions, plugins) require a new app submission.

---

## App Store Listing Copy

### App Name
`Dish8 — Food Delivery`

### Subtitle (iOS)
`19+ World Cuisines, $9.99/Meal`

### Short Description (Android)
`Explore 19+ world cuisines Netflix-style. Fresh meals delivered for just $9.99 each.`

### Full Description
```
Dish8 brings the world's finest cuisines to your doorstep.

Browse 19+ cuisines Netflix-style — from Italian and Japanese to Ethiopian and Peruvian. Build your weekly meal plan with 2 appetizers, a main course, and a side dish for each meal.

FEATURES:
• 700+ dishes across 19 world cuisines
• Netflix-style browsing by cuisine genre
• Weekly meal planner
• Flexible ordering — by day, week, or month
• $9.99 per meal, delivery included
• Subscription plans from $99.99/month

HOW IT WORKS:
1. Subscribe — Choose Lunch, Dinner, or Both
2. Browse — Explore cuisines and pick your dishes
3. Order — For a day, a week, or the full month
4. Enjoy — Fresh meals delivered within 24 hours

Order at least 24 hours in advance. Delivery included in meal price. State taxes extra.
```

### Keywords (iOS)
`food delivery, meal prep, cuisine, subscription, lunch, dinner, weekly meals, world food`

### Category
Food & Drink

### Content Rating
Everyone / 4+

---

## Important Notes

- The app uses your **live website URL** (`https://www.dish8.com`) so most updates don't require an app store resubmission
- Apple requires apps that accept payments to use **In-App Purchase** if the service is consumed within the app. Since Dish8 delivers physical food, you can use Stripe (external payment) — this is allowed under Apple's guidelines for physical goods/services
- Keep your keystore file (`dish8-release.keystore`) safe — you need it for every Android update
