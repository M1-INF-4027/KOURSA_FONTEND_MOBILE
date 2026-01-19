/**
 * Koursa - Auth Context
 * Gestion de l'authentification avec JWT
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Utilisateur, AuthState, LoginCredentials, RegisterData } from '../types';
import { authService, usersService } from '../api/services';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Utilisateur) => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Charger l'authentification stockée au démarrage
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedRefreshToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('refreshToken'),
        AsyncStorage.getItem('user'),
      ]);

      if (storedToken && storedUser) {
        setState({
          user: JSON.parse(storedUser),
          token: storedToken,
          refreshToken: storedRefreshToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      // Appel au véritable endpoint JWT du backend
      const response = await authService.login(credentials);
      const { access, refresh, user } = response.data;

      // Stocker les tokens et l'utilisateur
      await Promise.all([
        AsyncStorage.setItem('authToken', access),
        AsyncStorage.setItem('refreshToken', refresh),
        AsyncStorage.setItem('user', JSON.stringify(user)),
      ]);

      setState({
        user,
        token: access,
        refreshToken: refresh,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error: any) {
      console.error('Login error:', error);

      // Gestion des erreurs spécifiques
      if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      } else if (error.response?.status === 400) {
        throw new Error('Données de connexion invalides');
      } else if (error.message === 'Network Error') {
        throw new Error('Erreur de connexion au serveur');
      }

      throw new Error('Une erreur est survenue lors de la connexion');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Créer l'utilisateur via l'API
      const response = await usersService.create(data);
      const user = response.data;

      // Après inscription, connecter l'utilisateur automatiquement
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      console.error('Register error:', error);

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.email) {
          throw new Error('Cet email est déjà utilisé');
        }
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
      } else if (error.response?.status === 403) {
        throw new Error(error.response.data.detail || 'Inscription non autorisée');
      }

      throw new Error('Une erreur est survenue lors de l\'inscription');
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('authToken'),
        AsyncStorage.removeItem('refreshToken'),
        AsyncStorage.removeItem('user'),
      ]);

      setState({
        user: null,
        token: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = async (user: Utilisateur) => {
    try {
      setState((prev) => ({ ...prev, user }));
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const { refreshToken } = state;

      if (!refreshToken) {
        return false;
      }

      const response = await authService.refreshToken(refreshToken);
      const newAccessToken = response.data.access;

      await AsyncStorage.setItem('authToken', newAccessToken);
      setState((prev) => ({ ...prev, token: newAccessToken }));

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Si le refresh échoue, déconnecter l'utilisateur
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        refreshAccessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
