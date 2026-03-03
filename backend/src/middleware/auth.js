const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token') || (req.header('Authorization') || '').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // Fetch fresh user data so role is always up-to-date
    const user = await User.findById(decoded.user.id).select('_id username email role');
    if (!user) return res.status(401).json({ msg: 'User not found' });
    req.user = { id: user._id.toString(), username: user.username, email: user.email, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
