const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['service', 'market', 'commodity', 'ai', 'admin', 'general']
  },
  tags: [{
    type: String
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  comments: [{
    author: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    upvotes: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    default: 'Digital India Portal'
  },
  externalUrl: String,
  imageUrl: String
}, {
  timestamps: true
});

newsSchema.index({ category: 1, createdAt: -1 });
newsSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('News', newsSchema);