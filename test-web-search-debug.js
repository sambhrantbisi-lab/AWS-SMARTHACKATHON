// Test Web Search Functionality
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWebSearch() {
    console.log('=== Testing Web Search ===\n');
    
    const testQuery = "Apollo Hospital Delhi opening hours";
    console.log(`Query: "${testQuery}"\n`);
    
    try {
        console.log('🔍 Calling DuckDuckGo API...');
        const response = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(testQuery)}&format=json&no_html=1&skip_disambig=1`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; DigitalIndiaBot/1.0)'
                }
            }
        );
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
            console.error('❌ API error:', response.status);
            return;
        }
        
        const data = await response.json();
        console.log('\n📦 Raw API Response:');
        console.log(JSON.stringify(data, null, 2));
        
        console.log('\n📊 Parsed Results:');
        
        if (data.Abstract) {
            console.log('\n✅ Abstract found:');
            console.log(`  Title: ${data.Heading || 'N/A'}`);
            console.log(`  Text: ${data.Abstract}`);
            console.log(`  URL: ${data.AbstractURL || 'N/A'}`);
            console.log(`  Source: ${data.AbstractSource || 'N/A'}`);
        } else {
            console.log('\n⚠️ No abstract found');
        }
        
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            console.log(`\n✅ Found ${data.RelatedTopics.length} related topics:`);
            data.RelatedTopics.slice(0, 3).forEach((topic, idx) => {
                if (topic.Text) {
                    console.log(`\n  ${idx + 1}. ${topic.Text.substring(0, 100)}...`);
                    console.log(`     URL: ${topic.FirstURL || 'N/A'}`);
                }
            });
        } else {
            console.log('\n⚠️ No related topics found');
        }
        
        console.log('\n=== Test Complete ===');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

testWebSearch();
