import { authAPI } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Sign up (now includes phone support)
  signup: async (email, password, fullName, phone = null) => {
    try {
      const response = await authAPI.post('/auth/signup', {
        email,
        password,
        full_name: fullName,
        ...(phone && { phone }), // Include phone if provided
      });
      
      // Auto-store token after signup
      if (response.data.access_token) {
        await AsyncStorage.setItem('authToken', response.data.access_token);
      }
      
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

  // Update user profile
  updateProfile: async (fullName, phone) => {
    try {
      const response = await authAPI.put('/auth/me', {
        full_name: fullName,
        phone,
      });
      
      // Update stored profile
      await AsyncStorage.setItem('userProfile', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to update profile';
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await authAPI.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Token verification failed';
    }
  },

  // Logout
  logout: async () => {
    try {
      // Call backend logout endpoint
      await authAPI.post('/auth/logout');
      
      // Clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userProfile');
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Even if backend call fails, clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userProfile');
      
      console.error('Logout error:', error);
      return { success: false, message: 'Logged out locally' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return false;
      
      // Optionally verify token with backend
      try {
        await authService.verifyToken();
        return true;
      } catch {
        // Token invalid, clear storage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userProfile');
        return false;
      }
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

  // Get stored profile
  getStoredProfile: async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      return null;
    }
  },
};

export default authService;