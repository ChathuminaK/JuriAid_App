import { authAPI } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Sign up
  signup: async (email, password, fullName) => {
    try {
      const response = await authAPI.post('/auth/signup', {
        email,
        password,
        full_name: fullName,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Signup failed';
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await authAPI.post('/auth/login', {
        email,
        password,
      });
      
      // Store token
      if (response.data.access_token) {
        await AsyncStorage.setItem('authToken', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Login failed';
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await authAPI.get('/auth/me');
      
      // Store profile
      await AsyncStorage.setItem('userProfile', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch profile';
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userProfile');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get stored token
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      return null;
    }
  },
};

export default authService;