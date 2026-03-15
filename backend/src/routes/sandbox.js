const express = require('express');
const router = express.Router();
const { getSchemas, executeSandbox } = require('../controllers/sandboxController');

router.get('/schemas', getSchemas);
router.post('/execute', executeSandbox);

module.exports = router;
