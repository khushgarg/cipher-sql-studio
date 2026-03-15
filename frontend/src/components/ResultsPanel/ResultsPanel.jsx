import React, { useState } from 'react';
import './_results-panel.scss';

const ResultsPanel = ({ results, error, loading }) => {
  const [showExpected, setShowExpected] = useState(false);

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
    <div className={`results-panel ${results.isCorrect ? 'results-panel--correct' : 'results-panel--incorrect'}`}>
      <div className="results-panel__header">
        <h3 className="results-panel__title">Results</h3>
        <div className="results-panel__meta">
          {results.isCorrect ? (
            <span className="results-panel__status results-panel__status--correct">✓ Correct!</span>
          ) : (
            <span className="results-panel__status results-panel__status--incorrect">✗ Incorrect</span>
          )}
          <span className="results-panel__count">
            {results.rowCount} row{results.rowCount !== 1 ? 's' : ''}
          </span>
          {results.executionTime != null && (
            <span className="results-panel__time">{results.executionTime}ms</span>
          )}
        </div>
      </div>

      {/* Correctness feedback banner */}
      {results.isCorrect ? (
        <div className="results-panel__banner results-panel__banner--correct">
          🎉 Great job! Your query produces the correct result.
        </div>
      ) : (
        <div className="results-panel__banner results-panel__banner--incorrect">
          Not quite right. Compare your output with the expected result and try again!
          {results.solutionRows && (
            <button
              className="results-panel__toggle-expected"
              onClick={() => setShowExpected(!showExpected)}
            >
              {showExpected ? 'Hide' : 'View'} Expected Output
            </button>
          )}
        </div>
      )}

      {/* User's result table */}
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
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{cell !== null && cell !== undefined ? String(cell) : <span className="results-panel__null">NULL</span>}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expected output table (toggleable) */}
      {showExpected && results.solutionRows && results.solutionColumns && (
        <div className="results-panel__expected">
          <h4>Expected Output</h4>
          <div className="results-panel__table-wrapper">
            <table className="results-panel__table results-panel__table--expected">
              <thead>
                <tr>
                  {results.solutionColumns.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.solutionRows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell !== null && cell !== undefined ? String(cell) : <span className="results-panel__null">NULL</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
