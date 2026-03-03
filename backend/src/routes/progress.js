const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getMyProgress, getLeaderboard } = require('../controllers/progressController');

router.get('/me', authMiddleware, getMyProgress);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
