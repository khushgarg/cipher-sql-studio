import React from 'react';
import './_results-panel.scss';

const ResultsPanel = ({ results, error, loading }) => {
  if (loading) {
    return (
      <div className="results-panel">
        <div className="results-panel__header">
          <h3 className="results-panel__title">Results</h3>
        </div>
        <div className="results-panel__loading">
          <div className="results-panel__spinner"></div>
          <p>Executing query...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-panel">
        <div className="results-panel__header">
          <h3 className="results-panel__title">Results</h3>
          <span className="results-panel__status results-panel__status--error">✗ Error</span>
        </div>
        <div className="results-panel__error">
          <p className="results-panel__error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-panel">
        <div className="results-panel__header">
          <h3 className="results-panel__title">Results</h3>
        </div>
        <div className="results-panel__empty">
          <span className="results-panel__empty-icon">⬡</span>
          <p>Run a query to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel results-panel--success">
      <div className="results-panel__header">
        <h3 className="results-panel__title">Results</h3>
        <div className="results-panel__meta">
          <span className="results-panel__status results-panel__status--success">✓ Success</span>
          <span className="results-panel__count">
            {results.rowCount} row{results.rowCount !== 1 ? 's' : ''}
          </span>
          {results.executionTime != null && (
            <span className="results-panel__time">{results.executionTime}ms</span>
          )}
        </div>
      </div>
      <div className="results-panel__table-wrapper">
        <table className="results-panel__table">
          <thead>
            <tr>
              {results.columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {/* row is an array (already extracted by server) */}
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{cell !== null && cell !== undefined ? String(cell) : <span className="results-panel__null">NULL</span>}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsPanel;
