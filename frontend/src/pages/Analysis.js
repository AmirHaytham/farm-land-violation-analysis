import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  LocationOn,
  Warning,
  Info,
  Download,
  ArrowBack,
  ErrorOutline,
  CheckCircle,
  Article,
} from '@mui/icons-material';
import { getAnalysisResult, generateReport } from '../store/slices/analysisSlice';

// Mapbox would require an API key in a real application
// For the prototype, we'll simulate map functionality
const SIMULATED_MAP = true;

const Analysis = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [reportFormat, setReportFormat] = useState('pdf');
  
  const { currentAnalysis, loading, error, reportGenerating } = useSelector(
    (state) => state.analysis
  );

  // Fetch analysis data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getAnalysisResult(id));
    }
  }, [dispatch, id]);

  // Initialize map when analysis data is available
  useEffect(() => {
    if (!SIMULATED_MAP && currentAnalysis && currentAnalysis.result.location && !map.current) {
      // In a real application, we would use:
      // mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
      // map.current = new mapboxgl.Map({
      //   container: mapContainer.current,
      //   style: 'mapbox://styles/mapbox/satellite-v9',
      //   center: [currentAnalysis.result.location.longitude, currentAnalysis.result.location.latitude],
      //   zoom: 15
      // });
      // 
      // // Add markers for each violation
      // currentAnalysis.result.detections.forEach((detection) => {
      //   // Create marker element
      //   const el = document.createElement('div');
      //   el.className = `violation-marker severity-${getSeverityClass(detection.violation_type)}`;
      //   
      //   // Add marker to map
      //   new mapboxgl.Marker(el)
      //     .setLngLat([detection.longitude, detection.latitude])
      //     .setPopup(new mapboxgl.Popup().setHTML(`<h3>${formatViolationType(detection.violation_type)}</h3><p>Confidence: ${(detection.confidence * 100).toFixed(1)}%</p>`))
      //     .addTo(map.current);
      // });
      // 
      // // Add navigation controls
      // map.current.addControl(new mapboxgl.NavigationControl());
    }

    // Cleanup function
    return () => {
      if (!SIMULATED_MAP && map.current) {
        map.current.remove();
      }
    };
  }, [currentAnalysis]);

  const handleGenerateReport = () => {
    dispatch(generateReport({ analysisId: id, format: reportFormat }));
  };

  const handleReportFormatChange = (event) => {
    setReportFormat(event.target.value);
  };

  // Helper functions
  const formatViolationType = (type) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSeverityClass = (violationType) => {
    const severityMap = {
      unauthorized_building: 'high',
      deforestation: 'high',
      land_use_change: 'medium',
      waste_dumping: 'high',
      excavation: 'medium',
      crop_change: 'low',
      irrigation_change: 'medium',
      fencing: 'low',
      agricultural_equipment: 'low',
    };
    return severityMap[violationType] || 'medium';
  };

  const getSeverityColor = (severity) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'info',
    };
    return colorMap[severity] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading analysis results...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  if (!currentAnalysis) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">
            No analysis data found. The requested analysis may not exist.
          </Alert>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Analysis Results
          </Typography>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Analysis Summary */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body1" paragraph>
                {currentAnalysis.result.summary}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" color={currentAnalysis.result.violation_count > 0 ? 'error' : 'success'}>
                      {currentAnalysis.result.violation_count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Violations Detected
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4">
                      {currentAnalysis.result.processing_time.toFixed(1)}s
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Processing Time
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4">
                      {new Date(currentAnalysis.upload_time).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Analysis Date
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Image Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Image Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        File Details
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <Info fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Filename"
                            secondary={currentAnalysis.filename}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Article fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Upload Time"
                            secondary={new Date(currentAnalysis.upload_time).toLocaleString()}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Location Information
                      </Typography>
                      {currentAnalysis.result.location ? (
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <LocationOn fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Coordinates"
                              secondary={`${currentAnalysis.result.location.latitude}, ${currentAnalysis.result.location.longitude}`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Info fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Region"
                              secondary={currentAnalysis.result.location.region || 'Unknown'}
                            />
                          </ListItem>
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No location information available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Map View */}
            {currentAnalysis.result.location && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Map View
                </Typography>
                <Paper
                  sx={{
                    height: 400,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: 'grey.200',
                  }}
                >
                  {SIMULATED_MAP ? (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        p: 3,
                      }}
                    >
                      <Info sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="body1" align="center">
                        Map view would display here with markers for each detected violation.
                        (Mapbox API integration required for actual implementation)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        Location: {currentAnalysis.result.location.latitude}, {currentAnalysis.result.location.longitude}
                      </Typography>
                    </Box>
                  ) : (
                    <div ref={mapContainer} style={{ height: '100%' }} />
                  )}
                </Paper>
              </Grid>
            )}

            {/* Detected Violations */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Detected Violations
              </Typography>
              
              {currentAnalysis.result.detections.length > 0 ? (
                <Grid container spacing={2}>
                  {currentAnalysis.result.detections.map((detection, index) => {
                    const severity = getSeverityClass(detection.violation_type);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            borderLeft: 4,
                            borderColor: `${getSeverityColor(severity)}.main`,
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle1">
                                Violation #{index + 1}
                              </Typography>
                              <Chip
                                size="small"
                                label={severity.toUpperCase()}
                                color={getSeverityColor(severity)}
                              />
                            </Box>
                            <Typography variant="h6" gutterBottom>
                              {formatViolationType(detection.violation_type)}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Confidence Score:
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mt: 0.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: '100%',
                                    bgcolor: 'grey.200',
                                    borderRadius: 1,
                                    mr: 1,
                                    height: 8,
                                    position: 'relative',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      bgcolor: `${getSeverityColor(severity)}.main`,
                                      width: `${detection.confidence * 100}%`,
                                      borderRadius: 1,
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2">
                                  {(detection.confidence * 100).toFixed(1)}%
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No violations detected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    The analyzed image appears to be in compliance with regulations.
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Matched Regulations */}
            {currentAnalysis.result.matched_regulations && currentAnalysis.result.matched_regulations.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Relevant Regulations
                </Typography>
                <Grid container spacing={2}>
                  {currentAnalysis.result.matched_regulations.map((regulation, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {regulation.regulation_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {regulation.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Warning
                              sx={{
                                color: getSeverityColor(regulation.severity),
                                mr: 1,
                                fontSize: 20,
                              }}
                            />
                            <Typography variant="body2">
                              <strong>Severity:</strong> {regulation.severity.toUpperCase()}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Recommended Action:</strong> {regulation.recommended_action}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Report Generation */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Generate Report
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <FormControl sx={{ minWidth: 200, mr: 2 }}>
                  <InputLabel id="report-format-label">Report Format</InputLabel>
                  <Select
                    labelId="report-format-label"
                    id="report-format"
                    value={reportFormat}
                    label="Report Format"
                    onChange={handleReportFormatChange}
                    disabled={reportGenerating}
                  >
                    <MenuItem value="pdf">PDF Report</MenuItem>
                    <MenuItem value="geojson">GeoJSON</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={reportGenerating ? <CircularProgress size={20} /> : <Download />}
                  onClick={handleGenerateReport}
                  disabled={reportGenerating}
                >
                  {reportGenerating ? 'Generating...' : 'Download Report'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Analysis;
