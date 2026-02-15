// Test Google Custom Search API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testGoogleSearch() {
    console.log('=== Testing Google Custom Search API ===\n');
    
    const apiKey = 'AIzaSyBGToS-9WCwBBmXbJ7QrgRBGVvg-0lZ4co';
    const engineId = 'e2f9434249b414cb0';
    const query = 'Apollo Hospital Delhi opening hours';
    
    console.log(`API Key: ${apiKey.substring(0, 20)}...`);
    console.log(`Engine ID: ${engineId}`);
    console.log(`Query: "${query}"\n`);
    
    try {
        console.log('🔍 Calling Google Custom Search API...');
        
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${encodeURIComponent(query)}&num=5`;
        console.log(`URL: ${url.substring(0, 100)}...\n`);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; DigitalIndiaBot/1.0)'
            }
        });
        
        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, response.headers.raw());
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('\n✅ SUCCESS! API returned data\n');
            
            if (data.error) {
                console.log('❌ API Error:', data.error);
                console.log('Details:', JSON.stringify(data.error, null, 2));
            } else if (data.items && data.items.length > 0) {
                console.log(`✅ Found ${data.items.length} search results:\n`);
                
                data.items.forEach((item, idx) => {
                    console.log(`${idx + 1}. ${item.title}`);
                    console.log(`   URL: ${item.link}`);
                    console.log(`   Snippet: ${item.snippet.substring(0, 100)}...`);
                    console.log('');
                });
                
                console.log('=== TEST PASSED ===');
                console.log('✅ Google Custom Search API is working!');
                console.log('✅ Web search will provide context to AI');
                
            } else {
                console.log('⚠️ No search results found');
                console.log('Full response:', JSON.stringify(data, null, 2));
            }
        } else {
            console.log('\n❌ API Error Response\n');
            console.log('Status:', response.status);
            console.log('Error:', JSON.stringify(data, null, 2));
            
            if (data.error && data.error.message) {
                console.log('\nError Message:', data.error.message);
                
                if (data.error.message.includes('API key')) {
                    console.log('💡 Tip: Make sure Custom Search API is enabled in Google Cloud Console');
                }
                if (data.error.message.includes('disabled')) {
                    console.log('💡 Tip: Enable Custom Search API at: https://console.cloud.google.com/apis/library/customsearch.googleapis.com');
                }
            }
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

testGoogleSearch();
