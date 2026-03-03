const express = require('express');
const router = express.Router();
const { saveAttempt, getUserAttempts } = require('../controllers/attemptController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, saveAttempt);
router.get('/:userId', authMiddleware, getUserAttempts);

module.exports = router;
