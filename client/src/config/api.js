// API base URL configuration
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'https://dhyaan-chakra-api.onrender.com/api'
  : process.env.REACT_APP_DEV_API_URL || 'http://localhost:5000/api';

// Export both the URL and a function that can be used to dynamically check the environment
export default API_URL;

// Helper function to get the appropriate URL based on the current environment
export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};
