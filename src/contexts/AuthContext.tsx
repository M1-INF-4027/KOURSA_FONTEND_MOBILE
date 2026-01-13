import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Utilisateur, AuthState, LoginCredentials, RegisterData } from '../types';
import { usersService } from '../api/services';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Utilisateur) => void;
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
    isLoading: true,
    isAuthenticated: false,
  });

  // Charger l'utilisateur depuis le stockage au demarrage
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('user'),
      ]);

      if (storedToken && storedUser) {
        setState({
          user: JSON.parse(storedUser),
          token: storedToken,
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
      // Note: Le backend n'a pas encore d'endpoint d'authentification JWT
      // Pour l'instant, on simule en recuperant l'utilisateur par email
      const response = await usersService.getAll();
      const user = response.data.find((u) => u.email === credentials.email);

      if (!user) {
        throw new Error('Utilisateur non trouve');
      }

      // Simuler un token (a remplacer par un vrai JWT quand le backend le supportera)
      const fakeToken = `fake-token-${user.id}-${Date.now()}`;

      await AsyncStorage.setItem('authToken', fakeToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        token: fakeToken,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await usersService.create(data);
      const user = response.data;

      // Auto-login apres inscription
      const fakeToken = `fake-token-${user.id}-${Date.now()}`;

      await AsyncStorage.setItem('authToken', fakeToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        token: fakeToken,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');

      setState({
        user: null,
        token: null,
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
    AsyncStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
