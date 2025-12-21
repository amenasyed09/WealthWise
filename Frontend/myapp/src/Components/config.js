const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string means same domain
  : 'http://localhost:5000';

export default API_URL;