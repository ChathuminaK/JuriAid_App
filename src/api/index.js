import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const COMPUTER_IP = '192.168.8.106'; //my router
const COMPUTER_IP = '4.194.3.165'; //prod server (azure vm)
//const COMPUTER_IP = '192.168.119.189'; //samidi mobile

const API_URLS = {
  AUTH:         `http://${COMPUTER_IP}:8001`,
  PAST_CASE:    `http://${COMPUTER_IP}:8002`,
  LAWSTATKG:    `http://${COMPUTER_IP}:8003`,
  QUESTION_GEN: `http://${COMPUTER_IP}:8004`,
  ORCHESTRATOR: `http://${COMPUTER_IP}:8000`,
};

// ─── Debug Logger ─────────────────────────────────────────────────────────────
const DEBUG = true; // set false in production

export const log = {
  info:    (...args) => DEBUG && console.log('[API][INFO]',    ...args),
  warn:    (...args) => DEBUG && console.warn('[API][WARN]',   ...args),
  error:   (...args) => DEBUG && console.error('[API][ERROR]', ...args),
  request: (method, url, data) => {
    if (!DEBUG) return;
    console.log(`[API][REQ] ${method.toUpperCase()} ${url}`);
    if (data) console.log('[API][REQ][BODY]', JSON.stringify(data, null, 2));
  },
  response: (url, status, data) => {
    if (!DEBUG) return;
    console.log(`[API][RES] ${url} → ${status}`);
    if (data) console.log('[API][RES][DATA]', JSON.stringify(data, null, 2));
  },
};

// ─── Create Axios Instance ────────────────────────────────────────────────────
const createInstance = (baseURL, name, timeout = 30000) => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: { 'Content-Type': 'application/json' },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          log.info(`[${name}] Token attached`);
        }
        log.request(config.method, `${baseURL}${config.url}`, config.data);
      } catch (error) {
        log.error(`[${name}] Error reading token:`, error.message);
      }
      return config;
    },
    (error) => {
      log.error(`[${name}] Request error:`, error.message);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      log.response(
        `${baseURL}${response.config.url}`,
        response.status,
        response.data
      );
      return response;
    },
    async (error) => {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      const url    = error.config?.url;
      log.error(`[${name}] ${status} ${url}`, detail || error.message);

      if (status === 401) {
        log.warn(`[${name}] 401 Unauthorized – clearing stored credentials`);
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userProfile');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const authAPI         = createInstance(API_URLS.AUTH,         'AUTH',         15000);
export const pastCaseAPI     = createInstance(API_URLS.PAST_CASE,    'PAST_CASE',    30000);
export const lawStatKGAPI    = createInstance(API_URLS.LAWSTATKG,    'LAWSTATKG',    30000);
export const questionGenAPI  = createInstance(API_URLS.QUESTION_GEN, 'QUESTION_GEN', 30000);
export const orchestratorAPI = createInstance(API_URLS.ORCHESTRATOR, 'ORCHESTRATOR', 900000); // 15 min for AI pipeline

// Keep legacy named exports for backward compatibility
export const BASE_URL      = API_URLS.ORCHESTRATOR;
export const AUTH_BASE_URL = API_URLS.AUTH;

export { API_URLS };
export default { authAPI, pastCaseAPI, lawStatKGAPI, questionGenAPI, orchestratorAPI };