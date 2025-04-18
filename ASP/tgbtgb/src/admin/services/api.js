import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5183/api', // điều chỉnh đúng base URL API backend của bạn
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
