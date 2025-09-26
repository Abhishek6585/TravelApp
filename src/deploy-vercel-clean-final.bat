@echo off
REM Ultimate clean Vercel deployment script for Windows
echo 🧹 Starting ultimate clean deployment...

REM 1. Clean all lock files and cache
echo Cleaning lock files and npm cache...
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock
if exist bun.lockb del bun.lockb
if exist pnpm-lock.yaml del pnpm-lock.yaml
npm cache clean --force
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .vercel rmdir /s /q .vercel
if exist .next rmdir /s /q .next

REM 2. Verify .vercelignore exists
if not exist .vercelignore (
    echo Creating .vercelignore...
    echo supabase/ > .vercelignore
    echo android/ >> .vercelignore
    echo *.sh >> .vercelignore
    echo *.bat >> .vercelignore
    echo *.md >> .vercelignore
    echo !README.md >> .vercelignore
    echo test-*.js >> .vercelignore
    echo debug-*.html >> .vercelignore
    echo backend-monitor.html >> .vercelignore
    echo workflows/ >> .vercelignore
    echo public/_redirects/ >> .vercelignore
)

REM 3. Install dependencies fresh
echo Installing dependencies...
npm install --no-package-lock

REM 4. Build the project
echo Building project...
npm run build

REM 5. Check build success and deploy
if exist dist (
    echo ✅ Build successful
    
    REM Deploy to Vercel with clean environment
    echo Deploying to Vercel...
    npx vercel --prod --no-wait
    
    echo 🎉 Deployment initiated!
) else (
    echo ❌ Build failed
    exit /b 1
)