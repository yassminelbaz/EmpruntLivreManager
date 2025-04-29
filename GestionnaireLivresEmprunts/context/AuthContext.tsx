// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';




interface AuthContextType {
  user: User | null;
  token: string | null; 
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'etudiant';
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: false
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User| null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showSuccessAlert = (message: string) => {
    Alert.alert('Succès', message, [
      { text: 'OK', style: 'default' }
    ]);
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log(`Tentative de login vers: ${API_URL}/api/login`);
      const res = await axios.post(`${API_URL}/api/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (res.data.token && res.data.user) { 
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user); 
        setToken(res.data.token);
        //showSuccessAlert('Connexion réussie !');   
      }
    }catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error?.message 
        || error.message 
        || 'Erreur lors de la connexion';
      Alert.alert('Erreur', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('Tentative d\'envoi à:', `${API_URL}/api/signup`);
      const res = await axios.post(`${API_URL}/api/signup`, data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Réponse du serveur:', res.data); 
      
      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
      }
      return res.data;
    } catch (error: any) {
      console.log('Erreur complète:', error); 
      const backendError = error.response?.data?.error;
      throw new Error(backendError?.message || error.message || "Erreur réseau");
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

