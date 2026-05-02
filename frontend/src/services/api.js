import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Pointing to local backend
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('movieUser'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
