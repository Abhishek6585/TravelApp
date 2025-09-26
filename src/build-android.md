# 📱 Kerala Travel Tracker - Android APK Build Guide

## 🚀 Complete Setup Instructions for Converting React App to Android APK

### Prerequisites

1. **Node.js & npm** (v16 or higher)
2. **Android Studio** (latest version)
3. **Java Development Kit (JDK 11 or higher)**
4. **Android SDK** (API level 21 or higher)

### Step 1: Install Dependencies

```bash
# Install all project dependencies
npm install

# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Install Android Studio and set up Android SDK
# Download from: https://developer.android.com/studio
```

### Step 2: Build the Web Application

```bash
# Build the React app for production
npm run build

# This creates the 'dist' folder with optimized web assets
```

### Step 3: Initialize Capacitor Android Platform

```bash
# Add Android platform to Capacitor
npx cap add android

# Sync web assets to Android
npx cap sync android
```

### Step 4: Configure Android Environment

1. **Set Android Environment Variables:**
   ```bash
   # Add to your ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

2. **Verify Android Setup:**
   ```bash
   # Check if Android SDK is properly configured
   android --version
   adb --version
   ```

### Step 5: Open Project in Android Studio

```bash
# Open the Android project in Android Studio
npx cap open android
```

### Step 6: Configure Android Studio

1. **Update build.gradle files** (already configured in the project)
2. **Set up app signing** for release builds
3. **Configure app icons and splash screens** (already included)

### Step 7: Build APK

#### Option A: Using Android Studio GUI
1. Open the project in Android Studio
2. Go to **Build → Generate Signed Bundle/APK**
3. Choose **APK**
4. Create a new keystore or use existing one
5. Fill in keystore details
6. Choose **release** build variant
7. Click **Finish**

#### Option B: Using Command Line
```bash
# Build debug APK (for testing)
cd android
./gradlew assembleDebug

# Build release APK (for production)
./gradlew assembleRelease

# APK will be generated in:
# android/app/build/outputs/apk/debug/
# android/app/build/outputs/apk/release/
```

### Step 8: Install APK on Device

```bash
# Install debug APK on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or install release APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 Development Commands

```bash
# Development workflow
npm run dev                    # Start web dev server
npm run android:run           # Run on Android device/emulator
npm run android:build         # Build for Android
npm run android:open          # Open in Android Studio

# Sync changes
npm run build && npx cap sync android
```

## 📋 Project Features Included in APK

✅ **Core Features:**
- Kerala travel tracking with route mapping
- Carbon footprint calculation
- Real-time Google Maps integration
- Weather information
- Popular Kerala routes database
- Emergency services (Kerala Police, Hospitals, SOS)
- Multi-language support (English/Malayalam)
- Dark/Light theme support
- Trip insights and analytics

✅ **Mobile-Specific Features:**
- Native splash screen with Kerala branding
- GPS location services
- Device camera access for trip photos
- Push notifications
- Offline data storage
- Native sharing capabilities
- Emergency calling functionality

✅ **Android Permissions:**
- Internet access
- Location services (GPS)
- Camera access
- External storage
- Phone calling (for emergency services)
- Notifications

## 📱 APK Details

- **Package ID:** `com.kerala.traveltracker`
- **App Name:** Kerala Travel Tracker
- **Version:** 1.0.0
- **Min SDK:** API 21 (Android 5.0)
- **Target SDK:** API 34 (Android 14)
- **Size:** ~15-20 MB (estimated)

## 🚀 Distribution Options

1. **Direct APK Installation**
   - Share APK file directly
   - Users enable "Unknown Sources"
   - Install manually

2. **Google Play Store**
   - Create Google Play Console account
   - Upload signed APK/AAB
   - Follow Play Store guidelines

3. **Alternative App Stores**
   - Amazon Appstore
   - Samsung Galaxy Store
   - F-Droid (for open source)

## 🔒 Security Notes

- The APK includes all Kerala location data
- Google Maps integration (requires API key for production)
- Emergency services contact information
- Secure data storage using Capacitor Preferences
- No personal data collected without consent

## 🐛 Troubleshooting

**Common Issues:**

1. **Gradle Build Fails:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew build
   ```

2. **SDK Not Found:**
   - Verify ANDROID_HOME environment variable
   - Install required SDK platforms in Android Studio

3. **App Crashes on Launch:**
   - Check device logs: `adb logcat`
   - Verify permissions in AndroidManifest.xml

4. **Maps Not Working:**
   - Add Google Maps API key to capacitor.config.ts
   - Enable required Google Services

## 📞 Support

For Kerala Travel Tracker specific issues:
- Check device compatibility (Android 5.0+)
- Verify location permissions
- Ensure internet connectivity for maps
- Test emergency services (non-emergency numbers first)

---

🌴 **Ready to explore Kerala with your own mobile app!** 

The APK will include all the features of your web application, optimized for mobile devices with native Android capabilities.