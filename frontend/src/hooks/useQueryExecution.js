import { useState } from 'react';
import { executeQuery } from '../services/api';

export const useQueryExecution = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (assignmentId, query) => {
    if (!query || !query.trim()) {
      setError('Please enter a query');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await executeQuery(assignmentId, query);
      setResults(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return { loading, results, error, execute, clearResults };
};

export default useQueryExecution;
