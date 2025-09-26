#!/bin/bash

# 🌴 Kerala Travel Tracker - Quick Deployment Script
# Automatically deploys to Vercel (recommended platform)

echo "🌴 Kerala Travel Tracker - Quick Deployment"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the application
echo "🏗️  Building application..."
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

echo "🚀 Deploying to Vercel..."
echo "⚠️  Follow the prompts to link your project"

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "=========================="
    echo "✅ Your Kerala Travel Tracker is now live!"
    echo "📱 The app is PWA-ready - users can install it on their devices"
    echo "🌍 Features available:"
    echo "   • Multi-language support (English, Malayalam, Hindi, Tamil)"
    echo "   • Dark/Light theme switching"
    echo "   • Trip tracking and insights"
    echo "   • Emergency SOS for Kerala"
    echo "   • Mobile-optimized design"
    echo ""
    echo "🔗 Your app URL will be displayed above"
    echo "📚 For other deployment options, see deploy.md"
else
    echo "❌ Deployment failed"
    echo "💡 Try manual deployment steps in deploy.md"
    exit 1
fi