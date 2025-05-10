import React, { useEffect } from 'react';
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
} from '@mui/material';
import {
  CloudUpload,
  Assessment,
  Warning,
  CheckCircle,
  Info,
  ArrowForward,
} from '@mui/icons-material';
import { getRecentAnalyses } from '../store/slices/analysisSlice';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { recentAnalyses, loading } = useSelector((state) => state.analysis);

  useEffect(() => {
    dispatch(getRecentAnalyses());
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
