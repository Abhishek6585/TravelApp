# 🌴 Kerala Travel Tracker - Android APK Build Guide

This guide will help you build and install the Kerala Travel Tracker Android APK from your React web application.

## 🚀 Quick Start

### Option 1: Automated Build (Recommended)

**For Windows:**

```bash
# Run the automated build script
./build-apk.bat
```

**For macOS/Linux:**

```bash
# Make script executable
chmod +x build-apk.sh

# Run the automated build script
./build-apk.sh
```

### Option 2: Manual Build

```bash
# 1. Install dependencies
npm install

# 2. Build the web app
npm run build

# 3. Sync to Android
npm run android:build

# 4. Open Android Studio (if needed)
npm run android:open
```

## 📋 Prerequisites

### Required Software:

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **Android Studio** (latest version)
- **Java Development Kit (JDK)** (v11 or later)

### Android Development Setup:

1. Install Android Studio
2. Install Android SDK (API level 22-34)
3. Set up Android environment variables:
   - `ANDROID_HOME`
   - `ANDROID_SDK_ROOT`
4. Accept Android SDK licenses

## 🛠️ Build Process

The build process includes these steps:

1. **Dependency Installation** - Installs all required npm packages
2. **Web App Build** - Compiles React app using Vite
3. **Platform Addition** - Adds Capacitor Android platform
4. **Asset Sync** - Syncs web assets to Android project
5. **APK Compilation** - Builds the final Android APK

## 📱 App Configuration

### App Details:

- **App Name:** Kerala Travel Tracker
- **Package ID:** com.kerala.traveltracker
- **Version:** 1.0.0
- **Min SDK:** Android 5.1 (API 22)
- **Target SDK:** Android 14 (API 34)

### Included Features:

- ✅ Real-time trip tracking
- ✅ Carbon footprint analysis
- ✅ Kerala-specific transport modes
- ✅ Account data export functionality
- ✅ Multi-language support (English/Malayalam/Hindi/Tamil)
- ✅ Dark/Light theme support
- ✅ Emergency services integration
- ✅ Offline capabilities
- ✅ GPS location tracking
- ✅ Camera integration
- ✅ Local notifications
- ✅ File sharing capabilities

### Permissions Included:

- 🌍 Location (GPS tracking)
- 📷 Camera (trip photos)
- 📁 Storage (data export)
- 📞 Phone (emergency calls)
- 🌐 Internet (data sync)
- 📳 Vibration (notifications)

## 📂 Output Files

After successful build, you'll find:

```
kerala-travel-tracker.apk                           # Ready-to-install APK
android/app/build/outputs/apk/debug/app-debug.apk   # Original build output
```

## 📥 Installation Instructions

### On Android Device:

1. **Enable Unknown Sources:**
   - Go to Settings > Security > Unknown Sources
   - Enable "Allow installation from unknown sources"

2. **Transfer APK:**
   - Copy `kerala-travel-tracker.apk` to your Android device
   - Use USB, email, cloud storage, or file sharing app

3. **Install APK:**
   - Tap the APK file on your device
   - Follow installation prompts
   - Grant necessary permissions

4. **Launch App:**
   - Find "Kerala Travel Tracker" in your app drawer
   - Tap to launch and enjoy!

## 🔧 Troubleshooting

### Common Issues:

**Build Fails:**

```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
npx cap sync android
```

**Gradle Issues:**

```bash
# Check Android environment
echo $ANDROID_HOME
echo $ANDROID_SDK_ROOT

# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=8.4
```

**Permission Errors:**

```bash
# Fix permissions (macOS/Linux)
chmod +x android/gradlew
chmod +x build-apk.sh
```

**Android Studio Issues:**

1. Open Android Studio
2. Go to File > Sync Project with Gradle Files
3. Update Android Gradle Plugin if prompted
4. Rebuild project

### Error Messages:

**"ANDROID_HOME not set":**

- Set Android SDK path in environment variables
- Restart terminal/command prompt

**"SDK licenses not accepted":**

```bash
yes | sdkmanager --licenses
```

**"Gradle build failed":**

- Check Java version (should be JDK 11+)
- Update Android Gradle Plugin
- Clear Gradle cache

## 🎯 Customization Options

### App Icon:

Replace icons in:

```
android/app/src/main/res/mipmap-*/ic_launcher.png
```

### App Name:

Edit in:

```
android/app/src/main/res/values/strings.xml
```

### Splash Screen:

Customize in:

```
android/app/src/main/res/drawable/splash.xml
```

### Colors:

Modify in:

```
android/app/src/main/res/values/colors.xml
```

## 🔒 Security Notes

### Debug APK:

- Current build creates a **debug APK**
- Suitable for testing and development
- **Not suitable for production release**

### Production Release:

For production (Google Play Store):

1. **Create Release Keystore:**

```bash
keytool -genkey -v -keystore kerala-travel.keystore -alias kerala-travel-key -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing:**
   Edit `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            keyAlias 'kerala-travel-key'
            keyPassword 'your-key-password'
            storeFile file('../kerala-travel.keystore')
            storePassword 'your-store-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. **Build Release APK:**

```bash
cd android
./gradlew assembleRelease
```

## 🌐 Kerala-Specific Features

### Localization:

- **Malayalam** (മലയാളം) - Native Kerala language
- **Hindi** (हिन्दी) - National language
- **Tamil** (தமிழ்) - Neighboring state language
- **English** - International language

### Transportation:

- **Boat/Ferry** - Kerala's famous backwater transport
- **Auto-rickshaw** - Common local transport
- **KSRTC Bus** - State transport buses
- **Metro** - Kochi Metro integration
- **Traditional modes** - Optimized for Kerala routes

### Emergency Services:

- **Kerala Police:** 100
- **Ambulance:** 108
- **Fire Service:** 101
- **Tourism Helpline:** 1364
- **Coastal Security:** 1093

## 🎉 Success!

Your Kerala Travel Tracker Android app is now ready!

**Next Steps:**

1. Install on your Android device
2. Create an account and start tracking trips
3. Explore Kerala with carbon footprint awareness
4. Export your travel data
5. Share your eco-friendly Kerala journey!

**Support:**
For issues or questions, check the troubleshooting section above or refer to the Capacitor documentation.

---

**🌴 Happy travels in God's Own Country! 🌴**