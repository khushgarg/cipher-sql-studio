import { useState } from 'react';
import { explainQuery } from '../services/api';

export const useExplain = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchExplanation = async (assignmentId, userQuery) => {
        try {
            setLoading(true);
            setError(null);
            const response = await explainQuery(assignmentId, userQuery);
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to get explanation');
        } finally {
            setLoading(false);
        }
    };

    const clearExplanation = () => {
        setData(null);
        setError(null);
    };

    return { loading, data, error, fetchExplanation, clearExplanation };
};

export default useExplain;
