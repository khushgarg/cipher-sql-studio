const openai = require('../config/llm');
const Assignment = require('../models/Assignment');

/**
 * POST /api/explain
 * Body: { assignmentId, userQuery }
 * Returns: { explanation, solutionQuery, concepts }
 */
const explainSolution = async (req, res) => {
    try {
        const { assignmentId, userQuery } = req.body;

        if (!assignmentId) {
            return res.status(400).json({ error: 'assignmentId is required' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        const prompt = `
You are a SQL tutor. A student is working on this problem:

**Problem:** ${assignment.title}
**Description:** ${assignment.description}
**Tables:** ${assignment.tables.join(', ')}
**Correct Solution:** ${assignment.solutionQuery || '(not yet set)'}

**Student's Query:** ${userQuery || '(student has not written anything yet)'}

Please provide:
1. A clear, step-by-step explanation of how to solve this problem
2. What SQL concepts are required
3. If the student wrote a query, what is wrong with it (if anything)
4. The key insight they might be missing

Keep your response concise, encouraging, and educational. Use markdown formatting.
    `.trim();

        const response = await openai.chat.completions.create({
            model: process.env.LLM_MODEL || 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful, encouraging SQL tutor. Be concise and pedagogical.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 600,
            temperature: 0.5,
        });

        const explanation = response.choices[0].message.content;

        res.json({
            explanation,
            solutionQuery: assignment.solutionQuery || null,
            concepts: assignment.tags || [],
        });
    } catch (err) {
        console.error('explainSolution error:', err);
        res.status(500).json({ error: 'Failed to get explanation' });
    }
};

module.exports = { explainSolution };
