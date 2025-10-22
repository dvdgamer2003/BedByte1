import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-redirect to login if user is authenticated but token expired
    // Don't redirect if already on login/register pages (to show error messages)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      
      if (!isAuthPage) {
        // User was logged in but token expired
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // If on auth page, just pass the error through to show the message
    }
    return Promise.reject(error);
  }
);

export default api;
