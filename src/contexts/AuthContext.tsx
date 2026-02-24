import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Utilisateur, AuthState, LoginCredentials, RegisterData } from '../types';
import { authService, usersService } from '../api/services';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Utilisateur) => void;
  refreshUser: () => Promise<void>;
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

  // Charger l'utilisateur depuis le stockage au demarrage
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
        const user = JSON.parse(storedUser);
        setState({
          user,
          token: storedToken,
          refreshToken: storedRefreshToken,
          isLoading: false,
          isAuthenticated: true,
        });

        // Valider le token en arriere-plan en appelant /me
        try {
          const response = await authService.getMe();
          const freshUser = response.data;
          setState((prev) => ({ ...prev, user: freshUser }));
          await AsyncStorage.setItem('user', JSON.stringify(freshUser));
        } catch {
          // Si 401, le token est invalide - le refresh sera tente par l'intercepteur
          // Si le refresh echoue aussi, forceLogout sera appele par l'intercepteur
        }
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
      const response = await authService.login(credentials);
      const { access, refresh, user } = response.data;

      await AsyncStorage.setItem('authToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        token: access,
        refreshToken: refresh,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error: any) {
      // Transformer les erreurs backend en messages lisibles
      if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Erreur de connexion au serveur');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Creer le compte
      await usersService.create(data);

      // Se connecter automatiquement apres inscription
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      if (error.response?.data) {
        // Extraire les erreurs de validation du backend
        const errors = error.response.data;
        const messages = Object.entries(errors)
          .map(([field, msgs]) => {
            const msgList = Array.isArray(msgs) ? msgs : [msgs];
            return `${field}: ${msgList.join(', ')}`;
          })
          .join('\n');
        throw new Error(messages || 'Erreur lors de l\'inscription');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);

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

  const updateUser = (user: Utilisateur) => {
    setState((prev) => ({ ...prev, user }));
    AsyncStorage.setItem('user', JSON.stringify(user)).catch((err) =>
      console.error('Error saving user:', err)
    );
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      const user = response.data;
      setState((prev) => ({ ...prev, user }));
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error refreshing user:', error);
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
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
