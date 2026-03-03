import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ciphersql_token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// ─── Assignments ────────────────────────────────────────────────────────────
export const getAssignments = () => api.get('/assignments');
export const getAssignmentById = (id) => api.get(`/assignments/${id}`);

// ─── Execute / Hints ─────────────────────────────────────────────────────────
export const executeQuery = (assignmentId, query) =>
  api.post('/execute', { assignmentId, query });

export const getHint = (assignmentId, currentQuery, errorMessage, hintLevel = 1) =>
  api.post('/hint', { assignmentId, currentQuery, errorMessage, hintLevel });

// ─── Auth ────────────────────────────────────────────────────────────────────
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const registerUser = (username, email, password) => api.post('/auth/register', { username, email, password });
export const getMe = () => api.get('/auth/me');

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminGetQuestions = () => api.get('/admin/questions');
export const adminDeleteQuestion = (id) => api.delete(`/admin/questions/${id}`);
export const adminUpdateQuestion = (id, data) => api.put(`/admin/questions/${id}`, data);
export const adminParseDocument = (formData) => api.post('/admin/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const adminSaveQuestion = (data) => api.post('/admin/questions', data);

// ─── Explain / Solve ─────────────────────────────────────────────────────────
export const explainQuery = (assignmentId, userQuery) =>
  api.post('/explain', { assignmentId, userQuery });

// ─── Progress ────────────────────────────────────────────────────────────────
export const getMyProgress = () => api.get('/progress/me');
export const getLeaderboard = () => api.get('/progress/leaderboard');

export default api;

