const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
  commodity: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'oils', 'dairy', 'meat', 'other']
  },
  state: {
    type: String,
    required: true
  },
  district: String,
  market: String,
  prices: {
    wholesale: {
      min: Number,
      max: Number,
      average: Number
    },
    retail: {
      min: Number,
      max: Number,
      average: Number
    }
  },
  unit: {
    type: String,
    default: 'per kg',
    enum: ['per kg', 'per quintal', 'per ton', 'per piece', 'per dozen', 'per liter']
  },
  quality: {
    type: String,
    enum: ['premium', 'good', 'average', 'below_average']
  },
  trend: {
    type: String,
    enum: ['rising', 'falling', 'stable'],
    default: 'stable'
  },
  changePercent: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'Government Market Committee'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

marketDataSchema.index({ commodity: 1, state: 1, lastUpdated: -1 });
marketDataSchema.index({ category: 1, state: 1 });

module.exports = mongoose.model('MarketData', marketDataSchema);