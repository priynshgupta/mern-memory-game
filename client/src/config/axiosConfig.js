// Set up axios with default configurations and interceptors
import axios from 'axios';
import API_URL from './api';

// Create an instance of axios with the base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token in all API requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to the request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
