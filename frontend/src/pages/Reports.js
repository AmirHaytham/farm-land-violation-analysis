import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Visibility,
  Download,
  Delete,
  Search,
  FilterList,
  Warning,
  Assessment,
  CheckCircle,
} from '@mui/icons-material';

const Reports = () => {
  // In a real application, this data would come from an API
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchReports = async () => {
      // In a real app, we would make an API call here
      setTimeout(() => {
        // Mock data
        const mockReports = Array.from({ length: 35 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const violations = Math.floor(Math.random() * 5);
          const violationTypes = [
            'unauthorized_building',
            'deforestation',
            'land_use_change',
            'waste_dumping',
            'crop_change',
          ];
          
          return {
            id: `report-${i + 1}`,
            filename: `farm_image_${i + 1}.jpg`,
            analysisDate: date.toISOString(),
            violations,
            status: violations > 0 ? 'violation' : 'compliant',
            region: `Region ${(i % 5) + 1}`,
            violationTypes: violations > 0
              ? Array.from({ length: violations }, () => 
                  violationTypes[Math.floor(Math.random() * violationTypes.length)])
              : [],
          };
        });
        
        setReports(mockReports);
        setLoading(false);
      }, 1000);
    };

    fetchReports();
  }, []);

  // Filter and search reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.region.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'violations' && report.status === 'violation') ||
      (filter === 'compliant' && report.status === 'compliant');
      
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedReports = filteredReports.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Calculate summary statistics
  const totalReports = reports.length;
  const totalViolations = reports.reduce((sum, report) => sum + report.violations, 0);
  const complianceRate = Math.round(
    (reports.filter((report) => report.status === 'compliant').length / totalReports) * 100
  );

  // Get violation types distribution
  const violationTypesCount = {};
  reports.forEach((report) => {
    report.violationTypes.forEach((type) => {
      violationTypesCount[type] = (violationTypesCount[type] || 0) + 1;
    });
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analysis Reports
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          View, download, and manage your farmland violation analysis reports.
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Total Reports
                  </Typography>
                  <Assessment color="primary" fontSize="large" />
                </Box>
                <Typography variant="h3" component="div" sx={{ my: 2 }}>
                  {totalReports}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total analyses performed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Violations
                  </Typography>
                  <Warning color="error" fontSize="large" />
                </Box>
                <Typography variant="h3" component="div" sx={{ my: 2 }}>
                  {totalViolations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total violations detected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Compliance Rate
                  </Typography>
                  <CheckCircle color="success" fontSize="large" />
                </Box>
                <Typography variant="h3" component="div" sx={{ my: 2 }}>
                  {complianceRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Percentage of compliant farmland
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by filename or region"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: '200px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel id="filter-label">Filter</InputLabel>
              <Select
                labelId="filter-label"
                id="filter"
                value={filter}
                label="Filter"
                onChange={(e) => setFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Reports</MenuItem>
                <MenuItem value="violations">With Violations</MenuItem>
                <MenuItem value="compliant">Compliant</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Reports Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Report ID</TableCell>
                  <TableCell>Filename</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Violations</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Loading reports...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedReports.length > 0 ? (
                  paginatedReports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>{report.id}</TableCell>
                      <TableCell>{report.filename}</TableCell>
                      <TableCell>
                        {new Date(report.analysisDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{report.region}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.status === 'violation' ? 'Violations' : 'Compliant'}
                          color={report.status === 'violation' ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{
                        report.violations > 0 
                          ? `${report.violations} found`
                          : 'None'
                      }</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton
                              component={RouterLink}
                              to={`/analysis/${report.id}`}
                              size="small"
                              color="primary"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Report">
                            <IconButton size="small" color="secondary">
                              <Download fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        No reports found matching your criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredReports.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={Math.ceil(filteredReports.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Reports;
