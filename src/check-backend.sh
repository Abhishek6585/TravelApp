#!/bin/bash

echo "🌴 Kerala Travel Tracker - Backend Check"
echo "========================================"

BASE_URL="https://dubyklstpzpuvjdfztsa.supabase.co/functions/v1/make-server-561789f4"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnlrbHN0cHpwdXZqZGZ6dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4Njc2NjAsImV4cCI6MjA3NDQ0MzY2MH0.bJpGzkJ1v_vdNWYxRlbn_gYECduJuTOs_AxlfV4ozCI"

echo "🔍 Testing backend health..."
curl -s -H "Authorization: Bearer $ANON_KEY" \
     -H "Content-Type: application/json" \
     "$BASE_URL/health" | python3 -m json.tool

echo ""
echo "📊 Backend URL: $BASE_URL"
echo "🔑 Authentication: Create real account via signup"
echo ""
echo "🎯 Available endpoints:"
echo "  GET  /health - Health check"
echo "  POST /auth/signup - User registration"  
echo "  POST /auth/reset-password - Password reset"
echo "  GET  /user/profile - Get user profile"
echo "  PUT  /user/profile - Update user profile"
echo "  GET  /trips - Get user trips"
echo "  POST /trips - Save new trip"
echo "  DELETE /trips/:id - Delete trip"
echo ""
echo "💻 To test interactively:"
echo "  1. Open backend-monitor.html in your browser"
echo "  2. Run: node test-backend.js"
echo "  3. Use your deployed app with real account signup"