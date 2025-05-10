import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // For testing purposes - hardcoded credentials
      // In a real app, this would call the backend API
      if (credentials.username === 'demo' && credentials.password === 'password123') {
        // Create a mock successful response with token
        const mockResponse = {
          access_token: 'demo-token-123456789',
          user: {
            id: 'user-1',
            username: 'demo',
            email: 'demo@example.com'
          }*9
        };
        
        // Store the token in localStorage
        localStorage.setItem('token', mockResponse.access_token);
        return mockResponse;
      } else {
        // Simulate an authentication error for wrong credentials
        return rejectWithValue('Invalid username or password');
      }
      
      // The code below would be used in a real implementation
      // const response = await axios.post('/users/login', credentials);
      // localStorage.setItem('token', response.data.access_token);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/users/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
);

// Check if user is already logged in (has token)
const token = localStorage.getItem('token');

// Auth slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.access_token;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Login failed';
    });

    // Register cases
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Registration failed';
    });

    // Logout cases
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
