import { createSlice } from '@reduxjs/toolkit';

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    savedReports: [],
  },
  reducers: {
    saveReport: (state, action) => {
      const exists = state.savedReports.find(
        (r) => r.analysis_id === action.payload.analysis_id
      );
      if (!exists) {
        state.savedReports.unshift({
          ...action.payload,
          savedAt: new Date().toISOString(),
        });
      }
    },
    deleteReport: (state, action) => {
      state.savedReports = state.savedReports.filter(
        (r) => r.analysis_id !== action.payload
      );
    },
    clearReports: (state) => {
      state.savedReports = [];
    },
  },
  extraReducers: (builder) => {
    // Clear all reports when any user logs out
    builder.addCase('auth/logoutUser/fulfilled', (state) => {
      state.savedReports = [];
    });
  },
});

export const { saveReport, deleteReport, clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;