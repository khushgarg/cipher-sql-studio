const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { explainSolution } = require('../controllers/explainController');

router.post('/', authMiddleware, explainSolution);

module.exports = router;
