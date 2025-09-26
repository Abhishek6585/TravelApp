@echo off
REM Kerala Travel Tracker - Android APK Build Script for Windows
REM This script builds the complete Android APK from your React web app

echo 🌴 Kerala Travel Tracker - Building Android APK...
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📱 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

echo 📱 Building React web application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build React app
    pause
    exit /b 1
)
echo ✅ React app built successfully
echo.

echo 📱 Adding Capacitor Android platform...
call npx cap add android 2>nul || echo Android platform already exists
echo ✅ Android platform ready
echo.

echo 📱 Syncing web assets to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Failed to sync to Android
    pause
    exit /b 1
)
echo ✅ Assets synced to Android successfully
echo.

echo 📱 Copying web assets...
call npx cap copy android
if %errorlevel% neq 0 (
    echo ❌ Failed to copy assets
    pause
    exit /b 1
)
echo ✅ Assets copied successfully
echo.

REM Check if Gradle wrapper exists
if exist "android\gradlew.bat" (
    echo 📱 Building APK with Gradle...
    cd android
    call gradlew.bat assembleDebug
    if %errorlevel% equ 0 (
        echo ✅ APK built successfully!
        echo ✅ APK location: android\app\build\outputs\apk\debug\app-debug.apk
        
        REM Copy APK to root directory for easy access
        copy "app\build\outputs\apk\debug\app-debug.apk" "..\kerala-travel-tracker.apk"
        echo ✅ APK copied to: kerala-travel-tracker.apk
        
    ) else (
        echo ❌ Failed to build APK with Gradle
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo ⚠️ Gradle wrapper not found. Opening Android Studio for manual build...
    call npx cap open android
    echo ⚠️ Please build the APK manually in Android Studio:
    echo    1. Go to Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
    echo    2. Wait for the build to complete
    echo    3. Find your APK in: android\app\build\outputs\apk\debug\
)

echo.
echo 🌴 Kerala Travel Tracker APK Build Complete! 🌴
echo =================================================
echo.
echo 📱 App Details:
echo    • Name: Kerala Travel Tracker
echo    • Package: com.kerala.traveltracker
echo    • Version: 1.0.0
echo    • Platform: Android
echo.
echo 🎯 Features Included:
echo    • Real-time trip tracking
echo    • Carbon footprint analysis
echo    • Kerala-specific routes ^& transport
echo    • Account data export functionality
echo    • Multi-language support (English/Malayalam/Hindi/Tamil)
echo    • Dark/Light theme support
echo    • Emergency services integration
echo    • Offline capable
echo.
echo 📂 APK Location:
if exist "kerala-travel-tracker.apk" (
    echo    • kerala-travel-tracker.apk (ready to install)
    echo    • android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo    • android\app\build\outputs\apk\debug\app-debug.apk
)
echo.
echo 📥 Installation Instructions:
echo    1. Transfer the APK to your Android device
echo    2. Enable 'Unknown Sources' in Settings ^> Security
echo    3. Tap the APK file to install
echo    4. Launch 'Kerala Travel Tracker' from your app drawer
echo.
echo 🚀 Your Kerala Travel Tracker is ready! 🚀

pause