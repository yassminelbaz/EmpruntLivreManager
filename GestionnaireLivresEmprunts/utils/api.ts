import axios from 'axios';
import { API_URL } from '@env';

console.log('API URL ACTUELLE:', API_URL); 

const api = axios.create({
  baseURL: API_URL , 
  timeout: 10000,
});

api.interceptors.request.use(config => {
  console.log('ENVOI REQUÊTE À:', config.url);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('RÉPONSE REÇUE DE:', response.config.url);
    return response;
  },
  error => {
    console.log('ERREUR COMPLÈTE:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;