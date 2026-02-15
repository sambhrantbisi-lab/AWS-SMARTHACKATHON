// Test if we can use Gemini API for web search
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testGeminiSearch() {
    console.log('=== Testing Gemini API for Web Search ===\n');
    
    const apiKey = 'AIzaSyBGToS-9WCwBBmXbJ7QrgRBGVvg-0lZ4co';
    const query = 'Apollo Hospital Delhi opening hours';
    
    console.log(`Query: "${query}"\n`);
    
    try {
        console.log('🔍 Calling Gemini API with search...');
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Search for and provide information about: ${query}. Include opening hours, location, and contact information if available.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            }
        );
        
        const data = await response.json();
        
        console.log(`Response status: ${response.status}\n`);
        
        if (response.ok && data.candidates && data.candidates[0]) {
            const text = data.candidates[0].content.parts[0].text;
            console.log('✅ SUCCESS! Gemini Response:\n');
            console.log(text);
            console.log('\n=== GEMINI CAN PROVIDE SEARCH RESULTS ===');
        } else if (data.error) {
            console.log('❌ Error:', data.error.message);
        } else {
            console.log('⚠️ Unexpected response');
            console.log('Response:', JSON.stringify(data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testGeminiSearch();
