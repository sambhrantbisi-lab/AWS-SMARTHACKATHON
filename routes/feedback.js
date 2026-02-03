const express = require('express');
const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { rating, feedback, category } = req.body;
    
    // In a real app, save to database
    console.log('Feedback received:', { rating, feedback, category });
    
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

module.exports = router;