// Test script to check commodity API response
require('dotenv').config();
const commodityDataService = require('./services/commodityDataService');

async function testCommodityAPI() {
    console.log('Testing Commodity Data API...\n');
    console.log('API Key:', process.env.DATA_GOV_IN_API_KEY ? 'Set ✓ (hidden for security)' : 'Not Set ✗');
    console.log('---\n');
    
    try {
        const data = await commodityDataService.getCommodityData();
        
        if (!data) {
            console.error('❌ No data returned from API');
            console.log('\nPossible reasons:');
            console.log('1. API key is invalid');
            console.log('2. API rate limit exceeded');
            console.log('3. Network error');
            console.log('4. API endpoint changed');
            return;
        }
        
        console.log(`✅ Successfully fetched ${data.length} commodities\n`);
        
        // Show statistics
        const categories = {};
        const states = new Set();
        const markets = new Set();
        
        data.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
            states.add(item.state);
            markets.add(item.market);
        });
        
        console.log('📊 Statistics:');
        console.log(`   Total Commodities: ${data.length}`);
        console.log(`   Unique States: ${states.size}`);
        console.log(`   Unique Markets: ${markets.size}`);
        console.log('\n📦 By Category:');
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count}`);
        });
        
        console.log('\n🔍 Sample Data (first 3 items):');
        data.slice(0, 3).forEach((item, i) => {
            console.log(`\n   ${i + 1}. ${item.commodity}`);
            console.log(`      Category: ${item.category}`);
            console.log(`      Location: ${item.market}, ${item.district}, ${item.state}`);
            console.log(`      Wholesale: ₹${item.prices.wholesale.average}`);
            console.log(`      Retail: ₹${item.prices.retail.average}`);
        });
        
        console.log('\n✅ Test Complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

testCommodityAPI();
