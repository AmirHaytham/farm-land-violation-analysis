import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configure axios to include the auth token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunks for analysis actions
export const uploadImage = createAsyncThunk(
  'analysis/uploadImage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/analysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Upload failed');
    }
  }
);

export const getAnalysisResult = createAsyncThunk(
  'analysis/getResult',
  async (analysisId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch analysis result');
    }
  }
);

export const getRecentAnalyses = createAsyncThunk(
  'analysis/getRecent',
  async (_, { rejectWithValue }) => {
    try {
      // In a real implementation, this would fetch from an API endpoint
      // For the prototype, we'll simulate with mock data
      const mockData = [
        {
          id: 'analysis-001',
          filename: 'farm_aerial_1.jpg',
          upload_time: '2025-05-10T08:12:35Z',
          result: {
            violation_count: 2,
            processing_time: 1.5,
            summary: 'Detected 2 potential violations: 1 unauthorized building, 1 deforestation.'
          }
        },
        {
          id: 'analysis-002',
          filename: 'farm_satellite_2.jpg',
          upload_time: '2025-05-09T15:23:18Z',
          result: {
            violation_count: 0,
            processing_time: 1.2,
            summary: 'No violations detected in the image. The land appears to be in compliance with regulations.'
          }
        },
        {
          id: 'analysis-003',
          filename: 'farm_drone_3.jpg',
          upload_time: '2025-05-08T11:45:52Z',
          result: {
            violation_count: 3,
            processing_time: 1.8,
            summary: 'Detected 3 potential violations: 1 waste dumping, 2 land use change.'
          }
        }
      ];
      
      return mockData;
    } catch (error) {
      return rejectWithValue('Failed to fetch recent analyses');
    }
  }
);

export const generateReport = createAsyncThunk(
  'analysis/generateReport',
  async ({ analysisId, format }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/analysis/${analysisId}/report?format=${format}`, {
        responseType: 'blob',
      });
      
      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `violation_report_${analysisId}.${format}`);
      document.body.appendChild(link);
      link.click();
      
      return { success: true, format };
    } catch (error) {
      return rejectWithValue('Failed to generate report');
    }
  }
);

// Analysis slice definition
const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    currentAnalysis: null,
    recentAnalyses: [],
    loading: false,
    error: null,
    uploadProgress: 0,
    reportGenerating: false,
  },
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload image cases
    builder.addCase(uploadImage.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.uploadProgress = 0;
    });
    builder.addCase(uploadImage.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAnalysis = action.payload;
      state.uploadProgress = 100;
      // Add to recent analyses
      state.recentAnalyses = [action.payload, ...state.recentAnalyses.slice(0, 9)];
    });
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Upload failed';
      state.uploadProgress = 0;
    });

    // Get analysis result cases
    builder.addCase(getAnalysisResult.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAnalysisResult.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAnalysis = action.payload;
    });
    builder.addCase(getAnalysisResult.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch analysis result';
    });

    // Get recent analyses cases
    builder.addCase(getRecentAnalyses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRecentAnalyses.fulfilled, (state, action) => {
      state.loading = false;
      state.recentAnalyses = action.payload;
    });
    builder.addCase(getRecentAnalyses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch recent analyses';
    });

    // Generate report cases
    builder.addCase(generateReport.pending, (state) => {
      state.reportGenerating = true;
    });
    builder.addCase(generateReport.fulfilled, (state) => {
      state.reportGenerating = false;
    });
    builder.addCase(generateReport.rejected, (state, action) => {
      state.reportGenerating = false;
      state.error = action.payload || 'Failed to generate report';
    });
  },
});

export const { setUploadProgress, clearCurrentAnalysis, clearError } = analysisSlice.actions;
export default analysisSlice.reducer;
