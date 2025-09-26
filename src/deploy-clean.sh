#!/bin/bash

echo "🌴 Kerala Travel Tracker - Clean Deployment"
echo "==========================================="

# Clean up the _redirects file issue permanently
echo "🧹 Fixing _redirects file..."
if [ -d "public/_redirects" ]; then
    echo "   Removing directory: public/_redirects"
    rm -rf "public/_redirects"
fi
if [ -f "public/_redirects" ]; then
    echo "   File already exists, recreating..."
    rm -f "public/_redirects"
fi
echo "/*    /index.html   200" > "public/_redirects"
echo "✅ Fixed _redirects file structure"

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
echo "   ✅ Real Supabase authentication system"
echo "   ✅ User registration and secure login"
echo "   ✅ Trip management with backend persistence"
echo "   ✅ Multi-language support (English, Malayalam, Hindi, Tamil)"
echo "   ✅ PWA-ready for mobile installation"
echo "   ✅ Emergency SOS for Kerala"
echo "   ✅ Carbon footprint tracking"
echo "   ✅ Kerala-specific transport modes"
echo ""
echo "🔗 To deploy now, run: vercel --prod"
echo "📚 Your users can create accounts via the Sign Up page"