import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Chip,
  LinearProgress,
  Stack,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  CloudUpload,
  Assessment,
  Warning,
  CheckCircle,
  Info,
  ArrowForward,
  Gavel,
  Title as TitleIcon,
  PublishedWithChanges,
  LocationOn,
  CalendarMonth,
} from '@mui/icons-material';
import { getRecentAnalyses } from '../store/slices/analysisSlice';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { recentAnalyses, loading } = useSelector((state) => state.analysis);
  
  // State for land acquisition data
  const [acquisitionData, setAcquisitionData] = useState([]);
  const [acquisitionLoading, setAcquisitionLoading] = useState(true);

  useEffect(() => {
    dispatch(getRecentAnalyses());
    
    // Simulate fetching land acquisition data
    setTimeout(() => {
      setAcquisitionData(mockLandAcquisitions);
      setAcquisitionLoading(false);
    }, 1000);
  }, [dispatch]);

  // Mock statistics data for the dashboard
  const violationStats = {
    total_analyses: 157,
    total_violations: 89,
    violation_types: {
      unauthorized_building: 23,
      deforestation: 18,
      land_use_change: 31,
      waste_dumping: 12,
      other: 5,
    },
    compliance_rate: 43.3,
  };
  
  // Mock data for government land acquisitions
  const mockLandAcquisitions = [
    {
      id: 'acq-001',
      parcelId: 'F28-74-92',
      location: 'North Valley Agricultural Zone',
      area: 24.5, // hectares
      purpose: 'Infrastructure Development - Water Treatment Facility',
      status: 'Under Review',
      progressPercentage: 30,
      startDate: '2025-03-15',
      estimatedCompletionDate: '2025-07-30',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: true,
      finalApproval: false,
      transferComplete: false,
    },
    {
      id: 'acq-002',
      parcelId: 'F12-38-45',
      location: 'Eastern Highland Farms',
      area: 18.2, // hectares
      purpose: 'Protected Conservation Area Expansion',
      status: 'Approved',
      progressPercentage: 80,
      startDate: '2025-01-20',
      estimatedCompletionDate: '2025-06-15',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: true,
      finalApproval: true,
      transferComplete: false,
    },
    {
      id: 'acq-003',
      parcelId: 'F43-22-88',
      location: 'South River Agricultural District',
      area: 32.7, // hectares
      purpose: 'Renewable Energy Project - Solar Farm',
      status: 'Pending Owner Response',
      progressPercentage: 40,
      startDate: '2025-04-05',
      estimatedCompletionDate: '2025-09-10',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: false,
      finalApproval: false,
      transferComplete: false,
    },
  ];
  
  // Helper function to get status chip color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Under Review': return 'primary';
      case 'Approved': return 'success';
      case 'Pending Owner Response': return 'warning';
      case 'Completed': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  // Prepare chart data
  const pieChartData = {
    labels: [
      'Unauthorized Buildings',
      'Deforestation',
      'Land Use Change',
      'Waste Dumping',
      'Other',
    ],
    datasets: [
      {
        data: [
          violationStats.violation_types.unauthorized_building,
          violationStats.violation_types.deforestation,
          violationStats.violation_types.land_use_change,
          violationStats.violation_types.waste_dumping,
          violationStats.violation_types.other,
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF4394',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  // Mock time series data
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Violations Detected',
        data: [12, 19, 15, 27, 16],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Analyses Performed',
        data: [19, 28, 22, 45, 43],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Activity',
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Welcome to Farm Land Violation Analysis System. Monitor and detect violations on agricultural land.
        </Typography>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={RouterLink}
                    to="/upload"
                    startIcon={<CloudUpload />}
                    sx={{ py: 1.5 }}
                  >
                    Upload Image
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    component={RouterLink}
                    to="/reports"
                    startIcon={<Assessment />}
                    sx={{ py: 1.5 }}
                  >
                    View Reports
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Summary Statistics */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1,
                    }}
                  >
                    <Typography variant="h3" color="primary">
                      {violationStats.total_analyses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Analyses
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1,
                    }}
                  >
                    <Typography variant="h3" color="error">
                      {violationStats.total_violations}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Violations Detected
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts and Recent Analysis */}
        <Grid container spacing={3}>
          {/* Violation Type Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Violation Types
              </Typography>
              <Box sx={{ height: 300, mt: 1 }}>
                <Pie data={pieChartData} />
              </Box>
            </Paper>
          </Grid>

          {/* Trend Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Violation Trends
              </Typography>
              <Box sx={{ height: 300, mt: 1 }}>
                <Bar options={barChartOptions} data={barChartData} />
              </Box>
            </Paper>
          </Grid>

          {/* Government Land Acquisition */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" display="flex" alignItems="center">
                  <Gavel sx={{ mr: 1 }} />
                  Government Land Acquisition Monitoring
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<TitleIcon />}
                  component={RouterLink}
                  to="/acquisitions"
                >
                  View All Acquisitions
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {acquisitionLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography>Loading land acquisition data...</Typography>
                </Box>
              ) : acquisitionData.length > 0 ? (
                <Grid container spacing={3}>
                  {acquisitionData.map((acquisition) => (
                    <Grid item xs={12} md={4} key={acquisition.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Parcel: {acquisition.parcelId}
                            </Typography>
                            <Chip 
                              label={acquisition.status} 
                              color={getStatusColor(acquisition.status)}
                              size="small"
                            />
                          </Stack>
                          
                          <Box sx={{ mt: 1, mb: 2 }}>
                            <MuiTooltip title={`Progress: ${acquisition.progressPercentage}%`}>
                              <LinearProgress 
                                variant="determinate" 
                                value={acquisition.progressPercentage} 
                                sx={{ height: 8, borderRadius: 5 }}
                              />
                            </MuiTooltip>
                          </Box>
                          
                          <Stack spacing={1}>
                            <Box display="flex" alignItems="center">
                              <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" noWrap>
                                {acquisition.location}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary">
                              <strong>Area:</strong> {acquisition.area} hectares
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary">
                              <strong>Purpose:</strong> {acquisition.purpose}
                            </Typography>
                            
                            <Box display="flex" alignItems="center">
                              <CalendarMonth fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Started: {new Date(acquisition.startDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Stack>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Acquisition Process:
                          </Typography>
                          
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                              size="small" 
                              label="Owner Notified" 
                              color={acquisition.ownerNotified ? 'success' : 'default'}
                              variant={acquisition.ownerNotified ? 'filled' : 'outlined'}
                            />
                            <Chip 
                              size="small" 
                              label="Compensation" 
                              color={acquisition.compensationOffered ? 'success' : 'default'}
                              variant={acquisition.compensationOffered ? 'filled' : 'outlined'}
                            />
                            <Chip 
                              size="small" 
                              label="Public Hearing" 
                              color={acquisition.publicHearingScheduled ? 'success' : 'default'}
                              variant={acquisition.publicHearingScheduled ? 'filled' : 'outlined'}
                            />
                            <Chip 
                              size="small" 
                              label="Final Approval" 
                              color={acquisition.finalApproval ? 'success' : 'default'}
                              variant={acquisition.finalApproval ? 'filled' : 'outlined'}
                            />
                            <Chip 
                              size="small" 
                              label="Transfer Complete" 
                              color={acquisition.transferComplete ? 'success' : 'default'}
                              variant={acquisition.transferComplete ? 'filled' : 'outlined'}
                            />
                          </Stack>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            startIcon={<PublishedWithChanges />}
                            fullWidth
                          >
                            View Acquisition Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Info color="info" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="body1">
                    No land acquisition records found in your region.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Recent Analyses */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Analyses
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : recentAnalyses.length > 0 ? (
                <Grid container spacing={2}>
                  {recentAnalyses.map((analysis) => (
                    <Grid item xs={12} sm={6} md={4} key={analysis.id}>
                      <Card raised={false} sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {analysis.filename}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(analysis.upload_time).toLocaleString()}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            {analysis.result.violation_count > 0 ? (
                              <Warning color="error" sx={{ mr: 1 }} />
                            ) : (
                              <CheckCircle color="success" sx={{ mr: 1 }} />
                            )}
                            <Typography variant="body2">
                              {analysis.result.violation_count} violations found
                            </Typography>
                          </Box>
                          <Typography variant="body2" noWrap>
                            {analysis.result.summary}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            component={RouterLink}
                            to={`/analysis/${analysis.id}`}
                            endIcon={<ArrowForward />}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Info color="info" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="body1">
                    No recent analyses found. Upload an image to start detecting violations.
                  </Typography>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/upload"
                    sx={{ mt: 2 }}
                    startIcon={<CloudUpload />}
                  >
                    Upload Image
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
