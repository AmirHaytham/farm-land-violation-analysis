import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  InputAdornment,
  Tooltip,
  Pagination,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  CalendarMonth,
  Gavel,
  Add,
  Clear,
  ArrowForward,
  Sort,
  CloudDownload,
} from '@mui/icons-material';

const LandAcquisitions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [acquisitions, setAcquisitions] = useState([]);
  const [filteredAcquisitions, setFilteredAcquisitions] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  
  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    purposeType: '',
    dateRange: '',
    areaRange: '',
    sortBy: 'startDate_desc'
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Mock acquisition data
  const mockAcquisitions = [
    {
      id: 'acq-001',
      parcelId: 'F28-74-92',
      location: 'North Valley Agricultural Zone',
      area: 24.5, // hectares
      purpose: 'Infrastructure Development - Water Treatment Facility',
      purposeType: 'infrastructure',
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
      purposeType: 'conservation',
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
      purposeType: 'energy',
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
    {
      id: 'acq-004',
      parcelId: 'F35-61-23',
      location: 'Western Plains Agricultural Area',
      area: 15.8, // hectares
      purpose: 'Road Infrastructure - Highway Extension',
      purposeType: 'infrastructure',
      status: 'Under Review',
      progressPercentage: 25,
      startDate: '2025-02-28',
      estimatedCompletionDate: '2025-08-15',
      ownerNotified: true,
      compensationOffered: false,
      publicHearingScheduled: false,
      finalApproval: false,
      transferComplete: false,
    },
    {
      id: 'acq-005',
      parcelId: 'F19-43-76',
      location: 'Northridge Farming Community',
      area: 22.3, // hectares
      purpose: 'Public Recreation Area',
      purposeType: 'public',
      status: 'Approved',
      progressPercentage: 70,
      startDate: '2024-11-10',
      estimatedCompletionDate: '2025-05-20',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: true,
      finalApproval: true,
      transferComplete: false,
    },
    {
      id: 'acq-006',
      parcelId: 'F52-18-94',
      location: 'Southeast Valley Farms',
      area: 42.1, // hectares
      purpose: 'Renewable Energy Project - Wind Farm',
      purposeType: 'energy',
      status: 'Completed',
      progressPercentage: 100,
      startDate: '2024-08-15',
      estimatedCompletionDate: '2025-03-01',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: true,
      finalApproval: true,
      transferComplete: true,
    },
    {
      id: 'acq-007',
      parcelId: 'F38-29-65',
      location: 'Central Plains Agricultural Zone',
      area: 28.6, // hectares
      purpose: 'Water Conservation Project',
      purposeType: 'conservation',
      status: 'Rejected',
      progressPercentage: 0,
      startDate: '2025-01-05',
      estimatedCompletionDate: '2025-06-30',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: true,
      finalApproval: false,
      transferComplete: false,
    },
    {
      id: 'acq-008',
      parcelId: 'F27-83-49',
      location: 'Northern Watershed Agricultural Area',
      area: 36.4, // hectares
      purpose: 'Dam Construction Project',
      purposeType: 'infrastructure',
      status: 'Under Review',
      progressPercentage: 45,
      startDate: '2025-03-20',
      estimatedCompletionDate: '2025-10-15',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: false,
      finalApproval: false,
      transferComplete: false,
    },
    {
      id: 'acq-009',
      parcelId: 'F14-57-82',
      location: 'Southwest Farmlands',
      area: 19.7, // hectares
      purpose: 'Educational Facility - Agricultural Research Center',
      purposeType: 'public',
      status: 'Pending Owner Response',
      progressPercentage: 35,
      startDate: '2025-02-10',
      estimatedCompletionDate: '2025-07-25',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: false,
      finalApproval: false,
      transferComplete: false,
    },
    {
      id: 'acq-010',
      parcelId: 'F63-91-37',
      location: 'Eastern Irrigation District',
      area: 31.2, // hectares
      purpose: 'Irrigation Canal Expansion',
      purposeType: 'infrastructure',
      status: 'Approved',
      progressPercentage: 60,
      startDate: '2024-12-05',
      estimatedCompletionDate: '2025-06-10',
      ownerNotified: true,
      compensationOffered: true,
      publicHearingScheduled: true,
      finalApproval: true,
      transferComplete: false,
    },
    {
      id: 'acq-011',
      parcelId: 'F48-26-73',
      location: 'Northwest Agricultural Region',
      area: 27.5, // hectares
      purpose: 'Biodiversity Conservation Area',
      purposeType: 'conservation',
      status: 'Pending Owner Response',
      progressPercentage: 20,
      startDate: '2025-04-15',
      estimatedCompletionDate: '2025-09-30',
      ownerNotified: true,
      compensationOffered: false,
      publicHearingScheduled: false,
      finalApproval: false,
      transferComplete: false,
    },
    {
      id: 'acq-012',
      parcelId: 'F71-39-54',
      location: 'Southern Farming Community',
      area: 23.8, // hectares
      purpose: 'Solar Energy Storage Facility',
      purposeType: 'energy',
      status: 'Under Review',
      progressPercentage: 15,
      startDate: '2025-03-25',
      estimatedCompletionDate: '2025-08-20',
      ownerNotified: true,
      compensationOffered: false,
      publicHearingScheduled: false,
      finalApproval: false,
      transferComplete: false,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchAcquisitions = () => {
      setLoading(true);
      setTimeout(() => {
        setAcquisitions(mockAcquisitions);
        setFilteredAcquisitions(mockAcquisitions);
        setLoading(false);
      }, 800);
    };

    fetchAcquisitions();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter state changes
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let result = [...acquisitions];

    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        acq => acq.parcelId.toLowerCase().includes(searchLower) ||
              acq.location.toLowerCase().includes(searchLower) ||
              acq.purpose.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(acq => acq.status === filters.status);
    }

    // Apply purpose type filter
    if (filters.purposeType) {
      result = result.filter(acq => acq.purposeType === filters.purposeType);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const currentDate = new Date();
      const pastDate = new Date();

      switch (filters.dateRange) {
        case 'last30days':
          pastDate.setDate(currentDate.getDate() - 30);
          result = result.filter(acq => new Date(acq.startDate) >= pastDate);
          break;
        case 'last90days':
          pastDate.setDate(currentDate.getDate() - 90);
          result = result.filter(acq => new Date(acq.startDate) >= pastDate);
          break;
        case 'last6months':
          pastDate.setMonth(currentDate.getMonth() - 6);
          result = result.filter(acq => new Date(acq.startDate) >= pastDate);
          break;
        case 'lastyear':
          pastDate.setFullYear(currentDate.getFullYear() - 1);
          result = result.filter(acq => new Date(acq.startDate) >= pastDate);
          break;
        default:
          break;
      }
    }

    // Apply area range filter
    if (filters.areaRange) {
      switch (filters.areaRange) {
        case 'small':
          result = result.filter(acq => acq.area < 20);
          break;
        case 'medium':
          result = result.filter(acq => acq.area >= 20 && acq.area < 30);
          break;
        case 'large':
          result = result.filter(acq => acq.area >= 30);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    if (filters.sortBy) {
      const [field, direction] = filters.sortBy.split('_');
      result.sort((a, b) => {
        let comparison = 0;
        if (field === 'startDate') {
          comparison = new Date(a.startDate) - new Date(b.startDate);
        } else if (field === 'area') {
          comparison = a.area - b.area;
        } else if (field === 'progress') {
          comparison = a.progressPercentage - b.progressPercentage;
        }
        return direction === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredAcquisitions(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      status: '',
      purposeType: '',
      dateRange: '',
      areaRange: '',
      sortBy: 'startDate_desc'
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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

  // Get current items for pagination
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAcquisitions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Land Acquisitions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {}}
          >
            New Acquisition
          </Button>
        </Box>

        {/* Search and Filter Bar */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by parcel ID, location, or purpose"
                variant="outlined"
                size="small"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: filters.searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setFilters({...filters, searchTerm: ''})}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  name="sortBy"
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={handleFilterChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Sort fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="startDate_desc">Date (Newest First)</MenuItem>
                  <MenuItem value="startDate_asc">Date (Oldest First)</MenuItem>
                  <MenuItem value="area_desc">Area (Largest First)</MenuItem>
                  <MenuItem value="area_asc">Area (Smallest First)</MenuItem>
                  <MenuItem value="progress_desc">Progress (Highest First)</MenuItem>
                  <MenuItem value="progress_asc">Progress (Lowest First)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant={showFilters ? "contained" : "outlined"}
                color="primary"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {filteredAcquisitions.length !== acquisitions.length && `(${filteredAcquisitions.length}/${acquisitions.length})`}
              </Button>
              {showFilters && (
                <Tooltip title="Reset Filters">
                  <IconButton onClick={resetFilters} sx={{ ml: 1 }}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={filters.status}
                      label="Status"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
                      <MenuItem value="Pending Owner Response">Pending Owner Response</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="purpose-label">Purpose</InputLabel>
                    <Select
                      labelId="purpose-label"
                      name="purposeType"
                      value={filters.purposeType}
                      label="Purpose"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Purposes</MenuItem>
                      <MenuItem value="infrastructure">Infrastructure</MenuItem>
                      <MenuItem value="conservation">Conservation</MenuItem>
                      <MenuItem value="energy">Renewable Energy</MenuItem>
                      <MenuItem value="public">Public Facilities</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="date-label">Date Range</InputLabel>
                    <Select
                      labelId="date-label"
                      name="dateRange"
                      value={filters.dateRange}
                      label="Date Range"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Time</MenuItem>
                      <MenuItem value="last30days">Last 30 Days</MenuItem>
                      <MenuItem value="last90days">Last 90 Days</MenuItem>
                      <MenuItem value="last6months">Last 6 Months</MenuItem>
                      <MenuItem value="lastyear">Last Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="area-label">Area Size</InputLabel>
                    <Select
                      labelId="area-label"
                      name="areaRange"
                      value={filters.areaRange}
                      label="Area Size"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Sizes</MenuItem>
                      <MenuItem value="small">Small (&lt; 20 hectares)</MenuItem>
                      <MenuItem value="medium">Medium (20-30 hectares)</MenuItem>
                      <MenuItem value="large">Large (&gt; 30 hectares)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Results */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredAcquisitions.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {currentItems.map((acquisition) => (
                <Grid item xs={12} sm={6} md={4} key={acquisition.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {acquisition.parcelId}
                        </Typography>
                        <Chip
                          label={acquisition.status}
                          color={getStatusColor(acquisition.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={acquisition.progressPercentage}
                          sx={{ height: 6, borderRadius: 5, mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Progress: {acquisition.progressPercentage}%
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                        {acquisition.location}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        <strong>Purpose:</strong> {acquisition.purpose}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                        Start: {new Date(acquisition.startDate).toLocaleDateString()}
                      </Typography>
                      
                      <Typography variant="body2">
                        <strong>Area:</strong> {acquisition.area} hectares
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(`/acquisition/${acquisition.id}`)}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredAcquisitions.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              No acquisitions found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              No land acquisitions match your current filters.
            </Typography>
            <Button variant="outlined" startIcon={<Clear />} onClick={resetFilters}>
              Clear Filters
            </Button>
          </Paper>
        )}
        
        {/* Export Button */}
        {filteredAcquisitions.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<CloudDownload />}
              onClick={() => {}}
            >
              Export Data
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LandAcquisitions;
