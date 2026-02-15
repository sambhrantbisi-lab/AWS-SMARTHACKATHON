/**
 * Debug script to test context gathering
 * Run this in browser console on stocks.html
 */

console.log('=== Context Gathering Debug ===');

// Test if function exists
console.log('1. Function exists:', typeof window.gatherPageContextFixed);

// Test basic context
if (typeof window.gatherPageContextFixed === 'function') {
    const context = window.gatherPageContextFixed();
    console.log('2. Context returned:', context);
    
    if (context.visibleStocks) {
        console.log('3. Number of stocks:', context.visibleStocks.length);
        console.log('4. First stock:', context.visibleStocks[0]);
        
        // Check if volume is present
        const hasVolume = context.visibleStocks.some(s => s.volume);
        console.log('5. Has volume data:', hasVolume);
        
        if (!hasVolume) {
            console.log('⚠️ Volume data missing! Debugging...');
            
            // Check DOM directly
            const stockCards = document.querySelectorAll('.stock-card');
            console.log('6. Stock cards in DOM:', stockCards.length);
            
            if (stockCards.length > 0) {
                const firstCard = stockCards[0];
                console.log('7. First card HTML:', firstCard.innerHTML.substring(0, 500));
                
                const detailItems = firstCard.querySelectorAll('.detail-item');
                console.log('8. Detail items found:', detailItems.length);
                
                detailItems.forEach((item, idx) => {
                    const label = item.querySelector('.detail-label');
                    const value = item.querySelector('.detail-value');
                    console.log(`   Detail ${idx}:`, 
                        label ? label.textContent : 'no label',
                        '=',
                        value ? value.textContent : 'no value'
                    );
                });
            }
        } else {
            console.log('✅ Volume data found!');
            const stocksWithVolume = context.visibleStocks.filter(s => s.volume);
            console.log('6. Stocks with volume:', stocksWithVolume.length);
            console.log('7. Sample volumes:', stocksWithVolume.slice(0, 3).map(s => ({
                symbol: s.symbol,
                volume: s.volume
            })));
        }
    } else {
        console.log('⚠️ No visible stocks in context!');
    }
} else {
    console.log('❌ Context gathering function not found!');
}

console.log('=== Debug Complete ===');
