#!/bin/bash

echo "🔧 Kerala Travel Tracker - Fix & Deploy Script"
echo "============================================="

# Clean up any problematic files
echo "🧹 Cleaning up problematic files..."
if [ -d "public/_redirects" ]; then
    rm -rf "public/_redirects"
    echo "/*    /index.html   200" > "public/_redirects"
    echo "✅ Fixed _redirects file"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Ready to deploy!"
echo ""
echo "🎯 Your Kerala Travel Tracker features:"
echo "   ✅ Real Supabase authentication"
echo "   ✅ Demo account (demo@kerala.com / demo123)"
echo "   ✅ Trip management with backend persistence"
echo "   ✅ Multi-language support"
echo "   ✅ PWA-ready for mobile installation"
echo "   ✅ Emergency SOS for Kerala"
echo ""
echo "🔗 To deploy now, run: vercel --prod"
echo "📚 For other options, see deploy.md"