const express = require('express');
const Discussion = require('../models/Discussion');
const auth = require('../middleware/auth');

const router = express.Router();

// Get discussions by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const discussions = await Discussion.find({ 
      category: category,
      isActive: true 
    })
    .populate('author', 'name')
    .sort({ isPinned: -1, lastActivity: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Discussion.countDocuments({ 
      category: category,
      isActive: true 
    });

    res.json({
      discussions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions', error: error.message });
  }
});

// Get all discussions
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

    const discussions = await Discussion.find(query)
      .populate('author', 'name')
      .sort({ isPinned: -1, lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Discussion.countDocuments(query);

    res.json({
      discussions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions' });
  }
});

// Get single discussion
router.get('/thread/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name')
      .populate('replies.author', 'name');
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Increment views
    discussion.views += 1;
    await discussion.save();

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussion' });
  }
});

// Create new discussion
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const discussion = new Discussion({
      title,
      content,
      author: req.userId,
      authorName: req.user.name,
      category,
      tags: tags || [],
      lastActivity: new Date()
    });

    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating discussion', error: error.message });
  }
});

// Add reply to discussion
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.replies.push({
      author: req.userId,
      authorName: req.user.name,
      content: content,
      createdAt: new Date()
    });

    discussion.lastActivity = new Date();
    await discussion.save();
    
    res.json({ message: 'Reply added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply' });
  }
});

// Upvote discussion
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.upvotes += 1;
    discussion.lastActivity = new Date();
    await discussion.save();
    
    res.json({ upvotes: discussion.upvotes });
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting discussion' });
  }
});

// Upvote reply
router.post('/:id/reply/:replyId/upvote', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const reply = discussion.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    reply.upvotes += 1;
    await discussion.save();
    
    res.json({ upvotes: reply.upvotes });
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting reply' });
  }
});

module.exports = router;