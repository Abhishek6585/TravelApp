#!/bin/bash

# Final Vercel Deployment Script
# This script ensures a clean deployment by fixing all potential issues

echo "🚀 Starting final Vercel deployment..."

# Remove any lock files that might cause conflicts
echo "Cleaning lock files and cache..."
rm -f package-lock.json
rm -f yarn.lock
rm -f bun.lockb
npm cache clean --force

# Remove build artifacts
echo "Removing build artifacts..."
rm -rf node_modules
rm -rf dist
rm -rf .vercel

# Fresh install
echo "Installing dependencies..."
npm install

# Verify package.json has correct Supabase version
echo "Verifying dependencies..."
grep -q '"@supabase/supabase-js": "\^2.39.0"' package.json && echo "✅ Supabase dependency correct" || echo "❌ Supabase dependency issue"

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful"
    
    # Deploy to Vercel
    echo "Deploying to Vercel..."
    npx vercel --prod
    
    echo "🎉 Deployment completed!"
else
    echo "❌ Build failed"
    exit 1
fi