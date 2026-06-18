import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  verify: () => api.post('/auth/verify'),
};

// Medicine API
export const medicineAPI = {
  getAll: () => api.get('/medicines'),
  getById: (id) => api.get(`/medicines/${id}`),
  search: (query) => api.get('/medicines/search', { params: { q: query } }),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
  addStock: (id, quantity) =>
    api.post(`/medicines/${id}/add-stock`, { quantity }),
  reduceStock: (id, quantity) =>
    api.post(`/medicines/${id}/reduce-stock`, { quantity }),
};

// Bill API
export const billAPI = {
  create: (items, discountPercent) =>
    api.post('/bills', { items, discountPercent }),
  getAll: () => api.get('/bills'),
  getById: (id) => api.get(`/bills/${id}`),
  search: (query) => api.get('/bills/search', { params: { q: query } }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Alert API
export const alertAPI = {
  getAlerts: () => api.get('/alerts'),
};

export default api;
