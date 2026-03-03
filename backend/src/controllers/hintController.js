const openai = require('../config/llm');
const Assignment = require('../models/Assignment');

const HINT_SYSTEM_PROMPTS = {
  1: 'You are a SQL tutor giving a very gentle, conceptual hint. Do NOT show any SQL syntax or reveal the solution approach. Just point the student toward the right concept or table to think about.',
  2: 'You are a SQL tutor giving a structural hint. You may hint at which SQL clause or join type to use, but do NOT write any actual SQL or reveal the full solution.',
  3: 'You are a SQL tutor giving a detailed near-solution hint. Show the skeleton of the SQL structure (e.g., SELECT ? FROM ? WHERE ?) but leave key parts for the student to fill in.',
};

const getHint = async (req, res) => {
  try {
    const { assignmentId, currentQuery, errorMessage, hintLevel = 1 } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const level = Math.min(Math.max(parseInt(hintLevel, 10) || 1, 1), 3);
    const systemPrompt = HINT_SYSTEM_PROMPTS[level];

    const userMsg = `
Problem: ${assignment.title}
Description: ${assignment.description}
Tables: ${assignment.tables.join(', ')}
${currentQuery ? `Student's current query:\n${currentQuery}` : '(student has not written any query yet)'}
${errorMessage ? `Error message: ${errorMessage}` : ''}

Give a level ${level}/3 hint for this problem.
    `.trim();

    const response = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMsg }
      ],
      max_tokens: 200,
      temperature: 0.4,
    });

    const hint = response.choices[0].message.content;
    res.json({ hint, hintLevel: level });
  } catch (error) {
    console.error('LLM Error:', error);
    res.status(500).json({ error: 'Failed to get hint' });
  }
};

module.exports = { getHint };

