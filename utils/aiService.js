const axios = require('axios');
const Service = require('../models/Service');

const generateAIResponse = async (message, language = 'en', location = null, context = []) => {
  try {
    // Simple AI response logic (replace with actual AI service)
    const response = await processUserQuery(message, language, location, context);
    
    return {
      content: response.answer,
      suggestions: response.suggestions,
      relatedServices: response.services
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      content: getDefaultResponse(language),
      suggestions: [],
      relatedServices: []
    };
  }
};

const processUserQuery = async (message, language, location, context) => {
  const lowerMessage = message.toLowerCase();
  
  // Detect intent and category
  const intent = detectIntent(lowerMessage);
  const category = detectCategory(lowerMessage);
  
  // Search for relevant services
  let services = [];
  if (category) {
    let query = { category, isActive: true };
    if (location && location.city) {
      query['contact.address.city'] = new RegExp(location.city, 'i');
    }
    services = await Service.find(query).limit(5);
  }
  
  // Generate contextual response
  let answer = generateContextualAnswer(intent, category, services, language);
  
  // Generate suggestions
  const suggestions = generateSuggestions(intent, category, language);
  
  return {
    answer,
    suggestions,
    services: services.slice(0, 3)
  };
};

const detectIntent = (message) => {
  const intents = {
    'help': ['help', 'assist', 'support', 'need'],
    'search': ['find', 'look', 'search', 'where'],
    'info': ['what', 'how', 'when', 'info', 'information'],
    'emergency': ['emergency', 'urgent', 'crisis', '911'],
    'complaint': ['complaint', 'problem', 'issue', 'wrong']
  };
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return intent;
    }
  }
  
  return 'general';
};

const detectCategory = (message) => {
  const categories = {
    'healthcare': ['health', 'medical', 'doctor', 'hospital', 'clinic', 'medicine'],
    'education': ['school', 'education', 'learn', 'class', 'university', 'college'],
    'employment': ['job', 'work', 'employment', 'career', 'unemployment'],
    'housing': ['house', 'home', 'rent', 'housing', 'apartment', 'shelter'],
    'legal': ['legal', 'law', 'lawyer', 'court', 'rights'],
    'transportation': ['transport', 'bus', 'train', 'travel', 'ride'],
    'social-services': ['social', 'welfare', 'benefits', 'assistance'],
    'utilities': ['utility', 'water', 'electric', 'gas', 'internet'],
    'emergency': ['emergency', 'fire', 'police', 'ambulance', '911']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};

const generateContextualAnswer = (intent, category, services, language) => {
  const responses = {
    en: {
      help: "I'm here to help you find public services and information. What do you need assistance with?",
      search: `I found ${services.length} services that might help you.`,
      info: "I can provide information about various public services and resources.",
      emergency: "For immediate emergencies, please call 911. I can also help you find emergency services in your area.",
      general: "Hello! I'm your civic assistant. I can help you find public services, answer questions about government programs, and connect you with community resources."
    },
    es: {
      help: "Estoy aquí para ayudarte a encontrar servicios públicos e información. ¿Con qué necesitas ayuda?",
      search: `Encontré ${services.length} servicios que podrían ayudarte.`,
      info: "Puedo proporcionar información sobre varios servicios públicos y recursos.",
      emergency: "Para emergencias inmediatas, llama al 911. También puedo ayudarte a encontrar servicios de emergencia en tu área.",
      general: "¡Hola! Soy tu asistente cívico. Puedo ayudarte a encontrar servicios públicos, responder preguntas sobre programas gubernamentales y conectarte con recursos comunitarios."
    }
  };
  
  const langResponses = responses[language] || responses.en;
  return langResponses[intent] || langResponses.general;
};

const generateSuggestions = (intent, category, language) => {
  const suggestions = {
    en: [
      "Find healthcare services near me",
      "Apply for unemployment benefits",
      "Search for affordable housing",
      "Get help with utilities",
      "Find legal assistance"
    ],
    es: [
      "Encontrar servicios de salud cerca de mí",
      "Solicitar beneficios de desempleo",
      "Buscar vivienda asequible",
      "Obtener ayuda con servicios públicos",
      "Encontrar asistencia legal"
    ]
  };
  
  return suggestions[language] || suggestions.en;
};

const getDefaultResponse = (language) => {
  const defaults = {
    en: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact support.",
    es: "Lo siento, tengo problemas para procesar tu solicitud en este momento. Inténtalo de nuevo o contacta al soporte."
  };
  
  return defaults[language] || defaults.en;
};

module.exports = {
  generateAIResponse,
  processUserQuery,
  detectIntent,
  detectCategory
};