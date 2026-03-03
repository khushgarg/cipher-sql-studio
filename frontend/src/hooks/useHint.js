import { useState } from 'react';
import { getHint } from '../services/api';

export const useHint = () => {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(null);
  const [error, setError] = useState(null);
  const [hintCount, setHintCount] = useState(0);

  const fetchHint = async (assignmentId, currentQuery, errorMessage) => {
    if (hintCount >= 3) {
      setError('Maximum hints reached (3)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getHint(assignmentId, currentQuery, errorMessage);
      setHint(response.data.hint);
      setHintCount(prev => prev + 1);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHint = () => {
    setHint(null);
    setError(null);
  };

  return { loading, hint, error, fetchHint, hintCount, clearHint };
};

export default useHint;
