#!/bin/bash

# Kerala Travel Tracker - Android APK Build Script
# This script builds the complete Android APK from your React web app

echo "🌴 Kerala Travel Tracker - Building Android APK..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📱 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_step "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed successfully"

print_step "Building React web application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build React app"
    exit 1
fi
print_success "React app built successfully"

print_step "Adding Capacitor Android platform..."
npx cap add android 2>/dev/null || echo "Android platform already exists"
print_success "Android platform ready"

print_step "Syncing web assets to Android..."
npx cap sync android
if [ $? -ne 0 ]; then
    print_error "Failed to sync to Android"
    exit 1
fi
print_success "Assets synced to Android successfully"

print_step "Copying web assets..."
npx cap copy android
if [ $? -ne 0 ]; then
    print_error "Failed to copy assets"
    exit 1
fi
print_success "Assets copied successfully"

# Check if Android Studio / Gradle is available
if command -v ./android/gradlew &> /dev/null; then
    print_step "Building APK with Gradle..."
    cd android
    chmod +x gradlew
    ./gradlew assembleDebug
    if [ $? -eq 0 ]; then
        print_success "APK built successfully!"
        print_success "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
        
        # Copy APK to root directory for easy access
        cp app/build/outputs/apk/debug/app-debug.apk ../kerala-travel-tracker.apk
        print_success "APK copied to: kerala-travel-tracker.apk"
        
        # Show APK info
        APK_SIZE=$(du -h ../kerala-travel-tracker.apk | cut -f1)
        print_success "APK size: $APK_SIZE"
        
    else
        print_error "Failed to build APK with Gradle"
        cd ..
        exit 1
    fi
    cd ..
else
    print_warning "Gradle wrapper not found. Opening Android Studio for manual build..."
    npx cap open android
    print_warning "Please build the APK manually in Android Studio:"
    print_warning "1. Go to Build > Build Bundle(s) / APK(s) > Build APK(s)"
    print_warning "2. Wait for the build to complete"
    print_warning "3. Find your APK in: android/app/build/outputs/apk/debug/"
fi

echo ""
echo "🌴 Kerala Travel Tracker APK Build Complete! 🌴"
echo "================================================="
echo ""
echo "📱 App Details:"
echo "   • Name: Kerala Travel Tracker"
echo "   • Package: com.kerala.traveltracker"
echo "   • Version: 1.0.0"
echo "   • Platform: Android"
echo ""
echo "🎯 Features Included:"
echo "   • Real-time trip tracking"
echo "   • Carbon footprint analysis"
echo "   • Kerala-specific routes & transport"
echo "   • Account data export functionality"
echo "   • Multi-language support (English/Malayalam/Hindi/Tamil)"
echo "   • Dark/Light theme support"
echo "   • Emergency services integration"
echo "   • Offline capable"
echo ""
echo "📂 APK Location:"
if [ -f "kerala-travel-tracker.apk" ]; then
    echo "   • kerala-travel-tracker.apk (ready to install)"
    echo "   • android/app/build/outputs/apk/debug/app-debug.apk"
else
    echo "   • android/app/build/outputs/apk/debug/app-debug.apk"
fi
echo ""
echo "📥 Installation Instructions:"
echo "   1. Transfer the APK to your Android device"
echo "   2. Enable 'Unknown Sources' in Settings > Security"
echo "   3. Tap the APK file to install"
echo "   4. Launch 'Kerala Travel Tracker' from your app drawer"
echo ""
echo "🚀 Your Kerala Travel Tracker is ready! 🚀"