const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  query: { type: String, required: true },
  executedAt: { type: Date, default: Date.now },
  wasSuccessful: { type: Boolean, default: false },
  isCorrect: { type: Boolean, default: false },
  timeTaken: { type: Number, default: 0 },   // milliseconds
  hintsUsed: { type: Number, default: 0 },
  errorMessage: { type: String },
}, { timestamps: true });

// Indexes to speed up progressController and leaderboard aggregations
attemptSchema.index({ userId: 1, isCorrect: 1 });
attemptSchema.index({ userId: 1, assignmentId: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
