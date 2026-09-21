import axios from 'axios';

export const based_url = axios.create({
  baseURL: 'http://localhost:5002/api',
  withCredentials: true
});