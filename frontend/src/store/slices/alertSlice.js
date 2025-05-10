import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
    duration: 6000, // duration in milliseconds
  },
  reducers: {
    showAlert: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || 'info';
      state.duration = action.payload.duration || 6000;
    },
    hideAlert: (state) => {
      state.open = false;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
