import axios from 'axios';

const api = axios.create({
  baseURL: 'https://med-tec-back.vercel.app',
});

export default api;