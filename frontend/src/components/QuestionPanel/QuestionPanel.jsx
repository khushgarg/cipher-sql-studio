import React from 'react';
import DifficultyBadge from '../DifficultyBadge/DifficultyBadge';
import './_question-panel.scss';

const QuestionPanel = ({ assignment }) => {
  if (!assignment) return null;

  return (
    <div className="question-panel">
      <div className="question-panel__header">
        <h2 className="question-panel__title">{assignment.title}</h2>
        <DifficultyBadge difficulty={assignment.difficulty} />
      </div>
      <p className="question-panel__description">{assignment.description}</p>

      {assignment.tables && assignment.tables.length > 0 && (
        <div className="question-panel__schema">
          <h4 className="question-panel__schema-title">
            <span className="question-panel__schema-icon">⬡</span>
            Available Tables
          </h4>
          <div className="question-panel__tables">
            {assignment.tables.map((table) => (
              <span key={table} className="question-panel__table-tag">
                {table}
              </span>
            ))}
          </div>
        </div>
      )}

      {assignment.expectedColumns && assignment.expectedColumns.length > 0 && (
        <div className="question-panel__expected">
          <h4 className="question-panel__schema-title">
            <span className="question-panel__schema-icon">✓</span>
            Expected Columns
          </h4>
          <div className="question-panel__tables">
            {assignment.expectedColumns.map((col) => (
              <span key={col} className="question-panel__col-tag">
                {col}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
