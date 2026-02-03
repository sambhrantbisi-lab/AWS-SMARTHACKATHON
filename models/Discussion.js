const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
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
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      authorName: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      upvotes: {
        type: Number,
        default: 0
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

discussionSchema.index({ category: 1, lastActivity: -1 });
discussionSchema.index({ title: 'text', content: 'text' });
discussionSchema.index({ isPinned: -1, lastActivity: -1 });

module.exports = mongoose.model('Discussion', discussionSchema);