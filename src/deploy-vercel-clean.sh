#!/bin/bash

# Clean Vercel Deployment Script
# This script ensures a clean deployment by removing cache and lock files

echo "🧹 Starting clean Vercel deployment..."

# Remove any lock files that might cause conflicts
echo "Removing lock files..."
rm -f package-lock.json
rm -f yarn.lock
rm -f bun.lockb

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Remove node_modules and dist
echo "Removing node_modules and dist..."
rm -rf node_modules
rm -rf dist

# Fresh install
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

echo "✅ Clean deployment completed!"