// Reusable selectors for auth state
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectProfileLoading = (state) => state.auth.profileLoading;
export const selectToken = (state) => state.auth.token;