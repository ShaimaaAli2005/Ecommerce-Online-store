import axios from 'axios';

const api = axios.create({
  baseURL: 'https://e-commerce-api-3wara.vercel.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/login')) {
        window.history.replaceState(null, '', '/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;