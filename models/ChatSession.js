const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    default: 'en'
  }
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [messageSchema],
  category: {
    type: String,
    enum: ['general', 'services', 'resources', 'emergency', 'feedback']
  },
  resolved: {
    type: Boolean,
    default: false
  },
  satisfaction: {
    rating: Number,
    feedback: String
  },
  metadata: {
    userAgent: String,
    location: {
      city: String,
      state: String
    },
    language: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);