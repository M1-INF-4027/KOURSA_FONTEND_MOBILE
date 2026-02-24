import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base de l'API
// Pour Android Emulator, utiliser 10.0.2.2 au lieu de localhost
// Pour iOS Simulator, utiliser localhost
// Pour device physique, utiliser l'IP de votre machine
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api'  // Android Emulator
  : 'https://koursa.duckdns.org/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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

// Gestion du refresh token avec queue de requetes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const forceLogout = async () => {
  await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);
};

// Intercepteur pour gerer les erreurs de reponse et le refresh automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/token');

    // Seulement les 401, pas les endpoints d'auth, et pas les retries
    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Tenter le refresh
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      await forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Mettre en queue pendant le refresh en cours
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccessToken = res.data.access;

      await AsyncStorage.setItem('authToken', newAccessToken);
      // Si le serveur fait la rotation des refresh tokens
      if (res.data.refresh) {
        await AsyncStorage.setItem('refreshToken', res.data.refresh);
      }

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
export { API_BASE_URL };
