const Attempt = require('../models/Attempt');

const saveAttempt = async (req, res) => {
  try {
    const { assignmentId, query, wasSuccessful, errorMessage } = req.body;

    if (!assignmentId || !query) {
      return res.status(400).json({ error: 'assignmentId and query are required' });
    }

    const userId = req.user ? req.user.id : null;

    const attempt = new Attempt({
      userId,
      assignmentId,
      query,
      wasSuccessful: Boolean(wasSuccessful),
      errorMessage: errorMessage || null
    });

    await attempt.save();
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserAttempts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Authorization: users can only access their own attempt history
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied: you can only view your own attempts' });
    }

    const attempts = await Attempt.find({ userId })
      .populate('assignmentId', 'title difficulty')
      .sort({ executedAt: -1 })
      .limit(100); // cap at 100 most recent
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveAttempt, getUserAttempts };
