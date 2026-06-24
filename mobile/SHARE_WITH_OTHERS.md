# 📱 How to Share Your CampusRide App

## Option 1: Direct APK Share (Easiest for Android)

### Build:
```bash
cd mobile
eas build --platform android --local
```

### Get Link:
After build completes, you'll see:
```
✅ Build finished!
📥 Download: https://exp-shell-app-artifacts.s3.amazonaws.com/android-xyz.apk
```

### Share the Link:

**Via Email:**
```
Subject: CampusRide App - Download
Body: Download our campus shuttle app here: [link]
Instructions: Open link on Android phone → Download → Install
```

**Via WhatsApp/Telegram:**
```
🚌 Download CampusRide:
[download link]

📥 Install:
1. Open link on Android
2. Tap download
3. Open file manager
4. Tap .apk file
5. Tap Install ✅
```

**Via QR Code:**
1. Use QR code generator: https://qr-code-generator.com
2. Paste download link
3. Generate QR code
4. Share QR image
5. Users scan to download

**Via GitHub Releases:**
1. Go to repo: https://github.com/Emires198/campusride
2. Click "Releases"
3. Create new release
4. Upload `.apk` file
5. Share release link

---

## Option 2: TestFlight for iOS (Apple Devices)

### Build:
```bash
cd mobile
eas build --platform ios
```

### Setup TestFlight:
1. Go to App Store Connect: https://appstoreconnect.apple.com
2. Login with Apple ID
3. Select your app
4. Go to TestFlight
5. Add your build
6. Invite testers by email (up to 100)

### Testers get:
- Email invitation
- Open TestFlight app
- Install CampusRide
- Ready to use!

---

## Option 3: Google Play Store (Professional)

### Requirements:
- Google Play Developer account ($25 one-time)
- Build APK

### Steps:
```bash
# Build
cd mobile
eas build --platform android

# Submit
eas submit --platform android
```

### Benefits:
- ✅ Professional distribution
- ✅ Automatic updates
- ✅ Millions of users can discover
- ✅ Reviews and ratings

### Timeline:
- Review: 2-4 hours
- Live on Play Store: Instant

---

## Option 4: Apple App Store (Professional iOS)

### Requirements:
- Apple Developer membership ($99/year)
- Build IPA

### Steps:
```bash
# Build
cd mobile
eas build --platform ios

# Submit
eas submit --platform ios
```

### Timeline:
- Review: 1-3 days
- Live on App Store: Instant after approval

---

## Comparison

| Method | Platform | Cost | Setup Time | Users Can Find | Automatic Updates |
|--------|----------|------|-----------|---------------|-----------|
| Direct APK Link | Android | Free | 10 min | ❌ Manual share | Manual |
| TestFlight | iOS | Free | 15 min | ❌ Invite only | ✅ Yes |
| Google Play | Android | $25 | 1 day | ✅ Can search | ✅ Automatic |
| App Store | iOS | $99/yr | 1 day | ✅ Can search | ✅ Automatic |

---

## Recommended Path

### For Testing/Beta:
```bash
# Android - Share APK link
eas build --platform android --local

# iOS - Use TestFlight
eas build --platform ios
```

### For Production:
```bash
# Google Play Store
eas build --platform android && eas submit --platform android

# Apple App Store
eas build --platform ios && eas submit --platform ios
```

---

## Templates for Sharing

### Email Template:
```
Subject: Try Our New CampusRide Campus Shuttle App!

Hi,

We're excited to share our campus shuttle booking app with you!

📱 Download CampusRide:
[INSERT DOWNLOAD LINK]

✨ Features:
• Real-time bus tracking
• Easy ride booking
• Digital wallet
• Live location updates

📥 Installation:
1. Click the download link above
2. On Android: Open the APK file and tap Install
3. On iOS: Install TestFlight app first, then use invitation email
4. Sign in with your student account

💬 Feedback: Let us know what you think!

Happy rides!
```

### Social Media Template:
```
🚌 Meet CampusRide - Your Campus Shuttle App!

✨ Real-time tracking
💳 Digital wallet
🎫 Easy booking
📍 Live GPS updates

📱 Download now: [link]

#CampusRide #StudentApp #ShuttleService
```

---

## Support Information

### Installation Issues:
- Check phone has Android 7+ or iOS 12+
- Ensure you have 50MB free space
- Try restarting phone

### App Crashes:
- Make sure backend API is running
- Check `.env` configuration
- Clear app data and reinstall

### Permission Issues:
- Grant location permission when prompted
- For Android: Go to Settings → Apps → CampusRide → Permissions
- For iOS: Settings → CampusRide → Location

---

## Analytics & Feedback

After sharing, track:
- Number of downloads
- User feedback
- Crash reports
- Feature requests

Use this to:
- Improve the app
- Fix bugs
- Add requested features

---

**Ready to share? Start with:**
```bash
cd mobile && eas build --platform android --local
```
