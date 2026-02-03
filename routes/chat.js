const express = require('express');
const ChatSession = require('../models/ChatSession');
const Service = require('../models/Service');
const { generateAIResponse } = require('../utils/aiService');

const router = express.Router();

// Start new chat session
router.post('/start', async (req, res) => {
  try {
    const { message, language = 'en', location } = req.body;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const chatSession = new ChatSession({
      userId: req.userId,
      sessionId,
      messages: [{
        role: 'user',
        content: message,
        language
      }],
      metadata: {
        userAgent: req.get('User-Agent'),
        location,
        language
      }
    });

    // Generate AI response
    const aiResponse = await generateAIResponse(message, language, location);
    
    chatSession.messages.push({
      role: 'assistant',
      content: aiResponse.content,
      language
    });

    await chatSession.save();

    res.json({
      sessionId,
      response: aiResponse.content,
      suggestions: aiResponse.suggestions,
      relatedServices: aiResponse.relatedServices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error starting chat', error: error.message });
  }
});

// Continue chat session
router.post('/continue/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, language = 'en' } = req.body;

    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    chatSession.messages.push({
      role: 'user',
      content: message,
      language
    });

    // Generate AI response with context
    const context = chatSession.messages.slice(-5); // Last 5 messages for context
    const aiResponse = await generateAIResponse(message, language, null, context);

    chatSession.messages.push({
      role: 'assistant',
      content: aiResponse.content,
      language
    });

    await chatSession.save();

    res.json({
      response: aiResponse.content,
      suggestions: aiResponse.suggestions,
      relatedServices: aiResponse.relatedServices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error continuing chat', error: error.message });
  }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chatSession = await ChatSession.findOne({ sessionId });
    
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.json(chatSession);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

module.exports = router;