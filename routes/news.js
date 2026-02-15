const express = require('express');
const News = require('../models/News');
const auth = require('../middleware/auth');

const router = express.Router();

// Get news by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const news = await News.find({ 
      category: category,
      isActive: true 
    })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await News.countDocuments({ 
      category: category,
      isActive: true 
    });

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// Get all news
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const news = await News.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

// Get single news item
router.get('/item/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news item' });
  }
});

// Add comment to news
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.comments.push({
      author: req.user.name,
      content: content,
      createdAt: new Date()
    });

    await news.save();
    res.json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Upvote news
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.upvotes += 1;
    await news.save();
    
    res.json({ upvotes: news.upvotes });
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting news' });
  }
});

module.exports = router;