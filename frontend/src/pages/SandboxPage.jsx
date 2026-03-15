import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getSandboxSchemas, executeSandboxQuery } from '../services/api';
import './_sandbox-page.scss';

const SandboxPage = () => {
    const [schemas, setSchemas] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState('');
    const [expandedTable, setExpandedTable] = useState(null);
    const [query, setQuery] = useState('SELECT * FROM ');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [schemasLoading, setSchemasLoading] = useState(true);

    useEffect(() => {
        const fetchSchemas = async () => {
            try {
                const res = await getSandboxSchemas();
                setSchemas(res.data);
                if (res.data.length > 0) setSelectedSchema(res.data[0].name);
            } catch (err) {
                setError('Failed to load schemas. Make sure PostgreSQL is running.');
            } finally {
                setSchemasLoading(false);
            }
        };
        fetchSchemas();
    }, []);

    const handleRun = async () => {
        if (!query.trim() || !selectedSchema) return;
        try {
            setLoading(true);
            setError(null);
            const res = await executeSandboxQuery(selectedSchema, query);
            setResults(res.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setResults(null);
        } finally {
            setLoading(false);
        }
    };

    const currentSchema = schemas.find(s => s.name === selectedSchema);

    return (
        <div className="sandbox-page">
            {/* Sidebar — Schema Browser */}
            <aside className="sandbox-page__sidebar">
                <div className="sandbox-page__sidebar-header">
                    <h2>📁 Database Explorer</h2>
                </div>

                {schemasLoading ? (
                    <div className="sandbox-page__sidebar-loading">Loading schemas...</div>
                ) : (
                    <>
                        <div className="sandbox-page__schema-select">
                            <label>Schema</label>
                            <select
                                value={selectedSchema}
                                onChange={(e) => setSelectedSchema(e.target.value)}
                            >
                                {schemas.map(s => (
                                    <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sandbox-page__tables">
                            {currentSchema?.tables.map(table => (
                                <div key={table.name} className="sandbox-page__table">
                                    <button
                                        className={`sandbox-page__table-name ${expandedTable === table.name ? 'expanded' : ''}`}
                                        onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                                    >
                                        <span className="sandbox-page__table-icon">
                                            {expandedTable === table.name ? '▾' : '▸'}
                                        </span>
                                        {table.name}
                                        <span className="sandbox-page__col-count">{table.columns.length} cols</span>
                                    </button>
                                    {expandedTable === table.name && (
                                        <ul className="sandbox-page__columns">
                                            {table.columns.map(col => (
                                                <li key={col.name} className="sandbox-page__column">
                                                    <span className="sandbox-page__col-name">{col.name}</span>
                                                    <span className="sandbox-page__col-type">{col.type}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </aside>

            {/* Main Content */}
            <main className="sandbox-page__main">
                <div className="sandbox-page__hero">
                    <h1>SQL Sandbox <span className="sandbox-page__hero-badge">Free Play</span></h1>
                    <p>Write any SELECT query against live database tables. Explore, experiment, learn.</p>
                </div>

                {/* Editor */}
                <div className="sandbox-page__editor">
                    <div className="sandbox-page__editor-header">
                        <span className="sandbox-page__editor-schema">Schema: <strong>{selectedSchema}</strong></span>
                        <div className="sandbox-page__editor-actions">
                            <span className="sandbox-page__shortcut">Ctrl+Enter to run</span>
                            <button
                                className="sandbox-page__run-btn"
                                onClick={handleRun}
                                disabled={loading}
                            >
                                {loading ? '⏳ Running...' : '▶ Run Query'}
                            </button>
                        </div>
                    </div>
                    <Editor
                        height="200px"
                        defaultLanguage="sql"
                        theme="vs-dark"
                        value={query}
                        onChange={(val) => setQuery(val || '')}
                        onMount={(editor, monaco) => {
                            editor.addCommand(
                                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                                () => handleRun()
                            );
                            editor.focus();
                        }}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: 'on',
                        }}
                    />
                </div>

                {/* Results */}
                <div className="sandbox-page__results">
                    {loading && (
                        <div className="sandbox-page__results-loading">
                            <div className="sandbox-page__spinner"></div>
                            <p>Executing query...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="sandbox-page__results-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    {results && !loading && (
                        <>
                            <div className="sandbox-page__results-meta">
                                <span>✓ {results.rowCount} row{results.rowCount !== 1 ? 's' : ''}</span>
                                {results.executionTime != null && (
                                    <span>{results.executionTime}ms</span>
                                )}
                            </div>
                            <div className="sandbox-page__results-table">
                                <table>
                                    <thead>
                                        <tr>
                                            {results.columns.map((col, i) => (
                                                <th key={i}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.rows.map((row, ri) => (
                                            <tr key={ri}>
                                                {row.map((cell, ci) => (
                                                    <td key={ci}>
                                                        {cell !== null && cell !== undefined
                                                            ? String(cell)
                                                            : <span className="sandbox-page__null">NULL</span>}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {!results && !error && !loading && (
                        <div className="sandbox-page__results-empty">
                            <span>⬡</span>
                            <p>Select a schema, write a query, and hit Run to see results here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SandboxPage;
