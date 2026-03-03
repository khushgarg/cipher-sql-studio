function buildHintPrompt(assignment, currentQuery, errorMessage) {
  const tablesInfo = assignment.tables.map(table => {
    return `- ${table}`;
  }).join('\n');

  const systemPrompt = `You are a SQL tutor helping a student learn SQL.
The student is working on this assignment:

ASSIGNMENT: "${assignment.title}"
DESCRIPTION: "${assignment.description}"

AVAILABLE TABLES:
${tablesInfo}

STUDENT'S CURRENT QUERY:
${currentQuery || '(no query yet)'}

STUDENT'S ERROR (if any): ${errorMessage || 'none'}

Your task: Provide a HINT that guides the student toward the correct answer.
STRICT RULES:
- Do NOT write any SQL code whatsoever
- Do NOT reveal the answer or solution
- Ask a guiding question or point to the relevant SQL concept
- Mention which clause or keyword might help
- Keep response to 2-3 sentences maximum`;

  return systemPrompt;
}

module.exports = { buildHintPrompt };
