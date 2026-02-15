// Enhanced Stock Search and Detail View System
// Supports 100,000+ stocks with dynamic loading

class StockSearchSystem {
    constructor() {
        this.apiKey = 'OFVLY5O1ON2T7OZJ';
        this.searchResults = [];
        this.currentStock = null;
        this.popularStocks = [
            'RELIANCE.BSE', 'TCS.BSE', 'INFY.BSE', 'HDFCBANK.BSE', 'ICICIBANK.BSE',
            'BHARTIARTL.BSE', 'ITC.BSE', 'SBIN.BSE', 'HINDUNILVR.BSE', 'LT.BSE',
            'KOTAKBANK.BSE', 'AXISBANK.BSE', 'ASIANPAINT.BSE', 'MARUTI.BSE', 'WIPRO.BSE'
        ];
        this.loadedStocks = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
    }

    // Search stocks using Alpha Vantage Symbol Search
    async searchStocks(query) {
        if (!query || query.length < 2) return [];
        
        try {
            const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.bestMatches) {
                this.searchResults = data.bestMatches.map(match => ({
                    symbol: match['1. symbol'],
                    name: match['2. name'],
                    type: match['3. type'],
                    region: match['4. region'],
                    currency: match['8. currency'],
                    matchScore: match['9. matchScore']
                }));
                return this.searchResults;
            }
            return [];
        } catch (error) {
            console.error('Stock search error:', error);
            return [];
        }
    }

    // Get detailed stock data
    async getStockDetails(symbol) {
        try {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data['Global Quote']) {
                const quote = data['Global Quote'];
                return {
                    symbol: quote['01. symbol'],
                    open: parseFloat(quote['02. open']),
                    high: parseFloat(quote['03. high']),
                    low: parseFloat(quote['04. low']),
                    price: parseFloat(quote['05. price']),
                    volume: parseInt(quote['06. volume']),
                    latestDay: quote['07. latest trading day'],
                    previousClose: parseFloat(quote['08. previous close']),
                    change: parseFloat(quote['09. change']),
                    changePercent: quote['10. change percent']
                };
            }
            return null;
        } catch (error) {
            console.error('Stock details error:', error);
            return null;
        }
    }

    // Get historical data for charts
    async getStockHistory(symbol, interval = 'daily') {
        try {
            const functionMap = {
                'daily': 'TIME_SERIES_DAILY',
                'weekly': 'TIME_SERIES_WEEKLY',
                'monthly': 'TIME_SERIES_MONTHLY'
            };
            
            const url = `https://www.alphavantage.co/query?function=${functionMap[interval]}&symbol=${symbol}&apikey=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            
            const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
            if (timeSeriesKey) {
                const timeSeries = data[timeSeriesKey];
                return Object.entries(timeSeries).map(([date, values]) => ({
                    date,
                    open: parseFloat(values['1. open']),
                    high: parseFloat(values['2. high']),
                    low: parseFloat(values['3. low']),
                    close: parseFloat(values['4. close']),
                    volume: parseInt(values['5. volume'])
                })).slice(0, 100); // Last 100 data points
            }
            return [];
        } catch (error) {
            console.error('Stock history error:', error);
            return [];
        }
    }

    // Load popular stocks dynamically
    async loadPopularStocks(page = 1) {
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const stocksToLoad = this.popularStocks.slice(start, end);
        
        const promises = stocksToLoad.map(symbol => this.getStockDetails(symbol));
        const results = await Promise.all(promises);
        
        this.loadedStocks = results.filter(stock => stock !== null);
        return this.loadedStocks;
    }

    // Pagination helpers
    getTotalPages() {
        return Math.ceil(this.popularStocks.length / this.itemsPerPage);
    }

    hasNextPage() {
        return this.currentPage < this.getTotalPages();
    }

    hasPrevPage() {
        return this.currentPage > 1;
    }
}

// Initialize the system
const stockSearch = new StockSearchSystem();
