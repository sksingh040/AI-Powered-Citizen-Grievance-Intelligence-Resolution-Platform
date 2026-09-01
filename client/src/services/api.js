import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civic_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const registerApi = (userData) => api.post('/auth/register', userData);
export const getMeApi = () => api.get('/auth/me');
export const getDemoAccountsApi = () => api.get('/auth/demo-accounts');

export const createComplaintApi = (complaintData) => api.post('/complaints', complaintData);
export const getComplaintByTicketIdApi = (ticketId) => api.get(`/complaints/${ticketId}`);
export const submitFeedbackApi = (ticketId, feedbackData) => api.post(`/complaints/${ticketId}/feedback`, feedbackData);
export const getPublicHotspotsApi = () => api.get('/complaints/public-hotspots');
export const uploadMediaApi = (formData) => api.post('/complaints/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const getOfficerQueueApi = (params) => api.get('/officer/queue', { params });
export const updateStatusApi = (ticketId, data) => api.patch(`/officer/${ticketId}/status`, data);
export const overrideTriageApi = (ticketId, data) => api.patch(`/officer/${ticketId}/override-triage`, data);
export const resolveWithEvidenceApi = (ticketId, data) => api.patch(`/officer/${ticketId}/resolve`, data);
export const assignOfficerApi = (ticketId, data) => api.patch(`/officer/${ticketId}/assign`, data);

export const getIncidentClustersApi = () => api.get('/incidents');
export const mergeIncidentClusterApi = (data) => api.post('/incidents/merge', data);

export const getAnalyticsSummaryApi = () => api.get('/analytics/summary');
export const getAuditTrailApi = () => api.get('/analytics/audit-trail');

export const getAiTriagePreviewApi = (data) => api.post('/ai/triage-preview', data);
export const sendChatMessageApi = (data) => api.post('/chatbot/message', data);

export default api;
