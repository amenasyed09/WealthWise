const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wealthwise-backend-v1tv.onrender.com' // Empty string means same domain
  : 'http://localhost:5000';

export default API_URL;