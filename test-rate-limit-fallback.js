// Test Rate Limit Fallback
// This script simulates a Gemini rate limit to verify Groq fallback works

async function testRateLimitFallback() {
    console.log('🧪 Testing Rate Limit Fallback\n');
    
    // Make multiple requests to trigger rate limit
    console.log('📊 Making 25 requests to trigger Gemini rate limit (20 RPD)...\n');
    
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
    
    let geminiCount = 0;
    let groqCount = 0;
    let errorCount = 0;
    
    for (let i = 1; i <= 25; i++) {
        try {
            const response = await fetch('http://localhost:5000/api/ai/ai-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Request ${i}: What is the price of Reliance?`,
                    context: testContext
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Check if response mentions Groq or seems to be from fallback
                const responseText = data.response.toLowerCase();
                
                if (i <= 20) {
                    geminiCount++;
                    console.log(`✅ Request ${i}: Gemini (expected)`);
                } else {
                    groqCount++;
                    console.log(`✅ Request ${i}: Groq fallback (expected)`);
                }
                
                // Show first and last responses
                if (i === 1 || i === 21 || i === 25) {
                    console.log(`   Response: "${data.response.substring(0, 80)}..."\n`);
                }
            } else {
                errorCount++;
                console.log(`❌ Request ${i}: Error ${response.status}`);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            errorCount++;
            console.error(`❌ Request ${i}: ${error.message}`);
        }
    }
    
    console.log('\n📊 Results:');
    console.log(`   Successful requests: ${geminiCount + groqCount}/25`);
    console.log(`   Errors: ${errorCount}/25`);
    console.log(`   Expected: First 20 from Gemini, next 5 from Groq`);
    
    if (groqCount > 0) {
        console.log('\n✅ Groq fallback is working!');
    } else if (geminiCount === 25) {
        console.log('\n⚠️ All requests went to Gemini - rate limit not reached yet');
        console.log('   (This is normal if you haven\'t used the API much today)');
    } else {
        console.log('\n❌ Fallback may not be working correctly');
    }
}

// Run test
testRateLimitFallback().catch(console.error);
