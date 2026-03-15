import React from 'react';
import './_solution-panel.scss';

const SolutionPanel = ({ data, error, loading, onExplain, hasQueried }) => {
    return (
        <div className="solution-panel">
            <div className="solution-panel__header">
                <h3 className="solution-panel__title">🤖 AI Solution Guide</h3>
            </div>

            {!data && !error && !loading && (
                <div className="solution-panel__action">
                    <p className="solution-panel__prompt">
                        {hasQueried
                            ? "Stuck? Let AI walk you through the solution step-by-step."
                            : "Try writing your query first, then ask AI for help if needed."}
                    </p>
                    <button
                        className="solution-panel__btn"
                        onClick={onExplain}
                    >
                        Explain Solution
                    </button>
                </div>
            )}

            {loading && (
                <div className="solution-panel__loading">
                    <div className="solution-panel__spinner"></div>
                    <p>AI is analyzing the problem...</p>
                </div>
            )}

            {error && (
                <div className="solution-panel__error">
                    <p>{error}</p>
                    <button className="solution-panel__btn" onClick={onExplain}>
                        Try Again
                    </button>
                </div>
            )}

            {data && !loading && (
                <div className="solution-panel__content">
                    {/* AI Explanation */}
                    <div className="solution-panel__explanation">
                        <h4>Step-by-Step Explanation</h4>
                        <div className="solution-panel__text">
                            {data.explanation.split('\n').map((line, idx) => (
                                <p key={idx}>{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* Solution Query */}
                    {data.solutionQuery && (
                        <div className="solution-panel__solution">
                            <h4>Solution Query</h4>
                            <pre className="solution-panel__code">{data.solutionQuery}</pre>
                        </div>
                    )}

                    {/* Related Concepts */}
                    {data.concepts && data.concepts.length > 0 && (
                        <div className="solution-panel__concepts">
                            <h4>SQL Concepts Used</h4>
                            <div className="solution-panel__tags">
                                {data.concepts.map((concept, idx) => (
                                    <span key={idx} className="solution-panel__tag">{concept}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        className="solution-panel__btn solution-panel__btn--secondary"
                        onClick={onExplain}
                    >
                        Re-Explain with My Latest Query
                    </button>
                </div>
            )}
        </div>
    );
};

export default SolutionPanel;
