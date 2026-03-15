const pool = require('../config/postgres');
const { sanitizeQuery } = require('../utils/sqlSanitizer');

/**
 * GET /api/sandbox/schemas
 * Returns all available schemas, their tables, and column metadata.
 */
const getSchemas = async (req, res) => {
    const client = await pool.connect();
    try {
        // Fetch all non-system schemas
        const schemaResult = await client.query(`
      SELECT schema_name FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'public')
      ORDER BY schema_name
    `);

        const schemas = [];
        for (const row of schemaResult.rows) {
            const schemaName = row.schema_name;

            // Fetch tables for this schema
            const tablesResult = await client.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = $1 AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `, [schemaName]);

            const tables = [];
            for (const tRow of tablesResult.rows) {
                // Fetch columns for each table
                const colResult = await client.query(`
          SELECT column_name, data_type FROM information_schema.columns 
          WHERE table_schema = $1 AND table_name = $2
          ORDER BY ordinal_position
        `, [schemaName, tRow.table_name]);

                tables.push({
                    name: tRow.table_name,
                    columns: colResult.rows.map(c => ({
                        name: c.column_name,
                        type: c.data_type
                    }))
                });
            }

            schemas.push({ name: schemaName, tables });
        }

        res.json(schemas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

/**
 * POST /api/sandbox/execute
 * Execute a free-form SELECT query in a chosen schema.
 */
const executeSandbox = async (req, res) => {
    const { schema, query } = req.body;

    if (!schema || !query) {
        return res.status(400).json({ error: 'Schema and query are required' });
    }

    // Validate schema name
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) {
        return res.status(400).json({ error: 'Invalid schema name' });
    }

    let sanitized;
    try {
        sanitized = sanitizeQuery(query);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }

    const client = await pool.connect();
    const startTime = Date.now();
    try {
        await client.query(`SET search_path TO ${schema}`);
        await client.query('SET statement_timeout = 5000');

        const result = await client.query(sanitized);
        const executionTime = Date.now() - startTime;

        const columns = result.fields.map(f => f.name);
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

module.exports = { getSchemas, executeSandbox };
