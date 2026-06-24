# Building Standalone APK & IPA for CampusRide

This guide will help you build and share your CampusRide app with others.

## Prerequisites

1. **Node.js & npm** installed
2. **Expo CLI** installed:
   ```bash
   npm install -g expo-cli
   ```
3. **EAS CLI** installed:
   ```bash
   npm install -g eas-cli
   ```
4. **Expo Account** (free):
   - Sign up at [expo.dev](https://expo.dev)

## Step-by-Step Build Process

### Step 1: Create Expo Account & Login

```bash
# Sign up at https://expo.dev
# Then login
eas login
```

You'll be prompted to enter your Expo credentials.

### Step 2: Link Project to EAS

```bash
cd mobile
eas init
```

This creates/updates `eas.json` and links your project.

---

## Building Android APK

The Android APK can be installed on **any Android phone** directly!

### Quick Build (Recommended)

```bash
cd mobile
eas build --platform android --local
```

**Flags:**
- `--local` - Build on your machine (faster, free)
- Remove `--local` to build on EAS servers (slower but more reliable)

### What Happens:
1. Builds the Android APK
2. Generates `.apk` file
3. Provides download link or uploads to EAS

### Output:
```
✅ Android APK built successfully!
📥 Download: https://exp-shell-app-artifacts.s3.amazonaws.com/...
```

**Save this link** - you can share it with others!

### Install on Android Phone:
1. Download the `.apk` file on your phone
2. Open file manager → tap `.apk`
3. Tap "Install"
4. Grant permissions
5. App is ready to use!

---

## Building iOS IPA

The iOS IPA requires Apple Developer Account ($99/year).

### Prerequisites for iOS:
- macOS computer (required)
- Apple ID (free)
- Xcode (free from App Store)
- Apple Developer Account ($99/year) - optional, for App Store submission

### Build Process:

```bash
cd mobile
eas build --platform ios
```

### iOS Build Options:

**Option A: Internal Distribution (Easiest)**
```bash
eas build --platform ios --local
```
- Generates `.ipa` file
- Can be installed via TestFlight (free, up to 100 testers)
- No App Store submission needed

**Option B: App Store Submission**
```bash
eas build --platform ios
eas submit --platform ios
```
- Publishes to Apple App Store
- Requires Apple Developer membership ($99/year)
- Takes 1-3 days for review

### Install iOS IPA:

**Via TestFlight (Recommended):**
1. Upload `.ipa` to TestFlight in App Store Connect
2. Invite testers (up to 100)
3. Testers download TestFlight app and install

**Direct Installation:**
- Use Xcode or Apple Configurator 2
- More complex process

---

## Build Commands Reference

| Command | Platform | Output | Share |
|---------|----------|--------|-------|
| `eas build --platform android --local` | Android | `.apk` file | Direct download link |
| `eas build --platform android` | Android | `.apk` file | EAS dashboard |
| `eas build --platform ios --local` | iOS | `.ipa` file | TestFlight or direct |
| `eas build --platform ios` | iOS | `.ipa` file | TestFlight recommended |

---

## Sharing Your App

### Android APK (Easiest):

1. **Build the APK:**
   ```bash
   eas build --platform android --local
   ```

2. **Get the download link** from the build output

3. **Share link with others:**
   - Send via email, WhatsApp, Telegram
   - Post on GitHub releases
   - Upload to Google Drive and share

4. **Recipients install by:**
   - Downloading `.apk` file
   - Opening it on Android phone
   - Tapping "Install"

### iOS IPA:

1. **Create TestFlight build:**
   ```bash
   eas build --platform ios
   ```

2. **Go to App Store Connect:**
   - https://appstoreconnect.apple.com
   - Add your IPA build to TestFlight
   - Invite testers by email

3. **Testers get link via email** to download TestFlight and install

---

## Environment Setup Before Building

Update your `.env` file with correct backend URLs:

```bash
cd mobile
cp .env.example .env
```

**Edit `.env`:**
```
EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-backend-domain.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

⚠️ **Important:** Use HTTPS and proper domain names (not localhost)

---

## Troubleshooting

### Build Fails - "No Android Device"
```bash
# Skip local build, use EAS servers
eas build --platform android
```

### "EAS credentials required"
```bash
eas build --platform android --local
```

### App crashes on launch
- Check `.env` file is correct
- Ensure backend API is running and accessible
- Check network connectivity on test device

### APK too large
- Use `--release` flag
- Optimize images and assets
- Remove unused dependencies

---

## Publishing to App Stores

### Google Play Store (Android):

```bash
# Build APK
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

Requires:
- Google Play Developer account ($25 one-time)
- Review process (2-4 hours)

### Apple App Store (iOS):

```bash
# Build IPA
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

Requires:
- Apple Developer membership ($99/year)
- Review process (1-3 days)

---

## Useful Links

- **EAS Documentation:** https://docs.expo.dev/build/introduction/
- **Expo Go:** https://expo.dev/client
- **TestFlight:** https://testflight.apple.com
- **Google Play Console:** https://play.google.com/console
- **App Store Connect:** https://appstoreconnect.apple.com

---

## Quick Sharing Steps

### For Android:
```bash
cd mobile
eas build --platform android --local
# Share the download link provided
```

### For iOS:
```bash
cd mobile
eas build --platform ios
# Use TestFlight for easy sharing
```

---

**Need Help?**
- Check build logs: `eas build --status`
- View documentation: https://docs.expo.dev
- Ask in Expo forums: https://forums.expo.dev

Good luck! 🚀
