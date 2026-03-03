const openai = require('../config/llm');
const Assignment = require('../models/Assignment');
const { buildHintPrompt } = require('../utils/promptBuilder');

const getHint = async (req, res) => {
  try {
    const { assignmentId, currentQuery, errorMessage } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const prompt = buildHintPrompt(assignment, currentQuery, errorMessage);

    const response = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Give me a hint for this assignment.' }
      ],
      max_tokens: 150,
    });

    const hint = response.choices[0].message.content;
    res.json({ hint });
  } catch (error) {
    console.error('LLM Error:', error);
    res.status(500).json({ error: 'Failed to get hint' });
  }
};

module.exports = { getHint };
