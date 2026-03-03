import { useState, useEffect } from 'react';
import { getAssignments } from '../services/api';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignments();
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return { assignments, loading, error, refetch: fetchAssignments };
};

export default useAssignments;
