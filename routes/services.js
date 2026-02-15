const express = require('express');
const Service = require('../models/Service');
const BharatCivicAI = require('../services/aiService');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
const bharatAI = new BharatCivicAI();

// Get available languages
router.get('/languages', async (req, res) => {
  try {
    const languages = bharatAI.getAvailableLanguages();
    res.json({ languages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching languages' });
  }
});

// Get all services with filtering (now uses Bharat data)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      city, 
      state, 
      language, 
      accessibility,
      page = 1, 
      limit = 20 
    } = req.query;

    // Use AI service to search Bharat services
    const services = bharatAI.searchServices(search, category, limit);
    
    // Apply additional filters
    let filteredServices = services;
    
    if (city) {
      filteredServices = filteredServices.filter(service => 
        service.contact.address.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (state) {
      filteredServices = filteredServices.filter(service => 
        service.contact.address.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    
    if (language) {
      filteredServices = filteredServices.filter(service => 
        service.languages.includes(language)
      );
    }
    
    if (accessibility) {
      const accessibilityFeatures = accessibility.split(',');
      filteredServices = filteredServices.filter(service => {
        return accessibilityFeatures.every(feature => 
          service.accessibility && service.accessibility[feature]
        );
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedServices = filteredServices.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      services: paginatedServices,
      totalPages: Math.ceil(filteredServices.length / limit),
      currentPage: parseInt(page),
      total: filteredServices.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get service by ID (from Bharat data)
router.get('/:id', async (req, res) => {
  try {
    const service = bharatAI.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service' });
  }
});

// Get services by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { city, state } = req.query;

    let services = bharatAI.searchServices('', category, 50);
    
    // Apply location filters
    if (city) {
      services = services.filter(service => 
        service.contact.address.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (state) {
      services = services.filter(service => 
        service.contact.address.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services by category' });
  }
});

// AI-powered search with intelligent matching
router.post('/search', async (req, res) => {
  try {
    const { query, location, userNeeds, language = 'en' } = req.body;

    // Use AI to process the search query
    const aiResult = await bharatAI.processQuery(query, { language, location });
    
    // Get additional services based on intent
    const additionalServices = bharatAI.searchServices('', aiResult.intent, 10);
    
    // Combine and categorize results
    const allServices = [...aiResult.relevantServices, ...additionalServices];
    const uniqueServices = allServices.filter((service, index, self) => 
      index === self.findIndex(s => s._id === service._id)
    );

    const categorizedResults = {
      exact: aiResult.relevantServices,
      related: additionalServices.slice(0, 5),
      aiSuggestion: aiResult.response,
      intent: aiResult.intent
    };

    res.json({
      results: categorizedResults,
      total: uniqueServices.length,
      suggestions: aiResult.suggestions,
      aiResponse: aiResult.response
    });
  } catch (error) {
    console.error('Error in AI search:', error);
    res.status(500).json({ message: 'Error searching services' });
  }
});

// Get available languages
router.get('/languages', async (req, res) => {
  try {
    const languages = bharatAI.getAvailableLanguages();
    res.json({ languages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching languages' });
  }
});

// Get service categories with counts
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = bharatAI.getServiceCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// ADMIN ROUTES - Create new service
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

// ADMIN ROUTES - Update service
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// ADMIN ROUTES - Delete service
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

module.exports = router;