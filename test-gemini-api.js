require('dotenv').config();

async function testGeminiAPI() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.log('❌ GEMINI_API_KEY not found in .env file');
        return;
    }
    
    console.log('✅ GEMINI_API_KEY found');
    console.log('🔄 Testing Gemini 2.5 Flash API...\n');
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Hello! Can you help me with Indian government services?'
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ Gemini API error: ${response.status}`);
            console.log('Error details:', errorText);
            return;
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            console.log('✅ Gemini API is working!\n');
            console.log('AI Response:');
            console.log('─'.repeat(60));
            console.log(aiResponse);
            console.log('─'.repeat(60));
        } else {
            console.log('❌ Unexpected response format:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Error testing Gemini API:', error.message);
    }
}

testGeminiAPI();
