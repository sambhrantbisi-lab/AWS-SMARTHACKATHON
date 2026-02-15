const express = require('express');
const Service = require('../models/Service');
const User = require('../models/User');
const MarketData = require('../models/MarketData');
const ServiceFeedback = require('../models/ServiceFeedback');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Admin Dashboard Stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalFeedback = await ServiceFeedback.countDocuments();
    const pendingFeedback = await ServiceFeedback.countDocuments({ status: 'open' });
    
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const serviceStats = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentUsers = await User.find()
      .select('name email role createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        totalServices,
        totalFeedback,
        pendingFeedback
      },
      userStats,
      serviceStats,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Manage Users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update User Role
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role, permissions } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, permissions },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Create Service
router.post('/services', auth, adminAuth, async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.userId,
      lastUpdatedBy: req.userId
    };

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

// Update Service
router.put('/services/:id', auth, adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdatedBy: req.userId },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service' });
  }
});

// Delete Service
router.delete('/services/:id', auth, adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service' });
  }
});

// Manage Feedback
router.get('/feedback', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type, priority } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const feedback = await ServiceFeedback.find(query)
      .populate('serviceId', 'name category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ServiceFeedback.countDocuments(query);

    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Update Feedback Status
router.put('/feedback/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status, response } = req.body;
    
    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.userId;
    }

    if (response) {
      updateData.$push = {
        responses: {
          userId: req.userId,
          message: response,
          isOfficial: true
        }
      };
    }

    const feedback = await ServiceFeedback.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('serviceId userId');

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback' });
  }
});

// Update Market Data
router.post('/market-data', auth, adminAuth, async (req, res) => {
  try {
    const marketData = new MarketData(req.body);
    await marketData.save();
    res.status(201).json(marketData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating market data' });
  }
});

router.put('/market-data/:id', auth, adminAuth, async (req, res) => {
  try {
    const marketData = await MarketData.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ message: 'Error updating market data' });
  }
});

module.exports = router;