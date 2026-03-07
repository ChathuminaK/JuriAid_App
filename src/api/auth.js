import { authAPI, log } from './index';

export const authService = {

  // ── Sign Up ───────────────────────────────────────────────────────────────
  signup: async ({ email, password, full_name, phone }) => {
    log.info('[authService] signup called', { email, full_name, phone });
    try {
      const response = await authAPI.post('/auth/signup', {
        email, password, full_name, phone,
      });
      log.info('[authService] signup success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[authService] signup failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Signup failed';
    }
  },

  // ── Login ────────────────────────────────────────────────────────────────
  login: async ({ email, password }) => {
    log.info('[authService] login called', { email });
    try {
      const response = await authAPI.post('/auth/login', { email, password });
      log.info('[authService] login success – token received:', !!response.data.access_token);
      return response.data; // { access_token, token_type, ... }
    } catch (error) {
      log.error('[authService] login failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Login failed';
    }
  },

  // ── Verify Token ─────────────────────────────────────────────────────────
  verifyToken: async () => {
    log.info('[authService] verifyToken called');
    try {
      const response = await authAPI.get('/auth/verify');
      log.info('[authService] verifyToken success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[authService] verifyToken failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Token verification failed';
    }
  },

  // ── Get Profile ───────────────────────────────────────────────────────────
  getProfile: async () => {
    log.info('[authService] getProfile called');
    try {
      const response = await authAPI.get('/auth/me');
      log.info('[authService] getProfile success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[authService] getProfile failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to get profile';
    }
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    log.info('[authService] logout called');
    try {
      const response = await authAPI.post('/auth/logout');
      log.info('[authService] logout success');
      return response.data;
    } catch (error) {
      log.error('[authService] logout failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Logout failed';
    }
  },
};

export default authService;