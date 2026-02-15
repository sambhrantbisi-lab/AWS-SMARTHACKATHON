const express = require('express');
const ChatSession = require('../models/ChatSession');
const Service = require('../models/Service');
const BharatCivicAI = require('../services/aiService');

const router = express.Router();
const bharatAI = new BharatCivicAI();

// Start new chat session
router.post('/start', async (req, res) => {
  try {
    const { message, language = 'en', location, room = 'general' } = req.body;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Process query with AI
    const aiResult = await bharatAI.processQuery(message, { language, location, room });

    const chatSession = new ChatSession({
      userId: req.userId,
      sessionId,
      messages: [
        {
          role: 'user',
          content: message,
          language,
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: aiResult.response,
          language,
          timestamp: new Date(),
          metadata: {
            intent: aiResult.intent,
            relevantServices: aiResult.relevantServices.map(s => s._id)
          }
        }
      ],
      metadata: {
        userAgent: req.get('User-Agent'),
        location,
        language,
        room,
        intent: aiResult.intent
      }
    });

    await chatSession.save();

    res.json({
      sessionId,
      response: aiResult.response,
      suggestions: aiResult.suggestions,
      relatedServices: aiResult.relevantServices,
      intent: aiResult.intent
    });
  } catch (error) {
    console.error('Chat start error:', error);
    res.status(500).json({ 
      message: 'Error starting chat', 
      error: error.message,
      response: "I apologize, but I'm having trouble right now. Please try again or contact the citizen helpline at 1950.\n\nक्षमा करें, मुझे कुछ समस्या हो रही है। कृपया दोबारा कोशिश करें।"
    });
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

    // Add user message
    chatSession.messages.push({
      role: 'user',
      content: message,
      language,
      timestamp: new Date()
    });

    // Process query with AI (with session context)
    const sessionContext = {
      language,
      room: chatSession.metadata.room,
      previousMessages: chatSession.messages.slice(-6) // Last 6 messages for context
    };
    
    const aiResult = await bharatAI.processQuery(message, sessionContext);

    // Add AI response
    chatSession.messages.push({
      role: 'assistant',
      content: aiResult.response,
      language,
      timestamp: new Date(),
      metadata: {
        intent: aiResult.intent,
        relevantServices: aiResult.relevantServices.map(s => s._id)
      }
    });

    await chatSession.save();

    res.json({
      response: aiResult.response,
      suggestions: aiResult.suggestions,
      relatedServices: aiResult.relevantServices,
      intent: aiResult.intent
    });
  } catch (error) {
    console.error('Chat continue error:', error);
    res.status(500).json({ 
      message: 'Error continuing chat', 
      error: error.message,
      response: "I apologize, but I'm having trouble processing your message. Please try again.\n\nक्षमा करें, आपके संदेश को समझने में समस्या हो रही है।"
    });
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

// Get service details for AI recommendations
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = bharatAI.getServiceById(serviceId);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service details' });
  }
});

// Quick AI query (for testing)
router.post('/quick', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    const aiResult = await bharatAI.processQuery(message, { language });
    
    res.json({
      response: aiResult.response,
      suggestions: aiResult.suggestions,
      relatedServices: aiResult.relevantServices,
      intent: aiResult.intent
    });
  } catch (error) {
    console.error('Quick query error:', error);
    res.status(500).json({ 
      message: 'Error processing query',
      response: "I apologize, but I'm having trouble right now. Please try again.\n\nक्षमा करें, मुझे कुछ समस्या हो रही है।"
    });
  }
});

module.exports = router;