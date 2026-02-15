const express = require('express');
const router = express.Router();

// Get educational resources
router.get('/education', async (req, res) => {
  try {
    const resources = [
      {
        title: 'How to Apply for Public Benefits',
        description: 'Step-by-step guide to applying for government assistance programs',
        type: 'guide',
        url: '/resources/benefits-guide'
      },
      {
        title: 'Understanding Your Rights',
        description: 'Know your rights when accessing public services',
        type: 'article',
        url: '/resources/rights-guide'
      }
    ];
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

module.exports = router;