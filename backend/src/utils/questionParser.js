/**
 * questionParser.js
 * Uses OpenAI to parse raw document text into a structured Assignment object.
 */

const openai = require('../config/llm');

/**
 * Build the LLM prompt that converts raw text → Assignment JSON.
 */
const buildParserPrompt = (rawText) => `
You are a SQL question parser. Given the raw text of a SQL practice problem document,
extract and output a valid JSON object with EXACTLY these fields:

{
  "title": "short descriptive title",
  "description": "full problem description for the student",
  "difficulty": "easy" | "medium" | "hard",
  "postgresSchema": "all CREATE TABLE and INSERT SQL statements needed to set up the schema, separated by semicolons",
  "tables": ["table1", "table2"],
  "hints": ["hint1 (no solution)", "hint2 (a bit more specific)", "hint3 (near answer)"],
  "solutionQuery": "the correct SQL SELECT query",
  "tags": ["JOIN", "GROUP BY", "Subquery", ...relevant SQL topics],
  "explanation": "step-by-step explanation of how to arrive at the solution"
}

Rules:
1. Output ONLY valid JSON, no markdown, no explanation outside the JSON.
2. postgresSchema should be complete DDL + sample data INSERT statements.
3. The solutionQuery must work with the provided schema.
4. hints must NOT reveal the solution directly.
5. difficulty: easy = simple SELECT/WHERE, medium = JOINs/aggregates, hard = subqueries/CTEs/window functions.

Raw document text:
---
${rawText.slice(0, 6000)}
---
`.trim();

/**
 * Parse raw document text using GPT and return a structured assignment object.
 * @param {string} rawText
 * @returns {Promise<object>} Assignment fields
 */
const parseQuestionWithLLM = async (rawText) => {
    const response = await openai.chat.completions.create({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a precise SQL question extractor. Always output valid JSON only.' },
            { role: 'user', content: buildParserPrompt(rawText) }
        ],
        max_tokens: 2000,
        temperature: 0.2,
    });

    const content = response.choices[0].message.content.trim();

    // Strip any accidental markdown code fences
    const cleaned = content.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '');

    const parsed = JSON.parse(cleaned);

    // Validate required fields
    const required = ['title', 'description', 'difficulty', 'postgresSchema', 'solutionQuery'];
    for (const field of required) {
        if (!parsed[field]) throw new Error(`LLM response missing required field: ${field}`);
    }

    return {
        title: parsed.title,
        description: parsed.description,
        difficulty: parsed.difficulty,
        postgresSchema: parsed.postgresSchema,
        tables: parsed.tables || [],
        hints: parsed.hints || [],
        solutionQuery: parsed.solutionQuery,
        tags: parsed.tags || [],
        explanation: parsed.explanation || '',
        expectedColumns: [],
    };
};

module.exports = { parseQuestionWithLLM };
