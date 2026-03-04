import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './slices/authSlice';
import reportsReducer from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/signup/fulfilled'],
      },
    }),
});

export default store;