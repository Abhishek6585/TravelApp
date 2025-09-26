#!/bin/bash

# Ultimate clean Vercel deployment script
echo "🧹 Starting ultimate clean deployment..."

# 1. Clean all lock files and cache
echo "Cleaning lock files and npm cache..."
rm -f package-lock.json yarn.lock bun.lockb pnpm-lock.yaml
npm cache clean --force
rm -rf node_modules dist .vercel .next

# 2. Verify .vercelignore exists
if [ ! -f ".vercelignore" ]; then
    echo "Creating .vercelignore..."
    cat > .vercelignore << EOF
supabase/
android/
*.sh
*.bat
*.md
!README.md
test-*.js
debug-*.html
backend-monitor.html
workflows/
public/_redirects/
EOF
fi

# 3. Install dependencies fresh
echo "Installing dependencies..."
npm install --no-package-lock

# 4. Verify Supabase dependency
if npm list @supabase/supabase-js 2>/dev/null; then
    echo "✅ Supabase dependency verified"
else
    echo "❌ Supabase dependency not found, installing..."
    npm install @supabase/supabase-js@^2.39.0
fi

# 5. Build the project
echo "Building project..."
npm run build

# 6. Check build success
if [ -d "dist" ]; then
    echo "✅ Build successful"
    
    # 7. Deploy to Vercel with clean environment
    echo "Deploying to Vercel..."
    npx vercel --prod --no-wait
    
    echo "🎉 Deployment initiated!"
else
    echo "❌ Build failed"
    exit 1
fi