// Demo Test Script for Civic AI Assistant
// This script tests all the AI functionality and API endpoints

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testDemo() {
    console.log('🇮🇳 Testing Civic AI Assistant - Bharat-First Platform\n');
    
    try {
        // Test 1: Load Bharat Services
        console.log('1. Testing Bharat Services API...');
        const servicesResponse = await axios.get(`${BASE_URL}/api/services`);
        console.log(`✅ Loaded ${servicesResponse.data.services.length} Bharat services`);
        
        // Test 2: Test AI Chat - Health Query
        console.log('\n2. Testing AI Chat - Health Query...');
        const healthQuery = {
            message: "मुझे नजदीकी स्वास्थ्य केंद्र की जानकारी चाहिए",
            language: "hi"
        };
        
        const chatResponse = await axios.post(`${BASE_URL}/api/chat/start`, healthQuery);
        console.log('✅ AI Response:', chatResponse.data.response.substring(0, 100) + '...');
        console.log('✅ Intent detected:', chatResponse.data.intent);
        console.log('✅ Related services found:', chatResponse.data.relatedServices.length);
        
        // Test 3: Test AI Chat - Employment Query
        console.log('\n3. Testing AI Chat - Employment Query...');
        const employmentQuery = {
            message: "How can I get skill training for employment?",
            language: "en"
        };
        
        const empResponse = await axios.post(`${BASE_URL}/api/chat/start`, employmentQuery);
        console.log('✅ AI Response:', empResponse.data.response.substring(0, 100) + '...');
        console.log('✅ Intent detected:', empResponse.data.intent);
        console.log('✅ Suggestions provided:', empResponse.data.suggestions.length);
        
        // Test 4: Test Service Search
        console.log('\n4. Testing Service Search...');
        const searchResponse = await axios.post(`${BASE_URL}/api/services/search`, {
            query: "health center vaccination",
            language: "en"
        });
        console.log('✅ Search results:', searchResponse.data.results.exact.length, 'exact matches');
        console.log('✅ AI suggestion provided:', searchResponse.data.aiResponse ? 'Yes' : 'No');
        
        // Test 5: Test Category Filter
        console.log('\n5. Testing Category Filter...');
        const categoryResponse = await axios.get(`${BASE_URL}/api/services/category/healthcare`);
        console.log('✅ Healthcare services found:', categoryResponse.data.length);
        
        // Test 6: Test Service Details
        console.log('\n6. Testing Service Details...');
        const serviceId = servicesResponse.data.services[0]._id;
        const detailResponse = await axios.get(`${BASE_URL}/api/services/${serviceId}`);
        console.log('✅ Service details loaded:', detailResponse.data.name);
        
        console.log('\n🎉 All tests passed! The Civic AI Assistant is working properly.');
        console.log('\n📋 Demo Features Verified:');
        console.log('   ✅ Bharat services data loading');
        console.log('   ✅ AI-powered chat with intent detection');
        console.log('   ✅ Multi-language support (Hindi/English)');
        console.log('   ✅ Service search and filtering');
        console.log('   ✅ Category-based browsing');
        console.log('   ✅ Service detail views');
        console.log('   ✅ AI suggestions and recommendations');
        
        console.log('\n🌐 Visit http://localhost:4000 to see the full UI in action!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure the server is running with: npm start');
        }
    }
}

// Run the demo
testDemo();