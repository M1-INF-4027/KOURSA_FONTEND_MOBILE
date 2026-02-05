import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base de l'API
// Pour Android Emulator, utiliser 10.0.2.2 au lieu de localhost
// Pour iOS Simulator, utiliser localhost
// Pour device physique, utiliser l'IP de votre machine
const DEV_API_URL = 'http://192.168.1.198:8000/api'; // IP locale pour appareil physique
// const DEV_API_URL = 'http://10.0.2.2:8000/api'; // Decommenter pour Android Emulator

const API_BASE_URL = __DEV__
  ? DEV_API_URL
  : 'https://koursa.duckdns.org/api'; // Production VPS (HTTPS)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gerer les erreurs de reponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expire ou invalide
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
