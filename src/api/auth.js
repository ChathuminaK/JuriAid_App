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
      return response.data;
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

  // ── Update Profile ────────────────────────────────────────────────────────
  updateProfile: async ({ full_name, phone, profileImage }) => {
    log.info('[authService] updateProfile called', { full_name, phone, hasImage: !!profileImage });
    try {
      if (profileImage) {
        // Use native fetch for multipart/form-data image upload
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const token = await AsyncStorage.getItem('authToken');

        const formData = new FormData();
        if (full_name) formData.append('full_name', full_name);
        if (phone !== undefined && phone !== null) formData.append('phone', phone);
        formData.append('profile_image', {
          uri: profileImage.uri,
          type: profileImage.type || 'image/jpeg',
          name: profileImage.name || 'profile.jpg',
        });

        const res = await fetch('/auth/me', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw err.detail || 'Failed to update profile';
        }

        log.info('[authService] updateProfile (image) success – fetching fresh profile');
        // Fetch fresh profile to get updated profile_icon_url
        const updated = await authService.getProfile();
        return updated;
      } else {
        const response = await authAPI.put('/auth/me', { full_name, phone });
        log.info('[authService] updateProfile success:', response.data);
        return response.data;
      }
    } catch (error) {
      log.error('[authService] updateProfile failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message || error,
      });
      throw error.response?.data?.detail || error || 'Failed to update profile';
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