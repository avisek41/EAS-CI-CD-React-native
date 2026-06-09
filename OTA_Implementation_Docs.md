# Expo EAS OTA Update Implementation - Technical Documentation

This document summarizes the technical troubleshooting, configuration fixes, and implementation steps completed to get Expo EAS OTA (Over-The-Air) updates working in the `AwesomeProject` React Native application.

## 1. Native Build Configuration Fixes

The initial attempt to build the Android application failed due to missing Expo Autolinking configurations in the native Android files. Specifically, the `:expo` module could not resolve the `compileSdk` version.

### Actions Taken:
- Ran `npx expo prebuild --clean --platform android` to regenerate the `android/` directory.
- This correctly injected the required Expo plugins into the Gradle configuration:
  - Added `expo-autolinking-settings` plugin to `settings.gradle`.
  - Added `expoAutolinking.useExpoModules()` and `expoAutolinking.useExpoVersionCatalog()` to `settings.gradle`.
  - Applied the `expo-root-project` plugin in the root `build.gradle`.

> [!WARNING]
> If you manually modify the `android/` or `ios/` folders in the future, be careful not to remove the `expoAutolinking` directives. Relying on `npx expo prebuild --clean` is the safest way to maintain a healthy native configuration.

---

## 2. Emulator Installation Issue

After compiling successfully, the build failed to install on the emulator with an `INSTALL_FAILED_VERSION_DOWNGRADE` error. 
- **Cause:** The emulator had a previously installed version of the app with `versionCode 19`. The freshly prebuilt project reset the version code to `1`. Android prevents downgrading app versions.
- **Fix:** Uninstalled the existing application from the emulator using ADB (`adb uninstall com.awesomeproject`).

---

## 3. JavaScript Entry Point Registration

The app crashed immediately upon launch with the error: `"main" has not been registered`.

### Root Cause:
The generated `MainActivity.kt` expected the JavaScript component to be registered under the name `"main"`. However, the original `index.js` file was registering the component using the `name` property from `app.json` (`"AwesomeProject"`).

### Fix Applied:
Modified `index.js` to explicitly register the component as `"main"`.

```javascript
// index.js
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('main', () => App);
```

---

## 4. Metro Bundler Configuration for EAS

When attempting an EAS Build (`npx eas build`), the `bundleDirectAsync` step failed with a JSON serialization error because the project was using the bare React Native Metro configuration. Expo's OTA update and embedding systems require a specific bundle output format.

### Fix Applied:
Updated `metro.config.js` to use `expo/metro-config` instead of `@react-native/metro-config`.

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
```

---

## 5. EAS Build and OTA Workflow Setup

With the configuration issues resolved, we successfully established the pipeline for OTA updates.

### A. Initial Base Build
We generated a base APK for the `qa` channel using EAS Build:
```bash
npx eas build --profile qa --platform android
```
This APK is installed on the device/emulator and serves as the foundation. It contains the compiled native code and the initial JavaScript bundle.

### B. OTA Update Workflow
To push updates over-the-air without requiring users to download a new APK, we established the following workflow:

1. **Make Code Changes:** Modify JavaScript/TypeScript or image assets (e.g., changes made to `App.tsx`).
2. **Publish the Update:** Run the EAS update command targeting the specific branch/channel.
   ```bash
   npx eas update --branch qa --message "Description of changes" --environment preview
   ```
3. **App Update Lifecycle:** 
   - When the user opens the app, it loads the currently cached JavaScript bundle instantly.
   - In the background, Expo checks for new updates on the `qa` branch matching the app's `runtimeVersion`.
   - The update is downloaded silently.
   - The next time the user completely closes and reopens the app, the new update is applied.

> [!IMPORTANT]
> **When to build a new APK vs. sending an OTA update:**
> - **OTA Updates (`eas update`):** Use for changing UI components, fixing JS logic bugs, updating text, or changing local image assets.
> - **New APK (`eas build`):** You **MUST** build a new APK if you install a new package that contains native code (e.g., a package that requires `pod install` or modifies `build.gradle`), or if you change the `runtimeVersion` in `app.json`.
