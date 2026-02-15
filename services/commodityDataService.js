const axios = require('axios');

/**
 * Commodity Data Service - Fetches real commodity prices
 * 
 * Data Sources:
 * 1. AGMARKNET API (Government of India) - Free
 * 2. Data.gov.in - Open Government Data
 * 3. State Marketing Board APIs
 */

class CommodityDataService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes (commodity prices don't change as frequently)
    }

    /**
     * Fetch from AGMARKNET (Government of India) - Batch Strategy
     * Fetches ALL available data in multiple batches
     */
    async fetchFromDataGovIn() {
        try {
            const apiKey = process.env.DATA_GOV_IN_API_KEY || '';
            const datasetId = process.env.DATA_GOV_IN_DATASET_ID || '9ef84268-d588-465a-a308-a864a43d0070';
            
            if (!apiKey) {
                console.log('DATA_GOV_IN_API_KEY not set, cannot fetch real data');
                return null;
            }

            console.log(`Using dataset ID: ${datasetId}`);

            // Fetch in batches until no more data
            const allRecords = [];
            const limit = 100;
            const batchSize = 5; // Fetch 5 pages at a time (500 records per batch)
            let batchNumber = 0;
            let hasMoreData = true;
            
            while (hasMoreData) {
                batchNumber++;
                console.log(`\n📦 Starting batch ${batchNumber}...`);
                
                // Fetch one batch
                const batchRecords = await this.fetchBatch(apiKey, datasetId, (batchNumber - 1) * batchSize, batchSize, limit);
                
                if (batchRecords.length > 0) {
                    allRecords.push(...batchRecords);
                    console.log(`✓ Batch ${batchNumber} complete: ${batchRecords.length} records (total: ${allRecords.length})`);
                    
                    // If we got fewer records than expected, we've reached the end
                    if (batchRecords.length < batchSize * limit) {
                        console.log('✓ Reached end of available data');
                        hasMoreData = false;
                    }
                } else {
                    console.log(`⚠ Batch ${batchNumber} returned no data, stopping`);
                    hasMoreData = false;
                }
                
                // Longer delay between batches to let API recover
                if (hasMoreData) {
                    console.log('⏳ Waiting 5 seconds before next batch...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
            
            if (allRecords.length > 0) {
                console.log(`\n✅ Total fetched: ${allRecords.length} commodity records from Data.gov.in`);
                return this.parseDataGovInResponse(allRecords);
            }
            
            console.warn('Data.gov.in returned no records');
            return null;
        } catch (error) {
            console.error('Error fetching from Data.gov.in:', error.message);
            return null;
        }
    }

    /**
     * Fetch a single batch of pages
     */
    async fetchBatch(apiKey, datasetId, startPage, numPages, limit) {
        const batchRecords = [];
        
        for (let i = 0; i < numPages; i++) {
            const page = startPage + i;
            const offset = page * limit;
            const url = `https://api.data.gov.in/resource/${datasetId}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;
            
            let retries = 3;
            let success = false;
            
            while (retries > 0 && !success) {
                try {
                    const response = await axios.get(url, { 
                        timeout: 20000,
                        headers: {
                            'Connection': 'close',
                            'User-Agent': 'Mozilla/5.0'
                        }
                    });
                    
                    if (response.data && response.data.records && response.data.records.length > 0) {
                        batchRecords.push(...response.data.records);
                        console.log(`  ✓ Page ${page + 1}: ${response.data.records.length} records`);
                        success = true;
                        
                        // If we got fewer records than the limit, we've reached the end
                        if (response.data.records.length < limit) {
                            return batchRecords;
                        }
                    } else {
                        // No more records
                        return batchRecords;
                    }
                    
                } catch (pageError) {
                    retries--;
                    const isConnectionError = pageError.code === 'ECONNABORTED' || 
                                            pageError.code === 'ECONNRESET' ||
                                            pageError.message.includes('SSL') ||
                                            pageError.message.includes('timeout');
                    
                    if (isConnectionError && retries > 0) {
                        console.log(`  ⚠ Connection issue on page ${page + 1}, retrying (${retries} left)...`);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    } else {
                        console.error(`  ✗ Failed page ${page + 1}: ${pageError.message}`);
                        if (batchRecords.length > 0) {
                            return batchRecords; // Return what we have so far
                        }
                        break;
                    }
                }
            }
            
            if (!success && batchRecords.length === 0) {
                break; // Stop if we can't fetch anything
            }
            
            // Small delay between pages within a batch
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return batchRecords;
    }

    /**
     * Parse Data.gov.in response
     */
    parseDataGovInResponse(records) {
        return records.map(record => {
            // Parse date from DD/MM/YYYY format
            let lastUpdated = null;
            if (record.arrival_date) {
                try {
                    // Handle DD/MM/YYYY format (e.g., "14/02/2026")
                    const parts = record.arrival_date.split('/');
                    if (parts.length === 3) {
                        const day = parseInt(parts[0]);
                        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
                        const year = parseInt(parts[2]);
                        lastUpdated = new Date(year, month, day);
                        
                        // Validate the date
                        if (isNaN(lastUpdated.getTime()) || lastUpdated.getFullYear() < 2000) {
                            lastUpdated = null;
                        }
                    }
                } catch (error) {
                    console.warn('Failed to parse date:', record.arrival_date, error);
                }
            }
            
            // Only use current date if no valid date from API
            if (!lastUpdated) {
                lastUpdated = new Date();
            }

            return {
                commodity: record.commodity,
                category: this.categorize(record.commodity),
                state: record.state,
                district: record.district,
                market: record.market,
                prices: {
                    wholesale: {
                        min: parseFloat(record.min_price) || 0,
                        max: parseFloat(record.max_price) || 0,
                        average: parseFloat(record.modal_price) || 0
                    },
                    retail: {
                        min: parseFloat(record.min_price) * 1.3 || 0,
                        max: parseFloat(record.max_price) * 1.3 || 0,
                        average: parseFloat(record.modal_price) * 1.3 || 0
                    }
                },
                unit: 'per quintal',
                quality: 'good',
                trend: this.calculateTrend(record),
                lastUpdated: lastUpdated,
                source: 'AGMARKNET via Data.gov.in'
            };
        });
    }

    /**
     * Categorize commodity - Enhanced with more items
     */
    categorize(commodity) {
        const vegetables = ['onion', 'tomato', 'potato', 'cabbage', 'cauliflower', 'brinjal', 'eggplant', 
                           'carrot', 'beans', 'peas', 'capsicum', 'pepper', 'cucumber', 'radish', 'beetroot',
                           'spinach', 'methi', 'coriander', 'mint', 'lady finger', 'okra', 'bitter gourd',
                           'bottle gourd', 'ridge gourd', 'pumpkin', 'drumstick'];
        
        const fruits = ['apple', 'banana', 'mango', 'orange', 'grapes', 'papaya', 'watermelon', 'muskmelon',
                       'pomegranate', 'guava', 'pineapple', 'coconut', 'lemon', 'lime', 'sweet lime',
                       'sapota', 'custard apple', 'jackfruit', 'litchi', 'strawberry'];
        
        const grains = ['rice', 'wheat', 'maize', 'bajra', 'jowar', 'ragi', 'barley', 'paddy', 'corn'];
        
        const pulses = ['tur', 'moong', 'urad', 'masoor', 'chana', 'arhar', 'gram', 'lentil', 'peas',
                       'rajma', 'kidney bean', 'soybean', 'groundnut', 'peanut'];
        
        const spices = ['turmeric', 'chili', 'chilli', 'coriander', 'cumin', 'pepper', 'cardamom',
                       'clove', 'cinnamon', 'ginger', 'garlic', 'dry chilli', 'red chilli'];
        
        const oilseeds = ['mustard', 'sesame', 'sunflower', 'safflower', 'castor', 'linseed', 'niger',
                         'groundnut', 'soybean', 'coconut'];

        const commodityLower = commodity.toLowerCase();
        
        if (vegetables.some(v => commodityLower.includes(v))) return 'vegetables';
        if (fruits.some(f => commodityLower.includes(f))) return 'fruits';
        if (grains.some(g => commodityLower.includes(g))) return 'grains';
        if (pulses.some(p => commodityLower.includes(p))) return 'pulses';
        if (spices.some(s => commodityLower.includes(s))) return 'spices';
        if (oilseeds.some(o => commodityLower.includes(o))) return 'oilseeds';
        
        return 'other';
    }

    /**
     * Calculate price trend
     */
    calculateTrend(record) {
        // Simple trend calculation based on price comparison
        // In production, you'd compare with historical data
        const currentPrice = parseFloat(record.modal_price);
        const minPrice = parseFloat(record.min_price);
        const maxPrice = parseFloat(record.max_price);
        
        if (currentPrice > (minPrice + maxPrice) / 2 * 1.1) return 'rising';
        if (currentPrice < (minPrice + maxPrice) / 2 * 0.9) return 'falling';
        return 'stable';
    }

    /**
     * Get commodity data with caching - NO FALLBACK
     */
    async getCommodityData() {
        // Check cache
        const cacheKey = 'commodity_data';
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
            return cached.data;
        }

        // Fetch fresh data from Data.gov.in API
        const data = await this.fetchFromDataGovIn();
        
        // Return null if API fails - NO FALLBACK
        if (!data || data.length === 0) {
            console.error('Failed to fetch commodity data from Data.gov.in API');
            return null;
        }

        // Cache the result
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });

        return data;
    }

    /**
     * Get paginated commodity data - For lazy loading
     */
    async getPaginatedData(limit = 100, offset = 0) {
        try {
            const apiKey = process.env.DATA_GOV_IN_API_KEY || '';
            const datasetId = process.env.DATA_GOV_IN_DATASET_ID || '9ef84268-d588-465a-a308-a864a43d0070';
            
            if (!apiKey) {
                console.log('DATA_GOV_IN_API_KEY not set');
                return null;
            }

            const url = `https://api.data.gov.in/resource/${datasetId}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;
            
            const response = await axios.get(url, { 
                timeout: 20000,
                headers: {
                    'Connection': 'close',
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            
            if (response.data && response.data.records && response.data.records.length > 0) {
                return this.parseDataGovInResponse(response.data.records);
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching paginated data:', error.message);
            return [];
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

module.exports = new CommodityDataService();
