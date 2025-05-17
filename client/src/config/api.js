// API base URL configuration
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'https://dhyaan-chakra-api.onrender.com/api'
  : 'http://localhost:5000/api';

export default API_URL;
