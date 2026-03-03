const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  postgresSchema: { type: String, required: true },
  tables: [{ type: String }],
  expectedColumns: [{ type: String }],
  hints: [{ type: String }],
  solutionQuery: { type: String, default: '' },
  tags: [{ type: String }],
  explanation: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);

