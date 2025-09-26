#!/bin/bash

echo "🚨 EMERGENCY: Fixing _redirects directory issue"
echo "=============================================="

# Remove the problematic directory completely
if [ -d "public/_redirects" ]; then
    echo "🗑️  Removing problematic directory: public/_redirects"
    rm -rf "public/_redirects"
fi

# Remove any existing _redirects file
if [ -f "public/_redirects" ]; then
    echo "🗑️  Removing existing file: public/_redirects"
    rm -f "public/_redirects"
fi

# Create the correct _redirects file for SPA routing
echo "✅ Creating correct _redirects file..."
echo "/*    /index.html   200" > "public/_redirects"

# Verify the fix
if [ -f "public/_redirects" ] && [ ! -d "public/_redirects" ]; then
    echo "✅ SUCCESS: _redirects file created correctly"
    echo "📄 Content:"
    cat "public/_redirects"
else
    echo "❌ FAILED: _redirects file not created properly"
    exit 1
fi

echo ""
echo "🎯 Next steps:"
echo "   1. Check that public/_redirects is now a file, not a directory"
echo "   2. Deploy immediately to fix routing issues"
echo "   3. Test authentication after deployment"