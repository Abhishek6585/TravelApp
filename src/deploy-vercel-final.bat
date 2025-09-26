@echo off
REM Final Vercel Deployment Script for Windows
REM This script ensures a clean deployment by fixing all potential issues

echo 🚀 Starting final Vercel deployment...

REM Remove any lock files that might cause conflicts
echo Cleaning lock files and cache...
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock
if exist bun.lockb del bun.lockb
npm cache clean --force

REM Remove build artifacts
echo Removing build artifacts...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .vercel rmdir /s /q .vercel

REM Fresh install
echo Installing dependencies...
npm install

REM Build the project
echo Building project...
npm run build

REM Check if build was successful
if exist dist (
    echo ✅ Build successful
    
    REM Deploy to Vercel
    echo Deploying to Vercel...
    npx vercel --prod
    
    echo 🎉 Deployment completed!
) else (
    echo ❌ Build failed
    exit /b 1
)