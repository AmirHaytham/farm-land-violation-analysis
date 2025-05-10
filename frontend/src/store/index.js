import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import analysisReducer from './slices/analysisSlice';
import alertReducer from './slices/alertSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
    alert: alertReducer,
  },
});

export default store;
