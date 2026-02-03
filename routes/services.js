const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// Get all services with filtering
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

    let query = { isActive: true };

    if (category) query.category = category;
    if (city) query['contact.address.city'] = new RegExp(city, 'i');
    if (state) query['contact.address.state'] = new RegExp(state, 'i');
    if (language) query.languages = language;

    if (accessibility) {
      const accessibilityFeatures = accessibility.split(',');
      accessibilityFeatures.forEach(feature => {
        query[`accessibility.${feature}`] = true;
      });
    }

    if (search) {
      query.$text = { $search: search };
    }

    const services = await Service.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    res.json({
      services,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
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

    let query = { category, isActive: true };
    if (city) query['contact.address.city'] = new RegExp(city, 'i');
    if (state) query['contact.address.state'] = new RegExp(state, 'i');

    const services = await Service.find(query).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services by category' });
  }
});

// Search services with AI-powered suggestions
router.post('/search', async (req, res) => {
  try {
    const { query, location, userNeeds } = req.body;

    // Text search
    let searchQuery = { isActive: true };
    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (location) {
      if (location.city) searchQuery['contact.address.city'] = new RegExp(location.city, 'i');
      if (location.state) searchQuery['contact.address.state'] = new RegExp(location.state, 'i');
    }

    const services = await Service.find(searchQuery)
      .sort(query ? { score: { $meta: 'textScore' } } : { name: 1 });

    // AI-powered categorization and suggestions
    const categorizedResults = {
      exact: [],
      related: [],
      suggested: []
    };

    services.forEach(service => {
      if (query && service.name.toLowerCase().includes(query.toLowerCase())) {
        categorizedResults.exact.push(service);
      } else if (query && service.description.toLowerCase().includes(query.toLowerCase())) {
        categorizedResults.related.push(service);
      } else {
        categorizedResults.suggested.push(service);
      }
    });

    res.json({
      results: categorizedResults,
      total: services.length,
      suggestions: generateSearchSuggestions(query, services)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching services' });
  }
});

function generateSearchSuggestions(query, services) {
  const categories = [...new Set(services.map(s => s.category))];
  const tags = [...new Set(services.flatMap(s => s.tags))];
  
  return {
    categories: categories.slice(0, 5),
    relatedTerms: tags.slice(0, 10)
  };
}

module.exports = router;