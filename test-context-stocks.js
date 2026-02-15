require('dotenv').config();

async function testStocksContext() {
    console.log('🔄 Testing AI Chat with Stocks Context...\n');
    
    // Simulate context from stocks page
    const context = {
        page: '/stocks.html',
        pageTitle: 'Live Stocks - Digital India Portal',
        pageName: 'Stocks',
        description: 'NSE stock market data and charts',
        visibleStocks: [
            { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: '₹2,450.30' },
            { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹3,890.50' },
            { symbol: 'INFY', name: 'Infosys Ltd', price: '₹1,678.20' },
            { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: '₹1,567.80' },
            { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: '₹1,023.45' }
        ],
        selectedStock: 'RELIANCE - Reliance Industries Ltd'
    };
    
    try {
        console.log('Context being sent:');
        console.log(JSON.stringify(context, null, 2));
        console.log('\n');
        
        const response = await fetch('http://localhost:5000/api/ai/ai-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'What stocks are visible on the screen? List them with their prices.',
                context: context
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
        console.log('AI Response:');
        console.log('─'.repeat(80));
        console.log(data.response);
        console.log('─'.repeat(80));
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testStocksContext();
