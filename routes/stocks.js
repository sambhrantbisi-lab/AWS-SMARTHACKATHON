const express = require('express');
const router = express.Router();

// Mock stock data - In production, integrate with NSE/BSE APIs
const mockStockData = [
    {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Limited',
        exchange: 'NSE',
        sector: 'Energy',
        currentPrice: 2456.75,
        previousClose: 2445.30,
        change: 11.45,
        dayHigh: 2467.80,
        dayLow: 2441.20,
        volume: 12500000,
        marketCap: 1658000000000, // in rupees
        pe: 24.5,
        lastUpdated: new Date()
    },
    {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        exchange: 'NSE',
        sector: 'IT',
        currentPrice: 3678.90,
        previousClose: 3665.45,
        change: 13.45,
        dayHigh: 3689.30,
        dayLow: 3658.70,
        volume: 8750000,
        marketCap: 1342000000000,
        pe: 28.3,
        lastUpdated: new Date()
    },
    {
        symbol: 'INFY',
        name: 'Infosys Limited',
        exchange: 'NSE',
        sector: 'IT',
        currentPrice: 1456.25,
        previousClose: 1448.80,
        change: 7.45,
        dayHigh: 1462.90,
        dayLow: 1445.60,
        volume: 15600000,
        marketCap: 602000000000,
        pe: 26.8,
        lastUpdated: new Date()
    },
    {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Limited',
        exchange: 'NSE',
        sector: 'Banking',
        currentPrice: 1678.45,
        previousClose: 1685.20,
        change: -6.75,
        dayHigh: 1689.80,
        dayLow: 1672.30,
        volume: 9800000,
        marketCap: 1278000000000,
        pe: 18.9,
        lastUpdated: new Date()
    },
    {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Limited',
        exchange: 'NSE',
        sector: 'Banking',
        currentPrice: 945.60,
        previousClose: 952.30,
        change: -6.70,
        dayHigh: 956.80,
        dayLow: 941.20,
        volume: 11200000,
        marketCap: 658000000000,
        pe: 16.2,
        lastUpdated: new Date()
    },
    {
        symbol: 'WIPRO',
        name: 'Wipro Limited',
        exchange: 'NSE',
        sector: 'IT',
        currentPrice: 445.30,
        previousClose: 442.80,
        change: 2.50,
        dayHigh: 448.90,
        dayLow: 441.20,
        volume: 7800000,
        marketCap: 245000000000,
        pe: 22.1,
        lastUpdated: new Date()
    },
    {
        symbol: 'MARUTI',
        name: 'Maruti Suzuki India Limited',
        exchange: 'NSE',
        sector: 'Auto',
        currentPrice: 10245.60,
        previousClose: 10198.30,
        change: 47.30,
        dayHigh: 10267.80,
        dayLow: 10189.40,
        volume: 1250000,
        marketCap: 309000000000,
        pe: 32.4,
        lastUpdated: new Date()
    },
    {
        symbol: 'HINDUNILVR',
        name: 'Hindustan Unilever Limited',
        exchange: 'NSE',
        sector: 'FMCG',
        currentPrice: 2567.80,
        previousClose: 2554.20,
        change: 13.60,
        dayHigh: 2578.90,
        dayLow: 2549.30,
        volume: 2100000,
        marketCap: 602000000000,
        pe: 58.7,
        lastUpdated: new Date()
    }
];

// Get all stocks with filtering
router.get('/', async (req, res) => {
    try {
        const { exchange, sector, symbol, page = 1, limit = 20 } = req.query;
        
        let filteredStocks = mockStockData;
        
        if (exchange) {
            filteredStocks = filteredStocks.filter(stock => 
                stock.exchange.toLowerCase() === exchange.toLowerCase()
            );
        }
        
        if (sector) {
            filteredStocks = filteredStocks.filter(stock => 
                stock.sector.toLowerCase() === sector.toLowerCase()
            );
        }
        
        if (symbol) {
            filteredStocks = filteredStocks.filter(stock => 
                stock.symbol.toLowerCase().includes(symbol.toLowerCase()) ||
                stock.name.toLowerCase().includes(symbol.toLowerCase())
            );
        }
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedStocks = filteredStocks.slice(startIndex, endIndex);
        
        res.json({
            stocks: paginatedStocks,
            totalPages: Math.ceil(filteredStocks.length / limit),
            currentPage: parseInt(page),
            total: filteredStocks.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock data', error: error.message });
    }
});

// Get market indices
router.get('/indices', async (req, res) => {
    try {
        const indices = [
            {
                name: 'NIFTY 50',
                value: 19674.25,
                change: 145.30,
                changePercent: 0.74,
                lastUpdated: new Date()
            },
            {
                name: 'SENSEX',
                value: 65953.48,
                change: 498.58,
                changePercent: 0.76,
                lastUpdated: new Date()
            },
            {
                name: 'NIFTY BANK',
                value: 44821.15,
                change: 312.85,
                changePercent: 0.70,
                lastUpdated: new Date()
            },
            {
                name: 'NIFTY IT',
                value: 31245.80,
                change: 234.60,
                changePercent: 0.76,
                lastUpdated: new Date()
            },
            {
                name: 'NIFTY AUTO',
                value: 16789.45,
                change: -89.30,
                changePercent: -0.53,
                lastUpdated: new Date()
            }
        ];
        
        res.json(indices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching indices data' });
    }
});

// Get top gainers
router.get('/gainers', async (req, res) => {
    try {
        const gainers = mockStockData
            .filter(stock => stock.change > 0)
            .sort((a, b) => (b.change / b.previousClose) - (a.change / a.previousClose))
            .slice(0, 10);
            
        res.json(gainers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gainers data' });
    }
});

// Get top losers
router.get('/losers', async (req, res) => {
    try {
        const losers = mockStockData
            .filter(stock => stock.change < 0)
            .sort((a, b) => (a.change / a.previousClose) - (b.change / b.previousClose))
            .slice(0, 10);
            
        res.json(losers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching losers data' });
    }
});

// Get stock by symbol
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const stock = mockStockData.find(s => 
            s.symbol.toLowerCase() === symbol.toLowerCase()
        );
        
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        
        // Generate mock historical data for charts
        const historicalData = [];
        let currentPrice = stock.currentPrice;
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const change = (Math.random() - 0.5) * 50;
            currentPrice += change;
            
            historicalData.push({
                date: date.toISOString().split('T')[0],
                price: Math.max(currentPrice, stock.currentPrice * 0.8),
                volume: Math.floor(Math.random() * 5000000) + 1000000
            });
        }
        
        res.json({
            ...stock,
            historicalData
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock details' });
    }
});

module.exports = router;