require('dotenv').config();

async function testAIChatAPI() {
    console.log('🔄 Testing AI Chat API endpoint...\n');
    
    try {
        const response = await fetch('http://localhost:5000/api/ai/ai-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Hello, can you help me?',
                context: {
                    page: '/index.html',
                    pageTitle: 'Digital India Portal',
                    pageName: 'Home',
                    description: 'Digital India Portal homepage'
                }
            })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ API error:', errorText);
            return;
        }

        const data = await response.json();
        console.log('✅ API Response received!\n');
        console.log('Response:', data.response);
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testAIChatAPI();
