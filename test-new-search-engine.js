const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNewSearchEngine() {
    console.log('=== Testing New Search Engine ID ===\n');
    
    const apiKey = 'AIzaSyBGToS-9WCwBBmXbJ7QrgRBGVvg-0lZ4co';
    const engineId = '5566ee8561520445b';
    const query = 'Apollo Hospital Delhi opening hours';
    
    console.log(`Engine ID: ${engineId}`);
    console.log(`Query: "${query}"\n`);
    
    try {
        console.log('🔍 Calling Google Custom Search API...');
        
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${encodeURIComponent(query)}&num=5`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`Response status: ${response.status}\n`);
        
        if (response.ok && data.items && data.items.length > 0) {
            console.log(`✅ SUCCESS! Found ${data.items.length} results:\n`);
            
            data.items.forEach((item, idx) => {
                console.log(`${idx + 1}. ${item.title}`);
                console.log(`   ${item.snippet.substring(0, 100)}...`);
                console.log(`   ${item.link}\n`);
            });
            
            console.log('=== WEB SEARCH IS WORKING ===');
            console.log('✅ Restart your server and test the AI!');
            
        } else if (data.error) {
            console.log('❌ Error:', data.error.message);
        } else {
            console.log('⚠️ No results found');
            console.log('Response:', JSON.stringify(data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testNewSearchEngine();
