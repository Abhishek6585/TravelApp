// Test your Kerala Travel Tracker Backend API
// Run with: node test-backend.js

const BASE_URL = 'https://dubyklstpzpuvjdfztsa.supabase.co/functions/v1/make-server-561789f4';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnlrbHN0cHpwdXZqZGZ6dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4Njc2NjAsImV4cCI6MjA3NDQ0MzY2MH0.bJpGzkJ1v_vdNWYxRlbn_gYECduJuTOs_AxlfV4ozCI';

async function testAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      ...options.headers
    },
    ...options
  };

  try {
    console.log(`\n🔍 Testing: ${endpoint}`);
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error.message);
  }
}

async function runTests() {
  console.log('🌴 Kerala Travel Tracker Backend API Tests');
  console.log('==========================================');
  
  // Test 1: Health Check
  await testAPI('/health');
  
  // Test 2: Create Test User
  await testAPI('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@kerala.com',
      password: 'test123',
      name: 'Test User'
    })
  });
  
  // Test 3: Reset Password
  await testAPI('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@kerala.com'
    })
  });
  
  console.log('\n✅ Backend tests completed!');
  console.log('\n📊 Your Backend Features:');
  console.log('  • User registration and authentication');
  console.log('  • Trip management and storage');
  console.log('  • User profile management'); 
  console.log('  • Password reset functionality');
  console.log('\n🔗 Full API Endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /auth/signup - User registration');
  console.log('  POST /auth/reset-password - Password reset');
  console.log('  GET  /user/profile - Get user profile');
  console.log('  PUT  /user/profile - Update user profile');
  console.log('  GET  /trips - Get user trips');
  console.log('  POST /trips - Save new trip');
  console.log('  DELETE /trips/:id - Delete trip');
}

runTests();