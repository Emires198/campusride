# CampusRide Mobile App

Cross-platform mobile application for campus shuttle services built with React Native and Expo.

## Features

✅ **User Authentication** - Secure login and registration
✅ **Bus Booking** - Reserve seats on available routes
✅ **Real-time Tracking** - Live GPS tracking of buses with WebSocket updates
✅ **Digital Wallet** - Add funds and track spending
✅ **User Profile** - Manage personal information
✅ **Push Notifications** - Get alerts for booking confirmations and bus arrivals

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** AsyncStorage + Context API
- **Maps:** React Native Maps
- **Real-time:** Socket.io
- **HTTP Client:** Axios
- **Location:** Expo Location
- **Styling:** React Native StyleSheet

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for simulator) or iPhone with Expo Go
- Android: Android Studio (for emulator) or Android device with Expo Go

## Installation

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL and API keys
   ```

4. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

## Running on Different Platforms

### iOS Simulator (macOS only)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Expo Go App
1. Download Expo Go from App Store or Google Play
2. Scan the QR code from `npm start` output
3. App loads instantly on your device

### Web (Browser)
```bash
npm run web
```

## Project Structure

```
mobile/
├── app/
│   ├── screens/              # Screen components
│   │   ├── LoginScreen.js
│   │   ├── BookingScreen.js
│   │   ├── TrackingScreen.js
│   │   ├── WalletScreen.js
│   │   └── ProfileScreen.js
│   ├── services/             # API and business logic
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   ├── walletService.js
│   │   └── trackingService.js
│   └── config/
│       └── api.js            # Axios configuration
├── App.js                    # Navigation setup
├── app.json                  # Expo configuration
├── package.json
└── README.md
```

## API Integration

The app connects to the CampusRide backend API. Make sure your backend is running:

```bash
cd backend
python run.py
```

Update the `.env` file with your backend URL.

## Features in Detail

### Authentication
- User registration with email and password
- JWT-based authentication
- Automatic token refresh
- Secure token storage with AsyncStorage

### Booking System
- Browse available routes
- View bus schedules and fares
- Make seat reservations
- Cancel bookings
- View booking history

### Real-time Tracking
- Live bus location updates via WebSocket
- Student location sharing
- ETA calculation
- Route visualization on map

### Wallet Management
- Add funds via payment gateway
- View wallet balance
- Transaction history
- Payment verification

### User Profile
- View and edit personal information
- Hostel assignment
- Academic level
- Account settings

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

You'll need to set up EAS (Expo Application Services) credentials first.

## Troubleshooting

### Port already in use
```bash
kill -9 $(lsof -t -i :19000)
kill -9 $(lsof -t -i :19001)
```

### Module not found errors
```bash
npm install
rm -rf node_modules
npm install
```

### Connection refused errors
- Ensure backend API is running
- Check API_URL in .env
- Verify network connectivity

### Location permission issues
- Grant location permission in app settings
- On Android, ensure location is enabled
- On iOS, check Info.plist permissions

## Testing

```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

GNU General Public License v3.0

## Support

For issues and questions, please open an issue on GitHub.
