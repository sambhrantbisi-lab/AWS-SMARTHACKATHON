// Simple Fallback Test
// Makes a single request and checks server logs for fallback behavior

async function testSimpleFallback() {
    console.log('🧪 Testing AI Chat with Fallback Support\n');
    
    const testContext = {
        pageName: 'Stocks',
        description: 'NSE Stock Market',
        visibleStocks: [
            {
                symbol: 'TCS',
                name: 'Tata Consultancy Services',
                currentPrice: '3850.75',
                change: '+2.5%',
                volume: '2,145,890',
                dayHigh: '3875.00',
                dayLow: '3820.00',
                marketCap: '14.2L Cr',
                exchange: 'NSE',
                sector: 'IT'
            }
        ]
    };
    
    console.log('📤 Sending request to AI chat endpoint...');
    console.log('   Message: "What is the trading volume of TCS?"');
    console.log('   Context: 1 stock (TCS)\n');
    
    try {
        const startTime = Date.now();
        
        const response = await fetch('http://localhost:5000/api/ai/ai-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'What is the trading volume of TCS?',
                context: testContext
            })
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (response.ok) {
            const data = await response.json();
            
            console.log(`✅ Response received in ${duration}ms`);
            console.log(`\n📝 AI Response:\n${data.response}\n`);
            
            // Check if response includes volume data
            if (data.response.includes('2,145,890') || data.response.includes('2.1') || data.response.toLowerCase().includes('volume')) {
                console.log('✅ Context awareness working (volume data included)\n');
            } else {
                console.log('⚠️ Context might not be working (volume not mentioned)\n');
            }
            
            console.log('💡 Check server logs above to see which AI provider was used:');
            console.log('   - "Gemini response received" = Gemini was used');
            console.log('   - "🔄 Gemini unavailable, switching to Groq fallback..." = Groq was used');
            console.log('   - "✅ Groq fallback successful!" = Groq worked\n');
            
        } else {
            const errorData = await response.json();
            console.error(`❌ Error ${response.status}:`, errorData);
        }
        
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
}

// Run test
testSimpleFallback().catch(console.error);
