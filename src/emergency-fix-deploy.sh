#!/bin/bash

echo "🚨 EMERGENCY: Kerala Travel Tracker - Critical Fix & Deploy"
echo "==========================================================="

# Step 1: Fix _redirects directory issue
echo "🔧 Step 1: Fixing _redirects critical issue..."
if [ -d "public/_redirects" ]; then
    echo "   🗑️  Removing problematic directory: public/_redirects"
    rm -rf "public/_redirects"
fi
if [ -f "public/_redirects" ]; then
    echo "   🗑️  Removing existing file to recreate fresh"
    rm -f "public/_redirects"
fi
echo "/*    /index.html   200" > "public/_redirects"
echo "✅ Fixed _redirects file (now a proper file, not directory)"

# Step 2: Install dependencies
echo ""
echo "🔧 Step 2: Installing dependencies..."
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"

# Step 3: Build application
echo ""
echo "🔧 Step 3: Building application..."
npm run build --silent
if [ $? -ne 0 ]; then
    echo "❌ Build failed - check for errors above"
    exit 1
fi
echo "✅ Build completed successfully"

# Step 4: Verify fixes
echo ""
echo "🔧 Step 4: Verifying fixes..."

# Check _redirects file
if [ -f "public/_redirects" ] && [ ! -d "public/_redirects" ]; then
    echo "✅ _redirects file is correct"
else
    echo "❌ _redirects file issue not fixed"
    exit 1
fi

# Check build output
if [ -d "dist" ]; then
    echo "✅ Build output exists"
else
    echo "❌ Build output missing"
    exit 1
fi

echo ""
echo "🎯 Critical Fixes Applied:"
echo "   ✅ Fixed _redirects directory→file issue"
echo "   ✅ Fixed userLocation undefined errors in AppContent"
echo "   ✅ Fixed setUser undefined function"
echo "   ✅ Removed demo account references"
echo "   ✅ Build completed successfully"
echo ""
echo "🚀 READY TO DEPLOY!"
echo "   Run: vercel --prod"
echo ""
echo "🧪 After deployment, test:"
echo "   1. Create a new account (real authentication)"
echo "   2. Check that all pages load without errors"
echo "   3. Check browser console for any remaining issues"
echo "   4. Use debug-auth.html if needed for API testing"
echo ""
echo "🔗 Your app now has REAL authentication only (no demo mode)"