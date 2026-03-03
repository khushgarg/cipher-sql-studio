import React from 'react';
import './_hint-panel.scss';

const HintPanel = ({ hint, error, loading, hintCount, onGetHint }) => {
  return (
    <div className="hint-panel">
      <div className="hint-panel__header">
        <h3 className="hint-panel__title">Hint</h3>
        <span className="hint-panel__count">{hintCount}/3 hints used</span>
      </div>
      
      {!hint && !error && !loading && (
        <div className="hint-panel__action">
          <button 
            className="hint-panel__btn"
            onClick={onGetHint}
            disabled={hintCount >= 3}
          >
            Get Hint
          </button>
        </div>
      )}

      {loading && (
        <div className="hint-panel__loading">
          <div className="hint-panel__spinner"></div>
          <p>Getting hint...</p>
        </div>
      )}

      {error && (
        <div className="hint-panel__error">
          <p>{error}</p>
          {hintCount < 3 && (
            <button className="hint-panel__btn" onClick={onGetHint}>
              Try Again
            </button>
          )}
        </div>
      )}

      {hint && !loading && (
        <div className="hint-panel__content">
          <p className="hint-panel__text">{hint}</p>
          {hintCount < 3 && (
            <button className="hint-panel__btn hint-panel__btn--secondary" onClick={onGetHint}>
              Get Another Hint
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HintPanel;
