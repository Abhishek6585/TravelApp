@echo off
echo 🌴 Kerala Travel Tracker - Quick Deployment
echo ===========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the application
echo 🏗️ Building application...
npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
)

echo 🚀 Deploying to Vercel...
echo ⚠️ Follow the prompts to link your project

REM Deploy to Vercel
vercel --prod

if errorlevel 0 (
    echo.
    echo 🎉 DEPLOYMENT SUCCESSFUL!
    echo ==========================
    echo ✅ Your Kerala Travel Tracker is now live!
    echo 📱 The app is PWA-ready - users can install it on their devices
    echo 🌍 Features available:
    echo    • Multi-language support ^(English, Malayalam, Hindi, Tamil^)
    echo    • Dark/Light theme switching
    echo    • Trip tracking and insights
    echo    • Emergency SOS for Kerala
    echo    • Mobile-optimized design
    echo.
    echo 🔗 Your app URL will be displayed above
    echo 📚 For other deployment options, see deploy.md
) else (
    echo ❌ Deployment failed
    echo 💡 Try manual deployment steps in deploy.md
)

pause