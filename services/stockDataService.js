const axios = require('axios');

/**
 * Stock Data Service - Fetches real stock prices from various APIs
 * 
 * Free API Options:
 * 1. Alpha Vantage - 5 API calls/minute (free tier)
 * 2. Yahoo Finance (via RapidAPI) - Limited free tier
 * 3. NSE India (unofficial) - Free but may be unstable
 * 4. Twelve Data - 800 API calls/day (free tier)
 */

class StockDataService {
    constructor() {
        // API Keys (get from environment variables)
        this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
        this.twelveDataKey = process.env.TWELVE_DATA_API_KEY || '';
        
        // Cache to avoid excessive API calls
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch real-time stock data from Alpha Vantage
     */
    async fetchFromAlphaVantage(symbol) {
        try {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${this.alphaVantageKey}`;
            const response = await axios.get(url);
            
            if (response.data['Global Quote']) {
                const quote = response.data['Global Quote'];
                
                // Safely parse change percent
                let changePercent = 0;
                if (quote['10. change percent']) {
                    const percentStr = quote['10. change percent'].toString().replace('%', '');
                    changePercent = parseFloat(percentStr) || 0;
                }
                
                return {
                    symbol: symbol,
                    currentPrice: parseFloat(quote['05. price']) || 0,
                    previousClose: parseFloat(quote['08. previous close']) || 0,
                    change: parseFloat(quote['09. change']) || 0,
                    changePercent: changePercent,
                    dayHigh: parseFloat(quote['03. high']) || 0,
                    dayLow: parseFloat(quote['04. low']) || 0,
                    volume: parseInt(quote['06. volume']) || 0,
                    lastUpdated: new Date(quote['07. latest trading day']),
                    source: 'Alpha Vantage'
                };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching from Alpha Vantage for ${symbol}:`, error.message);
            return null;
        }
    }

    /**
     * Fetch real-time stock data from Twelve Data
     */
    async fetchFromTwelveData(symbol) {
        try {
            const url = `https://api.twelvedata.com/quote?symbol=${symbol}&exchange=NSE&apikey=${this.twelveDataKey}`;
            const response = await axios.get(url);
            
            if (response.data && !response.data.error) {
                const data = response.data;
                return {
                    symbol: symbol,
                    currentPrice: parseFloat(data.close) || 0,
                    previousClose: parseFloat(data.previous_close) || 0,
                    change: parseFloat(data.change) || 0,
                    changePercent: parseFloat(data.percent_change) || 0,
                    dayHigh: parseFloat(data.high) || 0,
                    dayLow: parseFloat(data.low) || 0,
                    volume: parseInt(data.volume) || 0,
                    lastUpdated: new Date(),
                    source: 'Twelve Data'
                };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching from Twelve Data for ${symbol}:`, error.message);
            return null;
        }
    }

    /**
     * Fetch from NSE India (unofficial API)
     */
    async fetchFromNSE(symbol) {
        try {
            // NSE requires specific headers
            const headers = {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
            };

            const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
            const response = await axios.get(url, { headers });
            
            if (response.data && response.data.priceInfo) {
                const priceInfo = response.data.priceInfo;
                const intraDayHighLow = priceInfo.intraDayHighLow || {};
                
                return {
                    symbol: symbol,
                    currentPrice: parseFloat(priceInfo.lastPrice) || 0,
                    previousClose: parseFloat(priceInfo.previousClose) || 0,
                    change: parseFloat(priceInfo.change) || 0,
                    changePercent: parseFloat(priceInfo.pChange) || 0,
                    dayHigh: parseFloat(intraDayHighLow.max) || 0,
                    dayLow: parseFloat(intraDayHighLow.min) || 0,
                    volume: parseInt(response.data.preOpenMarket?.totalTradedVolume || 0),
                    lastUpdated: new Date(),
                    source: 'NSE India'
                };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching from NSE for ${symbol}:`, error.message);
            return null;
        }
    }

    /**
     * Get stock data with caching
     */
    async getStockData(symbol) {
        // Check cache first
        const cacheKey = `stock_${symbol}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
            return cached.data;
        }

        // Try multiple sources in order
        let data = null;
        
        // Try NSE first (free and most accurate for Indian stocks)
        data = await this.fetchFromNSE(symbol);
        
        // Fallback to Twelve Data
        if (!data && this.twelveDataKey) {
            data = await this.fetchFromTwelveData(symbol);
        }
        
        // Fallback to Alpha Vantage
        if (!data && this.alphaVantageKey !== 'demo') {
            data = await this.fetchFromAlphaVantage(symbol);
        }

        // Cache the result
        if (data) {
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
        }

        return data;
    }

    /**
     * Get multiple stocks data
     */
    async getMultipleStocks(symbols) {
        const promises = symbols.map(symbol => this.getStockData(symbol));
        const results = await Promise.all(promises);
        return results.filter(data => data !== null);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

module.exports = new StockDataService();
