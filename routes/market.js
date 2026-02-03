const express = require('express');
const MarketData = require('../models/MarketData');

const router = express.Router();

// Get market data with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      state, 
      category, 
      commodity, 
      district,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = { isActive: true };

    if (state) query.state = new RegExp(state, 'i');
    if (category) query.category = category;
    if (commodity) query.commodity = new RegExp(commodity, 'i');
    if (district) query.district = new RegExp(district, 'i');

    const marketData = await MarketData.find(query)
      .sort({ lastUpdated: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MarketData.countDocuments(query);

    res.json({
      data: marketData,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market data', error: error.message });
  }
});

// Get market data by state
router.get('/state/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const { category } = req.query;

    let query = { state: new RegExp(state, 'i'), isActive: true };
    if (category) query.category = category;

    const marketData = await MarketData.find(query)
      .sort({ commodity: 1 });

    res.json(marketData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching state market data' });
  }
});

// Get trending commodities
router.get('/trending', async (req, res) => {
  try {
    const trendingUp = await MarketData.find({ 
      trend: 'rising', 
      isActive: true 
    })
    .sort({ changePercent: -1 })
    .limit(10);

    const trendingDown = await MarketData.find({ 
      trend: 'falling', 
      isActive: true 
    })
    .sort({ changePercent: 1 })
    .limit(10);

    res.json({
      rising: trendingUp,
      falling: trendingDown
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending data' });
  }
});

// Get price comparison across states
router.get('/compare/:commodity', async (req, res) => {
  try {
    const { commodity } = req.params;
    
    const priceData = await MarketData.find({ 
      commodity: new RegExp(commodity, 'i'), 
      isActive: true 
    })
    .select('state district prices unit quality lastUpdated')
    .sort({ 'prices.retail.average': 1 });

    res.json(priceData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price comparison' });
  }
});

// Get market statistics
router.get('/stats', async (req, res) => {
  try {
    const totalCommodities = await MarketData.distinct('commodity').countDocuments();
    const totalStates = await MarketData.distinct('state').countDocuments();
    const totalMarkets = await MarketData.distinct('market').countDocuments();
    
    const categoryStats = await MarketData.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stateStats = await MarketData.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalCommodities,
      totalStates,
      totalMarkets,
      categoryStats,
      topStates: stateStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market statistics' });
  }
});

module.exports = router;