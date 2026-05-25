import axios from 'axios';

// Connects to local development Flask on port 5000 or the production Render URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 90000 // 90 seconds timeout for heavy CSV calculations
});

export default API;
