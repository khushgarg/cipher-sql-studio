const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  query: { type: String, required: true },
  executedAt: { type: Date, default: Date.now },
  wasSuccessful: { type: Boolean, default: false },
  errorMessage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
