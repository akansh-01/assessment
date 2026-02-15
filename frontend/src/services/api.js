import axios from 'axios';

// The base URL for the backend API
// Ensure your backend is running on this port or configure Vite proxy
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getIncidents = async (params) => {
  // params: { page, size, sort, service, severity, status, search }
  const response = await api.get('/incidents', { params });
  return response.data;
};

export const getIncidentById = async (id) => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};

export const createIncident = async (data) => {
  const response = await api.post('/incidents', data);
  return response.data;
};

export const updateIncident = async (id, data) => {
  const response = await api.patch(`/incidents/${id}`, data);
  return response.data;
};

export default api;
