const express = require('express');
const router = express.Router();
const { executeQuery } = require('../controllers/executeController');
const queryValidator = require('../middleware/queryValidator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional auth: attach req.user if token exists, but don't block if missing
const optionalAuth = async (req, res, next) => {
    const token = req.header('x-auth-token') || (req.header('Authorization') || '').replace('Bearer ', '');
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            const user = await User.findById(decoded.user.id).select('_id username role');
            if (user) req.user = { id: user._id.toString(), username: user.username, role: user.role };
        } catch { /* ignore invalid tokens */ }
    }
    next();
};

router.post('/', optionalAuth, queryValidator, executeQuery);

module.exports = router;

