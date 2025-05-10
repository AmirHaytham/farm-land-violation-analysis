import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import { CloudUpload, Send } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { uploadImage, setUploadProgress, clearError } from '../store/slices/analysisSlice';

const Upload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, uploadProgress } = useSelector((state) => state.analysis);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [locationInfo, setLocationInfo] = useState({
    latitude: '',
    longitude: '',
    region: '',
  });

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (error) {
        dispatch(clearError());
      }
    }
  }, [dispatch, error]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tif', '.tiff'],
    },
    maxSize: 20971520, // 20MB
    maxFiles: 1,
  });

  // Handle location input change
  const handleLocationChange = (e) => {
    setLocationInfo({
      ...locationInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Add location data if provided
    if (locationInfo.latitude) {
      formData.append('latitude', locationInfo.latitude);
    }
    if (locationInfo.longitude) {
      formData.append('longitude', locationInfo.longitude);
    }
    if (locationInfo.region) {
      formData.append('region', locationInfo.region);
    }

    // Start upload progress simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 90) {
        clearInterval(interval);
      }
      dispatch(setUploadProgress(progress));
    }, 200);

    // Upload the image
    const resultAction = await dispatch(uploadImage(formData));
    clearInterval(interval);
    
    if (uploadImage.fulfilled.match(resultAction)) {
      // Complete the progress
      dispatch(setUploadProgress(100));
      
      // Navigate to the analysis page
      const analysisId = resultAction.payload.id;
      setTimeout(() => {
        navigate(`/analysis/${analysisId}`);
      }, 500);
    } else {
      // Reset progress on error
      dispatch(setUploadProgress(0));
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Image for Analysis
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Upload a satellite or aerial image of farmland to detect potential violations.
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Image Upload
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Supported formats: JPEG, PNG, TIFF. Maximum file size: 20MB.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''}`}
              sx={{ mb: 3 }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography>Drop the image here...</Typography>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography>Drag & drop an image here, or click to select a file</Typography>
                </Box>
              )}
            </Box>

            {preview && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Image Preview:
                </Typography>
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                />
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Location Information (Optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              If known, provide the coordinates of the image to improve analysis accuracy.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  name="latitude"
                  type="number"
                  value={locationInfo.latitude}
                  onChange={handleLocationChange}
                  inputProps={{ step: 'any' }}
                  disabled={loading}
                  placeholder="e.g., 37.7749"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  name="longitude"
                  type="number"
                  value={locationInfo.longitude}
                  onChange={handleLocationChange}
                  inputProps={{ step: 'any' }}
                  disabled={loading}
                  placeholder="e.g., -122.4194"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Region/County"
                  name="region"
                  value={locationInfo.region}
                  onChange={handleLocationChange}
                  disabled={loading}
                  placeholder="e.g., Sonoma County"
                />
              </Grid>
            </Grid>

            {uploadProgress > 0 && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  {uploadProgress}%
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!selectedFile || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            >
              {loading ? 'Processing...' : 'Analyze Image'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Upload;
