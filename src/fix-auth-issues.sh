#!/bin/bash

echo "🌴 Kerala Travel Tracker - Authentication Fix"
echo "============================================="

# 1. Fix _redirects file permanently
echo "🔧 Step 1: Fixing _redirects file structure..."
if [ -d "public/_redirects" ]; then
    echo "   Removing problematic directory: public/_redirects"
    rm -rf "public/_redirects"
fi
if [ -f "public/_redirects" ]; then
    echo "   Removing existing file: public/_redirects"
    rm -f "public/_redirects"
fi
echo "/*    /index.html   200" > "public/_redirects"
echo "✅ Fixed _redirects file structure"

# 2. Check if all dependencies are installed
echo ""
echo "🔧 Step 2: Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# 3. Build the application
echo ""
echo "🔧 Step 3: Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed - check for TypeScript errors"
    exit 1
fi
echo "✅ Build completed"

# 4. Test backend connectivity
echo ""
echo "🔧 Step 4: Testing backend connectivity..."
BACKEND_URL="https://dubyklstpzpuvjdfztsa.supabase.co/functions/v1/make-server-561789f4/health"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnlrbHN0cHpwdXZqZGZ6dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4Njc2NjAsImV4cCI6MjA3NDQ0MzY2MH0.bJpGzkJ1v_vdNWYxRlbn_gYECduJuTOs_AxlfV4ozCI"

if command -v curl &> /dev/null; then
    HEALTH_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -H "Authorization: Bearer $ANON_KEY" "$BACKEND_URL")
    if [ "$HEALTH_RESPONSE" = "200" ]; then
        echo "✅ Backend is healthy and responding"
    else
        echo "⚠️  Backend health check returned: $HEALTH_RESPONSE"
        echo "   This might affect authentication"
    fi
else
    echo "⚠️  curl not available - cannot test backend"
fi

echo ""
echo "🎯 Authentication Fixes Applied:"
echo "   ✅ Fixed _redirects file structure"
echo "   ✅ Updated SignUp component with proper parameter passing"
echo "   ✅ Updated SignIn component with validation"
echo "   ✅ Added form validation to prevent empty submissions"
echo "   ✅ Added debugging logs for troubleshooting"
echo ""
echo "🔍 Debug Tools Available:"
echo "   • Open debug-auth.html in browser for API testing"
echo "   • Check browser console for detailed error logs"
echo "   • Check network tab for API call details"
echo ""
echo "🚀 Ready to deploy!"
echo "   Run: vercel --prod"
echo ""
echo "📝 Test Instructions:"
echo "   1. Open your deployed app"
echo "   2. Try creating a new account"
echo "   3. Check browser console for any errors"
echo "   4. If issues persist, open debug-auth.html for detailed testing"