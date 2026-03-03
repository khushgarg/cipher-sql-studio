const { sanitizeQuery } = require('../utils/sqlSanitizer');

const queryValidator = (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    req.sanitizedQuery = sanitizeQuery(query);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = queryValidator;
