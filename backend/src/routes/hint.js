const express = require('express');
const router = express.Router();
const { getHint } = require('../controllers/hintController');
const rateLimit = require('express-rate-limit');

const hintLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many hint requests, please try again later' }
});

router.post('/', hintLimiter, getHint);

module.exports = router;
