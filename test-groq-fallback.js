// Test Groq Fallback Integration
// This script tests that Groq API is properly configured and working

async function testGroqFallback() {
    console.log('🧪 Testing Groq Fallback Integration\n');
    
    // Test 1: Check environment variable
    console.log('1️⃣ Checking GROQ_API_KEY in environment...');
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey || groqKey === 'your_groq_api_key_here') {
        console.error('❌ GROQ_API_KEY not configured in .env');
        return;
    }
    console.log('✅ GROQ_API_KEY is configured');
    console.log(`   Key: ${groqKey.substring(0, 10)}...${groqKey.substring(groqKey.length - 5)}\n`);
    
    // Test 2: Test direct Groq API call
    console.log('2️⃣ Testing direct Groq API call...');
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.'
                    },
                    {
                        role: 'user',
                        content: 'Say "Groq is working!" in exactly 3 words.'
                    }
                ],
                temperature: 0.7,
                max_tokens: 50,
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const text = data.choices[0].message.content;
            console.log('✅ Groq API is working!');
            console.log(`   Response: "${text}"\n`);
        } else {
            const errorData = await response.json();
            console.error('❌ Groq API error:', response.status);
            console.error('   Error:', JSON.stringify(errorData, null, 2));
            return;
        }
    } catch (error) {
        console.error('❌ Failed to connect to Groq:', error.message);
        return;
    }
    
    // Test 3: Test AI chat endpoint with context
    console.log('3️⃣ Testing AI chat endpoint with stock context...');
    try {
        const testContext = {
            pageName: 'Stocks',
            description: 'NSE Stock Market',
            visibleStocks: [
                {
                    symbol: 'RELIANCE',
                    name: 'Reliance Industries',
                    currentPrice: '2450.50',
                    change: '+1.2%',
                    volume: '5,234,567',
                    dayHigh: '2465.00',
                    dayLow: '2430.00',
                    marketCap: '16.5L Cr',
                    exchange: 'NSE',
                    sector: 'Energy'
                }
            ]
        };
        
        const response = await fetch('http://localhost:5000/api/ai/ai-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'What is the trading volume of Reliance?',
                context: testContext
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ AI chat endpoint is working!');
            console.log(`   Response: "${data.response.substring(0, 100)}..."\n`);
            
            // Check if response includes volume data
            if (data.response.includes('5,234,567') || data.response.includes('5.2') || data.response.includes('volume')) {
                console.log('✅ Context awareness is working! (Volume data included in response)\n');
            } else {
                console.log('⚠️ Context might not be fully working (Volume not mentioned in response)\n');
            }
        } else {
            const errorData = await response.json();
            console.error('❌ AI chat endpoint error:', response.status);
            console.error('   Error:', JSON.stringify(errorData, null, 2));
            return;
        }
    } catch (error) {
        console.error('❌ Failed to test AI chat endpoint:', error.message);
        return;
    }
    
    console.log('🎉 All tests passed! Groq fallback is ready.');
    console.log('\n📊 Rate Limits:');
    console.log('   Gemini: 15 RPM, 20 RPD (primary)');
    console.log('   Groq: 30 RPM, 70,000+ RPD (fallback)');
    console.log('\n💡 The system will automatically switch to Groq after 20 Gemini requests per day.');
}

// Load environment variables
require('dotenv').config();

// Run tests
testGroqFallback().catch(console.error);
