import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';

// const COMPUTER_IP = '192.168.8.106'; my router
const COMPUTER_IP = '192.168.119.189'; //samidi mobile


export const BASE_URL = `http://${COMPUTER_IP}:8000`; // Orchestrator
export const AUTH_BASE_URL = `http://${COMPUTER_IP}:8001`; // Auth Service

// Create axios instances
export const orchestratorAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const authAPI = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to add token
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

orchestratorAPI.interceptors.request.use(requestInterceptor);
authAPI.interceptors.request.use(requestInterceptor);

// Response error handler
const responseErrorHandler = async (error) => {
  if (error.response?.status === 401) {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userProfile');
  }
  return Promise.reject(error);
};

orchestratorAPI.interceptors.response.use((response) => response, responseErrorHandler);
authAPI.interceptors.response.use((response) => response, responseErrorHandler);

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/signup/fulfilled'],
      },
    }),
});

export default { orchestratorAPI, authAPI, store };