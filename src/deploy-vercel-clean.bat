@echo off
REM Clean Vercel Deployment Script for Windows
REM This script ensures a clean deployment by removing cache and lock files

echo 🧹 Starting clean Vercel deployment...

REM Remove any lock files that might cause conflicts
echo Removing lock files...
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock
if exist bun.lockb del bun.lockb

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

REM Remove node_modules and dist
echo Removing node_modules and dist...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist

REM Fresh install
echo Installing dependencies...
npm install

REM Build the project
echo Building project...
npm run build

REM Deploy to Vercel
echo Deploying to Vercel...
npx vercel --prod

echo ✅ Clean deployment completed!