import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../api/auth';
import { log } from '../../api/index';

// ── Thunks ────────────────────────────────────────────────────────────────────

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  log.info('[authSlice] checkAuth started');
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      log.info('[authSlice] checkAuth – no token in storage');
      return rejectWithValue('No token');
    }
    log.info('[authSlice] checkAuth – token found, verifying…');
    await authService.verifyToken();
    const user = await authService.getProfile();
    log.info('[authSlice] checkAuth – profile loaded:', user);
    return { token, user };
  } catch (error) {
    log.error('[authSlice] checkAuth failed:', error);
    await AsyncStorage.removeItem('authToken');
    return rejectWithValue(error);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  log.info('[authSlice] loginUser called', { email: credentials.email });
  try {
    const data = await authService.login(credentials);
    if (data.access_token) {
      await AsyncStorage.setItem('authToken', data.access_token);
      log.info('[authSlice] loginUser – token stored');
    }
    const user = await authService.getProfile();
    log.info('[authSlice] loginUser – profile fetched:', user);
    return { token: data.access_token, user };
  } catch (error) {
    log.error('[authSlice] loginUser failed:', error);
    return rejectWithValue(error);
  }
});

export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
  log.info('[authSlice] signupUser called', { email: userData.email });
  try {
    const data = await authService.signup(userData);
    log.info('[authSlice] signupUser success:', data);
    return data;
  } catch (error) {
    log.error('[authSlice] signupUser failed:', error);
    return rejectWithValue(error);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  log.info('[authSlice] logoutUser called');
  try {
    await authService.logout();
    await AsyncStorage.removeItem('authToken');
    log.info('[authSlice] logoutUser – token removed');
  } catch (error) {
    log.warn('[authSlice] logoutUser server call failed (still clearing local token):', error);
    await AsyncStorage.removeItem('authToken');
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  log.info('[authSlice] fetchProfile called');
  try {
    const user = await authService.getProfile();
    log.info('[authSlice] fetchProfile success:', user);
    return user;
  } catch (error) {
    log.error('[authSlice] fetchProfile failed:', error);
    return rejectWithValue(error);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ fullName, phone, profileImage }, { rejectWithValue }) => {
  log.info('[authSlice] updateProfile called');
  try {
    const user = await authService.updateProfile({ full_name: fullName, phone, profileImage });
    log.info('[authSlice] updateProfile success:', user);
    return user;
  } catch (error) {
    log.error('[authSlice] updateProfile failed:', error);
    return rejectWithValue(error);
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            null,
    token:           null,
    isAuthenticated: false,
    loading:         false,
    profileLoading:  false,
    error:           null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // checkAuth
    builder
      .addCase(checkAuth.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.loading         = false;
        state.isAuthenticated = true;
        state.token           = payload.token;
        state.user            = payload.user;
        log.info('[authSlice] checkAuth.fulfilled – isAuthenticated=true');
      })
      .addCase(checkAuth.rejected,  (state, { payload }) => {
        state.loading         = false;
        state.isAuthenticated = false;
        state.token           = null;
        state.user            = null;
        log.info('[authSlice] checkAuth.rejected:', payload);
      });

    // loginUser
    builder
      .addCase(loginUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading         = false;
        state.isAuthenticated = true;
        state.token           = payload.token;
        state.user            = payload.user;
        log.info('[authSlice] loginUser.fulfilled – isAuthenticated=true');
      })
      .addCase(loginUser.rejected,  (state, { payload }) => {
        state.loading = false;
        state.error   = typeof payload === 'string' ? payload : 'Login failed';
        log.error('[authSlice] loginUser.rejected:', payload);
      });

    // signupUser
    builder
      .addCase(signupUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state) => { state.loading = false; })
      .addCase(signupUser.rejected,  (state, { payload }) => {
        state.loading = false;
        state.error   = typeof payload === 'string' ? payload : 'Signup failed';
        log.error('[authSlice] signupUser.rejected:', payload);
      });

    // logoutUser
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token           = null;
        state.user            = null;
        log.info('[authSlice] logoutUser.fulfilled – cleared');
      });

    // fetchProfile
    builder
      .addCase(fetchProfile.pending,   (state) => { state.profileLoading = true; })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.profileLoading = false;
        state.user = payload;
      })
      .addCase(fetchProfile.rejected,  (state) => { state.profileLoading = false; });

    // updateProfile
    builder
      .addCase(updateProfile.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(updateProfile.rejected,  (state, { payload }) => {
        state.loading = false;
        state.error = typeof payload === 'string' ? payload : 'Update failed';
      });
  },
});

export const { clearError } = authSlice.actions;
export const logout = logoutUser;
export default authSlice.reducer;

