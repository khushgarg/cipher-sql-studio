const express = require('express');
const router = express.Router();
const { executeQuery } = require('../controllers/executeController');
const queryValidator = require('../middleware/queryValidator');

router.post('/', queryValidator, executeQuery);

module.exports = router;
