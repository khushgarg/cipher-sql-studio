const pool = require('../config/postgres');
const Assignment = require('../models/Assignment');
const Attempt = require('../models/Attempt');

const SAFE_SCHEMA_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * Normalize a result set for order-insensitive comparison.
 * Returns a sorted JSON string.
 */
const normalizeResult = (rows) => {
  if (!Array.isArray(rows)) return '';
  const sorted = [...rows].map(r =>
    // Normalize each row's values to strings for comparison
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? '').toLowerCase().trim()]))
  );
  sorted.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return JSON.stringify(sorted);
};

const executeQuery = async (req, res) => {
  const client = await pool.connect();
  const startTime = Date.now();
  try {
    const { assignmentId, hintsUsed = 0 } = req.body;
    const sanitizedQuery = req.sanitizedQuery;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (!SAFE_SCHEMA_RE.test(assignment.postgresSchema)) {
      return res.status(500).json({ error: 'Invalid schema configuration' });
    }

    await client.query(`SET search_path TO ${assignment.postgresSchema}`);
    await client.query('SET statement_timeout = 5000');

    // Run the user's query
    const result = await client.query(sanitizedQuery);
    const executionTime = Date.now() - startTime;

    const columns = result.fields.map(f => f.name);
    const rows = result.rows.map(row => columns.map(col => row[col]));

    // ─── Solution checking ──────────────────────────────────────────────────
    let isCorrect = false;
    let solutionRows = null;
    let solutionCols = null;

    if (assignment.solutionQuery) {
      try {
        const solResult = await client.query(assignment.solutionQuery);
        solutionCols = solResult.fields.map(f => f.name);
        solutionRows = solResult.rows.map(row => solutionCols.map(col => row[col]));

        // Compare normalized result sets
        const userNorm = normalizeResult(result.rows);
        const solNorm = normalizeResult(solResult.rows);
        isCorrect = userNorm === solNorm;
      } catch {
        // Solution query failed — don't penalise the user
      }
    }

    // ─── Save attempt ────────────────────────────────────────────────────────
    if (req.user) {
      try {
        await new Attempt({
          userId: req.user.id,
          assignmentId,
          query: sanitizedQuery,
          wasSuccessful: true,
          isCorrect,
          timeTaken: executionTime,
          hintsUsed: Number(hintsUsed) || 0,
        }).save();
      } catch { /* non-blocking */ }
    }

    res.json({
      columns,
      rows,
      rowCount: result.rowCount,
      executionTime,
      isCorrect,
      solutionColumns: solutionCols,
      solutionRows,
    });
  } catch (error) {
    // Save failed attempt
    if (req.user && req.body.assignmentId) {
      try {
        await new Attempt({
          userId: req.user.id,
          assignmentId: req.body.assignmentId,
          query: req.sanitizedQuery || req.body.query || '',
          wasSuccessful: false,
          isCorrect: false,
          timeTaken: Date.now() - startTime,
          errorMessage: error.message,
        }).save();
      } catch { /* non-blocking */ }
    }

    if (error.code === '57014') {
      return res.status(400).json({ error: 'Query timed out (max 5 seconds)' });
    }
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { executeQuery };
