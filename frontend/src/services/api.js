import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAssignments = () => api.get('/assignments');

export const getAssignmentById = (id) => api.get(`/assignments/${id}`);

export const executeQuery = (assignmentId, query) => 
  api.post('/execute', { assignmentId, query });

export const getHint = (assignmentId, currentQuery, errorMessage) =>
  api.post('/hint', { assignmentId, currentQuery, errorMessage });

export default api;
