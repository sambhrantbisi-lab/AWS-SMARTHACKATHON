const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin' && user.role !== 'service_admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error in admin authentication' });
  }
};

module.exports = adminAuth;