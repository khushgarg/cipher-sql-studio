const pool = require('../config/postgres');
const Assignment = require('../models/Assignment');

// Only allow simple alphanumeric + underscore schema names to prevent SQL injection
const SAFE_SCHEMA_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const executeQuery = async (req, res) => {
  const client = await pool.connect();
  const startTime = Date.now();
  try {
    const { assignmentId } = req.body;
    const sanitizedQuery = req.sanitizedQuery;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Security: validate schema name against allowlist pattern to prevent SQL injection
    if (!SAFE_SCHEMA_RE.test(assignment.postgresSchema)) {
      return res.status(500).json({ error: 'Invalid schema configuration' });
    }

    // Use SET search_path TO with a validated identifier (not user-supplied)
    await client.query(`SET search_path TO ${assignment.postgresSchema}`);
    await client.query('SET statement_timeout = 5000');

    const result = await client.query(sanitizedQuery);
    const executionTime = Date.now() - startTime;

    // pg returns rows as objects { col: value } — extract columns from fields
    const columns = result.fields.map(field => field.name);
    const rows = result.rows.map(row => columns.map(col => row[col]));

    res.json({
      columns,
      rows,
      rowCount: result.rowCount,
      executionTime
    });
  } catch (error) {
    if (error.code === '57014') {
      return res.status(400).json({ error: 'Query timed out (max 5 seconds)' });
    }
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { executeQuery };
