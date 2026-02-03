const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing Civic AI Assistant API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing server health...');
    try {
      const response = await axios.get(`${baseURL}/api/services`);
      console.log('✅ Server is responding');
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      return;
    }

    // Test 2: Get services
    console.log('\n2. Testing services endpoint...');
    try {
      const response = await axios.get(`${baseURL}/api/services`);
      console.log(`✅ Services endpoint working - Found ${response.data.services?.length || 0} services`);
    } catch (error) {
      console.log('❌ Services endpoint failed:', error.message);
    }

    // Test 3: Start chat session
    console.log('\n3. Testing chat functionality...');
    try {
      const response = await axios.post(`${baseURL}/api/chat/start`, {
        message: 'Hello, I need help finding healthcare services',
        language: 'en',
        location: { city: 'Sample City', state: 'CA' }
      });
      console.log('✅ Chat functionality working');
      console.log('   Response:', response.data.response?.substring(0, 100) + '...');
    } catch (error) {
      console.log('❌ Chat functionality failed:', error.message);
    }

    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testAPI();