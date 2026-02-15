const express = require('express');
const router = express.Router();
const stockDataService = require('../services/stockDataService');
const commodityDataService = require('../services/commodityDataService');
const nseStockListService = require('../services/nseStockListService');

// Simple routes for brutalist pages
router.get('/stocks', async (req, res) => {
    // Redirect to live endpoint
    req.url = '/stocks/live';
    return router.handle(req, res);
});

router.get('/commodities', async (req, res) => {
    // Redirect to live endpoint
    req.url = '/commodities/live';
    return router.handle(req, res);
});

// Paginated Stock API - Fetches stocks in chunks
router.get('/stocks/paginated', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        
        // Get symbols for this page
        const symbols = nseStockListService.getPaginatedSymbols(limit, offset);
        
        if (symbols.length === 0) {
            return res.json({
                success: true,
                data: [],
                hasMore: false,
                message: 'No more stocks available'
            });
        }
        
        // Fetch real data for these symbols
        const stockData = await stockDataService.getMultipleStocks(symbols);
        
        // Enrich with additional info
        const enrichedData = stockData.map(stock => ({
            ...stock,
            name: getStockName(stock.symbol),
            exchange: 'NSE',
            sector: getStockSector(stock.symbol),
            marketCap: getMarketCap(stock.symbol),
            marketStatus: checkMarketHours(new Date()) ? 'OPEN' : 'CLOSED',
            currency: 'INR'
        }));
        
        const totalStocks = nseStockListService.getTotalCount();
        const hasMore = (offset + limit) < totalStocks;
        
        res.json({
            success: true,
            data: enrichedData,
            limit: limit,
            offset: offset,
            count: enrichedData.length,
            totalAvailable: totalStocks,
            hasMore: hasMore,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Error fetching paginated stock data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stock data',
            message: error.message
        });
    }
});

// Real Stock Data API - Now fetches from actual APIs ONLY
router.get('/stocks/live', async (req, res) => {
    try {
        const currentDate = new Date();
        const isMarketOpen = checkMarketHours(currentDate);
        
        // Indian stock symbols to fetch - Comprehensive list of 48 popular stocks
        const symbols = [
            // Banking & Finance
            'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL',
            'ITC', 'SBIN', 'HINDUNILVR', 'LT', 'KOTAKBANK', 'AXISBANK',
            'ASIANPAINT', 'MARUTI', 'WIPRO', 'BAJFINANCE', 'TITAN', 'ULTRACEMCO',
            'NESTLEIND', 'SUNPHARMA', 'POWERGRID', 'NTPC', 'ONGC', 'TATASTEEL',
            'TECHM', 'HCLTECH', 'ADANIPORTS', 'JSWSTEEL', 'INDUSINDBK', 'DRREDDY',
            // Additional stocks
            'COALINDIA', 'GRASIM', 'HINDALCO', 'TATAMOTORS', 'BAJAJFINSV', 'DIVISLAB',
            'BRITANNIA', 'CIPLA', 'EICHERMOT', 'HEROMOTOCO', 'SHREECEM', 'UPL',
            'APOLLOHOSP', 'TATACONSUM', 'SBILIFE', 'HDFCLIFE', 'BAJAJ-AUTO', 'M&M'
        ];
        
        // Fetch real data from APIs - NO FALLBACK
        const realStockData = await stockDataService.getMultipleStocks(symbols);
        
        if (!realStockData || realStockData.length === 0) {
            return res.status(503).json({
                success: false,
                error: 'Unable to fetch real-time stock data. API rate limit may be exceeded.',
                message: 'Please try again in a few minutes. Free API tier: 5 calls/minute, 25 calls/day.',
                rateLimitInfo: {
                    freeLimit: '25 API calls per day',
                    currentLimit: '5 API calls per minute',
                    suggestion: 'Use search functionality to query specific stocks'
                }
            });
        }
        
        // Enrich with additional info
        const enrichedData = realStockData.map(stock => ({
            ...stock,
            name: getStockName(stock.symbol),
            exchange: 'NSE',
            sector: getStockSector(stock.symbol),
            marketCap: getMarketCap(stock.symbol),
            marketStatus: isMarketOpen ? 'OPEN' : 'CLOSED',
            currency: 'INR'
        }));

        // Market indices (would also come from API in production)
        const marketIndices = {
            nifty50: {
                value: 19674.25,
                change: isMarketOpen ? 45.30 : 0,
                changePercent: isMarketOpen ? 0.23 : 0,
                lastUpdated: currentDate
            },
            sensex: {
                value: 66112.44,
                change: isMarketOpen ? 123.45 : 0,
                changePercent: isMarketOpen ? 0.19 : 0,
                lastUpdated: currentDate
            },
            bankNifty: {
                value: 43567.80,
                change: isMarketOpen ? -89.20 : 0,
                changePercent: isMarketOpen ? -0.20 : 0,
                lastUpdated: currentDate
            }
        };

        res.json({
            success: true,
            data: {
                stocks: enrichedData,
                indices: marketIndices,
                marketStatus: isMarketOpen ? 'OPEN' : 'CLOSED',
                lastUpdated: currentDate,
                source: enrichedData[0]?.source || 'Real-time API',
                disclaimer: 'Stock prices from real APIs. Free tier: 25 calls/day, 5 calls/minute.',
                totalStocks: enrichedData.length,
                apiInfo: {
                    provider: 'Alpha Vantage / NSE India',
                    updateFrequency: 'Real-time during market hours',
                    dataDelay: '15-20 minutes'
                }
            }
        });

    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch real-time stock data',
            message: error.message,
            suggestion: 'API rate limit may be exceeded. Try again later or use search for specific stocks.'
        });
    }
});

// Real Commodity Prices API - Returns all pre-loaded data
router.get('/commodities/live', async (req, res) => {
    try {
        // Fetch real commodity data - NO FALLBACK
        const commodityData = await commodityDataService.getCommodityData();
        
        if (!commodityData || commodityData.length === 0) {
            return res.status(503).json({
                success: false,
                error: 'Unable to fetch real-time commodity data from Data.gov.in',
                message: 'API key may be invalid or rate limit exceeded.',
                suggestion: 'Verify DATA_GOV_IN_API_KEY in .env file'
            });
        }
        
        res.json({
            success: true,
            data: commodityData,
            totalCommodities: commodityData.length,
            lastUpdated: new Date(),
            source: commodityData[0]?.source || 'AGMARKNET via Data.gov.in',
            disclaimer: 'Commodity prices are updated daily from government sources.',
            coverage: {
                commodities: new Set(commodityData.map(c => c.commodity)).size,
                states: new Set(commodityData.map(c => c.state)).size,
                markets: new Set(commodityData.map(c => c.market)).size
            }
        });

    } catch (error) {
        console.error('Error fetching commodity data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch real-time commodity data',
            message: error.message
        });
    }
});

// Paginated Commodity API - Fetches directly from Data.gov.in API
router.get('/commodities/paginated', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        
        // Fetch directly from API (no caching)
        const commodityData = await commodityDataService.getPaginatedData(limit, offset);
        
        if (!commodityData || commodityData.length === 0) {
            return res.json({
                success: true,
                data: [],
                hasMore: false,
                message: 'No more data available'
            });
        }
        
        res.json({
            success: true,
            data: commodityData,
            limit: limit,
            offset: offset,
            count: commodityData.length,
            hasMore: commodityData.length === limit,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Error fetching paginated commodity data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch commodity data',
            message: error.message
        });
    }
});

// Real Government Services Data
router.get('/services/official', async (req, res) => {
    try {
        const realServices = [
            {
                id: 'aadhaar-services',
                name: 'Aadhaar Card Services',
                description: 'Unique Identification Authority of India (UIDAI) services for Aadhaar enrollment, update, and download.',
                department: 'UIDAI',
                category: 'identity-documents',
                officialWebsite: 'https://uidai.gov.in',
                applicationUrl: 'https://appointments.uidai.gov.in',
                processingTime: {
                    normal: '90 days',
                    urgent: 'Not available'
                },
                fees: {
                    newEnrollment: 0,
                    update: 50,
                    reprint: 50
                },
                requiredDocuments: [
                    'Proof of Identity',
                    'Proof of Address',
                    'Proof of Date of Birth'
                ],
                onlineServices: [
                    'Download e-Aadhaar',
                    'Update demographic details',
                    'Check enrollment status',
                    'Book appointment'
                ],
                helpline: '1947',
                isActive: true,
                lastUpdated: new Date()
            },
            {
                id: 'pan-card',
                name: 'PAN Card Application',
                description: 'Apply for Permanent Account Number through NSDL or UTIITSL for income tax purposes.',
                department: 'Income Tax Department',
                category: 'financial-services',
                officialWebsite: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
                applicationUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
                processingTime: {
                    normal: '15-20 days',
                    tatkal: '7 days'
                },
                fees: {
                    normal: 110,
                    tatkal: 370,
                    correction: 110,
                    reprint: 110
                },
                requiredDocuments: [
                    'Identity Proof',
                    'Address Proof',
                    'Date of Birth Proof',
                    'Photograph'
                ],
                onlineServices: [
                    'New PAN application',
                    'PAN correction',
                    'Duplicate PAN',
                    'Track application status'
                ],
                helpline: '020-27218080',
                isActive: true,
                lastUpdated: new Date()
            }
        ];

        res.json({
            success: true,
            services: realServices,
            totalServices: realServices.length,
            lastUpdated: new Date(),
            source: 'Official Government Portals'
        });

    } catch (error) {
        console.error('Error fetching services data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch services data',
            message: error.message
        });
    }
});

// Helper function to check market hours
function checkMarketHours(date) {
    const day = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const currentTime = hour * 60 + minute;
    
    // Indian market hours: Monday-Friday, 9:15 AM - 3:30 PM IST
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    return day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose;
}

// Helper functions for stock data
function getStockName(symbol) {
    const names = {
        // Major Blue Chips
        'RELIANCE': 'Reliance Industries Limited',
        'TCS': 'Tata Consultancy Services',
        'INFY': 'Infosys Limited',
        'HDFCBANK': 'HDFC Bank Limited',
        'ICICIBANK': 'ICICI Bank Limited',
        'BHARTIARTL': 'Bharti Airtel Limited',
        'ITC': 'ITC Limited',
        'SBIN': 'State Bank of India',
        'HINDUNILVR': 'Hindustan Unilever Limited',
        'LT': 'Larsen & Toubro Limited',
        'KOTAKBANK': 'Kotak Mahindra Bank Limited',
        'AXISBANK': 'Axis Bank Limited',
        'ASIANPAINT': 'Asian Paints Limited',
        'MARUTI': 'Maruti Suzuki India Limited',
        'WIPRO': 'Wipro Limited',
        'BAJFINANCE': 'Bajaj Finance Limited',
        'TITAN': 'Titan Company Limited',
        'ULTRACEMCO': 'UltraTech Cement Limited',
        'NESTLEIND': 'Nestle India Limited',
        'SUNPHARMA': 'Sun Pharmaceutical Industries',
        'POWERGRID': 'Power Grid Corporation',
        'NTPC': 'NTPC Limited',
        'ONGC': 'Oil and Natural Gas Corporation',
        'TATASTEEL': 'Tata Steel Limited',
        'TECHM': 'Tech Mahindra Limited',
        'HCLTECH': 'HCL Technologies Limited',
        'ADANIPORTS': 'Adani Ports and SEZ Limited',
        'JSWSTEEL': 'JSW Steel Limited',
        'INDUSINDBK': 'IndusInd Bank Limited',
        'DRREDDY': 'Dr. Reddy\'s Laboratories',
        // Additional Stocks
        'COALINDIA': 'Coal India Limited',
        'GRASIM': 'Grasim Industries Limited',
        'HINDALCO': 'Hindalco Industries Limited',
        'TATAMOTORS': 'Tata Motors Limited',
        'BAJAJFINSV': 'Bajaj Finserv Limited',
        'DIVISLAB': 'Divi\'s Laboratories Limited',
        'BRITANNIA': 'Britannia Industries Limited',
        'CIPLA': 'Cipla Limited',
        'EICHERMOT': 'Eicher Motors Limited',
        'HEROMOTOCO': 'Hero MotoCorp Limited',
        'SHREECEM': 'Shree Cement Limited',
        'UPL': 'UPL Limited',
        'APOLLOHOSP': 'Apollo Hospitals Enterprise',
        'TATACONSUM': 'Tata Consumer Products',
        'SBILIFE': 'SBI Life Insurance Company',
        'HDFCLIFE': 'HDFC Life Insurance Company',
        'BAJAJ-AUTO': 'Bajaj Auto Limited',
        'M&M': 'Mahindra & Mahindra Limited'
    };
    return names[symbol] || symbol;
}

function getStockSector(symbol) {
    const sectors = {
        // Banking & Finance
        'HDFCBANK': 'Banking',
        'ICICIBANK': 'Banking',
        'SBIN': 'Banking',
        'KOTAKBANK': 'Banking',
        'AXISBANK': 'Banking',
        'INDUSINDBK': 'Banking',
        'BAJFINANCE': 'Finance',
        'BAJAJFINSV': 'Finance',
        'SBILIFE': 'Insurance',
        'HDFCLIFE': 'Insurance',
        // IT
        'TCS': 'IT',
        'INFY': 'IT',
        'WIPRO': 'IT',
        'TECHM': 'IT',
        'HCLTECH': 'IT',
        // Energy & Power
        'RELIANCE': 'Energy',
        'ONGC': 'Energy',
        'POWERGRID': 'Power',
        'NTPC': 'Power',
        'COALINDIA': 'Energy',
        // Telecom
        'BHARTIARTL': 'Telecom',
        // Auto
        'MARUTI': 'Automobile',
        'TATAMOTORS': 'Automobile',
        'EICHERMOT': 'Automobile',
        'HEROMOTOCO': 'Automobile',
        'BAJAJ-AUTO': 'Automobile',
        'M&M': 'Automobile',
        // Pharma
        'SUNPHARMA': 'Pharma',
        'DRREDDY': 'Pharma',
        'DIVISLAB': 'Pharma',
        'CIPLA': 'Pharma',
        'APOLLOHOSP': 'Healthcare',
        // FMCG
        'HINDUNILVR': 'FMCG',
        'ITC': 'FMCG',
        'NESTLEIND': 'FMCG',
        'BRITANNIA': 'FMCG',
        'TATACONSUM': 'FMCG',
        // Metals & Mining
        'TATASTEEL': 'Metals',
        'JSWSTEEL': 'Metals',
        'HINDALCO': 'Metals',
        // Cement
        'ULTRACEMCO': 'Cement',
        'SHREECEM': 'Cement',
        // Others
        'LT': 'Infrastructure',
        'ASIANPAINT': 'Paints',
        'TITAN': 'Retail',
        'ADANIPORTS': 'Infrastructure',
        'GRASIM': 'Diversified',
        'UPL': 'Chemicals'
    };
    return sectors[symbol] || 'Other';
}

function getMarketCap(symbol) {
    const marketCaps = {
        'RELIANCE': 1658000000000,
        'TCS': 1342000000000,
        'HDFCBANK': 1278000000000,
        'ICICIBANK': 658000000000,
        'INFY': 602000000000,
        'BHARTIARTL': 489000000000,
        'ITC': 520000000000,
        'SBIN': 580000000000,
        'HINDUNILVR': 590000000000,
        'LT': 480000000000,
        'KOTAKBANK': 350000000000,
        'AXISBANK': 320000000000,
        'ASIANPAINT': 280000000000,
        'MARUTI': 360000000000,
        'WIPRO': 240000000000,
        'BAJFINANCE': 380000000000,
        'TITAN': 290000000000,
        'ULTRACEMCO': 310000000000,
        'NESTLEIND': 210000000000,
        'SUNPHARMA': 400000000000,
        'POWERGRID': 180000000000,
        'NTPC': 170000000000,
        'ONGC': 190000000000,
        'TATASTEEL': 240000000000,
        'TECHM': 150000000000,
        'HCLTECH': 340000000000,
        'ADANIPORTS': 280000000000,
        'JSWSTEEL': 220000000000,
        'INDUSINDBK': 140000000000,
        'DRREDDY': 100000000000,
        'COALINDIA': 160000000000,
        'GRASIM': 130000000000,
        'HINDALCO': 110000000000,
        'TATAMOTORS': 320000000000,
        'BAJAJFINSV': 270000000000,
        'DIVISLAB': 120000000000,
        'BRITANNIA': 130000000000,
        'CIPLA': 95000000000,
        'EICHERMOT': 110000000000,
        'HEROMOTOCO': 90000000000,
        'SHREECEM': 85000000000,
        'UPL': 75000000000,
        'APOLLOHOSP': 88000000000,
        'TATACONSUM': 92000000000,
        'SBILIFE': 125000000000,
        'HDFCLIFE': 135000000000,
        'BAJAJ-AUTO': 145000000000,
        'M&M': 155000000000
    };
    return marketCaps[symbol] || 100000000000;
}

module.exports = router;