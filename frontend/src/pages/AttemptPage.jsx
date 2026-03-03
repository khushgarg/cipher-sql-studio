import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssignmentById } from '../services/api';
import useQueryExecution from '../hooks/useQueryExecution';
import useHint from '../hooks/useHint';
import QuestionPanel from '../components/QuestionPanel/QuestionPanel';
import SampleDataViewer from '../components/SampleDataViewer/SampleDataViewer';
import SQLEditor from '../components/SQLEditor/SQLEditor';
import ResultsPanel from '../components/ResultsPanel/ResultsPanel';
import HintPanel from '../components/HintPanel/HintPanel';
import './_attempt-page.scss';

const AttemptPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const { loading: executing, results, error: resultError, execute, clearResults } = useQueryExecution();
  const { loading: hintLoading, hint, error: hintError, fetchHint, hintCount, clearHint } = useHint();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await getAssignmentById(id);
        setAssignment(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleRunQuery = () => {
    execute(id, query);
  };

  const handleGetHint = () => {
    fetchHint(id, query, resultError || '');
  };

  if (loading) {
    return (
      <div className="attempt-page__loading">
        <div className="attempt-page__spinner"></div>
        <p>Loading assignment...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="attempt-page__error">
        <p>{error || 'Assignment not found'}</p>
        <Link to="/" className="attempt-page__back">Back to Assignments</Link>
      </div>
    );
  }

  return (
    <div className="attempt-page">
      <div className="attempt-page__header">
        <Link to="/" className="attempt-page__back">← Back to Assignments</Link>
      </div>

      <div className="attempt-page__content">
        <div className="attempt-page__left">
          <QuestionPanel assignment={assignment} />
          <SampleDataViewer tables={assignment.tables} />
        </div>

        <div className="attempt-page__right">
          <SQLEditor 
            value={query} 
            onChange={setQuery}
            onRun={handleRunQuery}
            loading={executing}
          />
          <ResultsPanel 
            results={results}
            error={resultError}
            loading={executing}
          />
          <HintPanel 
            hint={hint}
            error={hintError}
            loading={hintLoading}
            hintCount={hintCount}
            onGetHint={handleGetHint}
          />
        </div>
      </div>
    </div>
  );
};

export default AttemptPage;
