// List of SQL keywords/statements that are not allowed (read-only enforcement)
const FORBIDDEN_PATTERN = /\b(DROP|DELETE|TRUNCATE|ALTER|CREATE|INSERT|UPDATE|GRANT|REVOKE|EXECUTE|EXEC|COPY|DO|CALL|COMMENT|VACUUM|ANALYZE|CLUSTER|LOCK|NOTIFY|LISTEN|UNLISTEN|LOAD|IMPORT)\b/i;

// Maximum rows to return if no LIMIT specified
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 2000;

function sanitizeQuery(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery.toUpperCase().startsWith('SELECT')) {
    throw new Error('Only SELECT queries are allowed. Your query must start with SELECT.');
  }

  if (FORBIDDEN_PATTERN.test(trimmedQuery)) {
    throw new Error('Query contains a forbidden keyword. Only read-only SELECT queries are permitted.');
  }

  // Check for write-CTEs: WITH ... (INSERT|UPDATE|DELETE|...)
  if (/\bWITH\b/i.test(trimmedQuery) && FORBIDDEN_PATTERN.test(trimmedQuery)) {
    throw new Error('Write CTEs are not allowed.');
  }

  // Enforce LIMIT cap — if user provided a LIMIT > MAX_LIMIT, reject
  const limitMatch = trimmedQuery.match(/\bLIMIT\s+(\d+)/i);
  if (limitMatch) {
    const userLimit = parseInt(limitMatch[1], 10);
    if (userLimit > MAX_LIMIT) {
      throw new Error(`LIMIT cannot exceed ${MAX_LIMIT} rows.`);
    }
    return trimmedQuery;
  }

  // Auto-append LIMIT if missing
  return trimmedQuery + ` LIMIT ${DEFAULT_LIMIT}`;
}

module.exports = { sanitizeQuery };
