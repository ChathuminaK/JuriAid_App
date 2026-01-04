import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URLs for different services
// export const BASE_URL = 'http://127.0.0.1:8000'; // Orchestrator
// export const AUTH_BASE_URL = 'http://127.0.0.1:8001'; // Auth Service

export const BASE_URL = 'http://127.0.0.1:8000'; // Orchestrator
export const AUTH_BASE_URL = 'http://10.0.2.2:8001'; // Auth Service

// Create axios instance for Orchestrator
export const orchestratorAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for Auth Service
export const authAPI = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
const requestInterceptor = async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
};

// Add interceptors to both instances
orchestratorAPI.interceptors.request.use(requestInterceptor);
authAPI.interceptors.request.use(requestInterceptor);

// Response interceptor for error handling
const responseErrorHandler = async (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid - clear storage and redirect to login
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userProfile');
    // You can add navigation logic here if needed
  }
  return Promise.reject(error);
};

orchestratorAPI.interceptors.response.use(
  (response) => response,
  responseErrorHandler
);

authAPI.interceptors.response.use(
  (response) => response,
  responseErrorHandler
);

export default {
  orchestratorAPI,
  authAPI,
};