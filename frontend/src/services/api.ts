import axios from 'axios';

// Configure axios base URL
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Export the base URL for direct fetch usage
export const API_BASE_URL = baseURL;

export default axios;
