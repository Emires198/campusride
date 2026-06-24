# 🚀 Quick Start: Build & Share Your CampusRide App

## 5-Minute Setup

### Step 1: Install Required Tools
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI (for building APK/IPA)
npm install -g eas-cli
```

### Step 2: Setup Expo Account
1. Go to https://expo.dev
2. Click "Sign Up"
3. Create free account
4. Login in terminal:
   ```bash
   eas login
   ```

### Step 3: Prepare Mobile Directory
```bash
cd campusride/mobile
npm install
```

### Step 4: Update Environment
```bash
cp .env.example .env
# Edit .env with your backend URL
```

---

## Build Android APK (Easy - 10 minutes)

### Command:
```bash
cd mobile
eas build --platform android --local
```

### What happens:
1. ✅ Compiles your React Native code
2. ✅ Creates Android APK file
3. ✅ Provides download link

### Download & Share:
- **Save the download link**
- Share via email, WhatsApp, Telegram, etc.
- Recipients download `.apk` and tap to install

### Installation on Android Phone:
1. Download `.apk` file
2. Open file manager
3. Tap the `.apk` file
4. Tap "Install"
5. Done! ✅

---

## Build iOS IPA (Medium - 20 minutes)

### Command:
```bash
cd mobile
eas build --platform ios
```

### Requirements:
- Apple ID (free)
- Xcode (free, from App Store on Mac)

### Share via TestFlight:
1. Build completes
2. Go to App Store Connect
3. Create TestFlight build
4. Invite testers by email
5. They download TestFlight app and install

---

## Full Reference

For detailed instructions, see: **[BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)**

---

## Common Issues

### "Command not found: eas"
```bash
npm install -g eas-cli
```

### "Build failed"
Check that:
- ✅ You're in the `mobile/` directory
- ✅ You ran `npm install`
- ✅ You logged in: `eas login`
- ✅ `.env` file is configured

### "App crashes after install"
Update `.env` with correct backend URL (not localhost)

---

## Next Steps After Building

### For Android APK:
- ✅ Share download link
- ✅ Users install directly
- ✅ Update always via new APK

### For iOS IPA:
- ✅ Use TestFlight
- ✅ Invite testers
- ✅ Later: Submit to App Store

### For Production:
- 📦 Google Play Store ($25)
- 🍎 Apple App Store ($99/year)

---

**You're ready! Start building:**
```bash
cd mobile && eas build --platform android --local
```
