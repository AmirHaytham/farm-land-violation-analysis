import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  CalendarMonth,
  Gavel,
  AttachMoney,
  Apartment,
  Description,
  AccountBalance,
  AssignmentInd,
  EventNote,
  Straighten,
  CheckCircle,
  PendingActions,
  Category,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`acquisition-tabpanel-${index}`}
      aria-labelledby={`acquisition-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// a11y props for tabs
function a11yProps(index) {
  return {
    id: `acquisition-tab-${index}`,
    'aria-controls': `acquisition-tabpanel-${index}`,
  };
}

const AcquisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [acquisition, setAcquisition] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mock acquisition data - in a real app, this would come from an API
  const mockAcquisitions = [
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
      ownerName: 'John Farmer',
      ownerContact: 'john.farmer@email.com',
      currentLandUse: 'Agricultural - Crop Farming',
      compensationAmount: '$248,500',
      publicHearingDate: '2025-04-28',
      impactAssessment: 'Minimal environmental impact. Water treatment facility will improve local water quality.',
      nearbyProperties: [
        {id: 'F28-74-91', owner: 'Sarah Johnson', status: 'Not Affected'},
        {id: 'F28-74-93', owner: 'Michael Davis', status: 'Partial Access Needed'},
        {id: 'F28-75-01', owner: 'Emily Wilson', status: 'Not Affected'},
      ],
      documents: [
        {id: 'doc-001', name: 'Initial Assessment Report', date: '2025-03-15', type: 'PDF'},
        {id: 'doc-002', name: 'Environmental Impact Study', date: '2025-03-30', type: 'PDF'},
        {id: 'doc-003', name: 'Compensation Calculation', date: '2025-04-05', type: 'XLSX'},
        {id: 'doc-004', name: 'Public Hearing Notification', date: '2025-04-12', type: 'PDF'},
      ],
      timeline: [
        {date: '2025-03-15', event: 'Acquisition process initiated', status: 'Completed'},
        {date: '2025-03-18', event: 'Owner notification sent', status: 'Completed'},
        {date: '2025-03-30', event: 'Environmental assessment completed', status: 'Completed'},
        {date: '2025-04-05', event: 'Compensation offer made', status: 'Completed'},
        {date: '2025-04-12', event: 'Public hearing scheduled', status: 'Completed'},
        {date: '2025-04-28', event: 'Public hearing to be held', status: 'Pending'},
        {date: '2025-05-15', event: 'Final decision', status: 'Pending'},
        {date: '2025-06-01', event: 'Land transfer', status: 'Pending'},
        {date: '2025-07-30', event: 'Project completion', status: 'Pending'},
      ],
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
      ownerName: 'Maria Rodriguez',
      ownerContact: 'maria.rodriguez@email.com',
      currentLandUse: 'Agricultural - Mixed Use',
      compensationAmount: '$176,800',
      publicHearingDate: '2025-02-15',
      impactAssessment: 'Positive environmental impact. Conservation area will protect local wildlife and watershed.',
      nearbyProperties: [
        {id: 'F12-38-44', owner: 'Robert Brown', status: 'Not Affected'},
        {id: 'F12-39-01', owner: 'Karen Smith', status: 'Not Affected'},
      ],
      documents: [
        {id: 'doc-101', name: 'Conservation Assessment', date: '2025-01-25', type: 'PDF'},
        {id: 'doc-102', name: 'Biodiversity Report', date: '2025-02-10', type: 'PDF'},
        {id: 'doc-103', name: 'Compensation Agreement', date: '2025-03-01', type: 'PDF'},
        {id: 'doc-104', name: 'Final Approval Document', date: '2025-04-10', type: 'PDF'},
      ],
      timeline: [
        {date: '2025-01-20', event: 'Acquisition process initiated', status: 'Completed'},
        {date: '2025-01-23', event: 'Owner notification sent', status: 'Completed'},
        {date: '2025-02-01', event: 'Environmental assessment completed', status: 'Completed'},
        {date: '2025-02-10', event: 'Compensation offer made', status: 'Completed'},
        {date: '2025-02-15', event: 'Public hearing held', status: 'Completed'},
        {date: '2025-03-20', event: 'Final approval granted', status: 'Completed'},
        {date: '2025-05-15', event: 'Land transfer', status: 'Pending'},
        {date: '2025-06-15', event: 'Conservation project completion', status: 'Pending'},
      ],
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
      ownerName: 'David Chen',
      ownerContact: 'david.chen@email.com',
      currentLandUse: 'Agricultural - Livestock Grazing',
      compensationAmount: '$350,400',
      publicHearingDate: 'Not yet scheduled',
      impactAssessment: 'Moderate environmental change. Solar farm will reduce carbon emissions but change land use patterns.',
      nearbyProperties: [
        {id: 'F43-22-87', owner: 'Thomas Wilson', status: 'Not Affected'},
        {id: 'F43-22-89', owner: 'Sandra Lee', status: 'Access Road Needed'},
        {id: 'F43-23-01', owner: 'James Taylor', status: 'Not Affected'},
      ],
      documents: [
        {id: 'doc-201', name: 'Initial Assessment Report', date: '2025-04-10', type: 'PDF'},
        {id: 'doc-202', name: 'Energy Production Estimate', date: '2025-04-18', type: 'PDF'},
        {id: 'doc-203', name: 'Compensation Offer', date: '2025-04-25', type: 'PDF'},
      ],
      timeline: [
        {date: '2025-04-05', event: 'Acquisition process initiated', status: 'Completed'},
        {date: '2025-04-08', event: 'Owner notification sent', status: 'Completed'},
        {date: '2025-04-20', event: 'Environmental assessment completed', status: 'Completed'},
        {date: '2025-04-25', event: 'Compensation offer made', status: 'Completed'},
        {date: '2025-05-10', event: 'Awaiting owner response', status: 'In Progress'},
        {date: '2025-06-01', event: 'Public hearing', status: 'Pending'},
        {date: '2025-07-15', event: 'Final decision', status: 'Pending'},
        {date: '2025-08-01', event: 'Land transfer', status: 'Pending'},
        {date: '2025-09-10', event: 'Project completion', status: 'Pending'},
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch acquisition details
    const fetchAcquisition = () => {
      setLoading(true);
      setTimeout(() => {
        const found = mockAcquisitions.find(acq => acq.id === id);
        if (found) {
          setAcquisition(found);
        } else {
          // Handle not found case
          console.error('Acquisition not found');
        }
        setLoading(false);
      }, 800);
    };

    fetchAcquisition();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Helper function to get status chip color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Under Review': return 'primary';
      case 'Approved': return 'success';
      case 'Pending Owner Response': return 'warning';
      case 'Completed': return 'success';
      case 'Rejected': return 'error';
      case 'In Progress': return 'info';
      case 'Pending': return 'default';
      default: return 'default';
    }
  };

  // Calculate current step in acquisition process
  const getActiveStep = (acquisition) => {
    if (!acquisition) return 0;
    
    if (acquisition.transferComplete) return 4;
    if (acquisition.finalApproval) return 3;
    if (acquisition.publicHearingScheduled) return 2;
    if (acquisition.compensationOffered) return 1;
    if (acquisition.ownerNotified) return 0;
    return 0;
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!acquisition) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" color="error">Acquisition not found</Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard')}
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
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
          >
            Dashboard
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/acquisitions'); }}
          >
            Land Acquisitions
          </Link>
          <Typography color="text.primary">{acquisition.parcelId}</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Land Acquisition: {acquisition.parcelId}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                {acquisition.location}
              </Box>
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Box>

        {/* Status and Progress */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>Status:</Typography>
                <Chip
                  label={acquisition.status}
                  color={getStatusColor(acquisition.status)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">{acquisition.progressPercentage}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={acquisition.progressPercentage}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Acquisition Process Stepper */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Acquisition Process
          </Typography>
          <Stepper activeStep={getActiveStep(acquisition)} alternativeLabel sx={{ mt: 3 }}>
            <Step>
              <StepLabel>Owner Notified</StepLabel>
            </Step>
            <Step>
              <StepLabel>Compensation Offered</StepLabel>
            </Step>
            <Step>
              <StepLabel>Public Hearing</StepLabel>
            </Step>
            <Step>
              <StepLabel>Final Approval</StepLabel>
            </Step>
            <Step>
              <StepLabel>Transfer Complete</StepLabel>
            </Step>
          </Stepper>
        </Paper>

        {/* Tabs for additional information */}
        <Paper sx={{ borderRadius: 2, mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="acquisition details tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Overview" icon={<Description />} iconPosition="start" {...a11yProps(0)} />
              <Tab label="Property Details" icon={<Apartment />} iconPosition="start" {...a11yProps(1)} />
              <Tab label="Compensation" icon={<AttachMoney />} iconPosition="start" {...a11yProps(2)} />
              <Tab label="Timeline" icon={<EventNote />} iconPosition="start" {...a11yProps(3)} />
              <Tab label="Documents" icon={<Description />} iconPosition="start" {...a11yProps(4)} />
              <Tab label="Nearby Properties" icon={<LocationOn />} iconPosition="start" {...a11yProps(5)} />
            </Tabs>
          </Box>
          
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Purpose
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {acquisition.purpose}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom>
                      <PendingActions sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Timeline
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Start Date:</Typography>
                        <Typography variant="body1">
                          {new Date(acquisition.startDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Estimated Completion:</Typography>
                        <Typography variant="body1">
                          {new Date(acquisition.estimatedCompletionDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                      <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Public Hearing
                    </Typography>
                    <Typography variant="body1">
                      {typeof acquisition.publicHearingDate === 'string' && 
                       acquisition.publicHearingDate !== 'Not yet scheduled' ? 
                        new Date(acquisition.publicHearingDate).toLocaleDateString() : 
                        acquisition.publicHearingDate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <AssignmentInd sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Owner Information
                    </Typography>
                    <Typography variant="body1">{acquisition.ownerName}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {acquisition.ownerContact}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom>
                      <Straighten sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Property Specifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Current Land Use:</Typography>
                    <Typography variant="body1" paragraph>
                      {acquisition.currentLandUse}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">Total Area:</Typography>
                    <Typography variant="body1" paragraph>
                      {acquisition.area} hectares
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom>
                      <Gavel sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Impact Assessment
                    </Typography>
                    <Typography variant="body1">
                      {acquisition.impactAssessment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Property Details Tab */}
          <TabPanel value={tabValue} index={1}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Property Information</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">Parcel ID</TableCell>
                            <TableCell>{acquisition.parcelId}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Location</TableCell>
                            <TableCell>{acquisition.location}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Total Area</TableCell>
                            <TableCell>{acquisition.area} hectares</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Current Land Use</TableCell>
                            <TableCell>{acquisition.currentLandUse}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Owner Information</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">Owner Name</TableCell>
                            <TableCell>{acquisition.ownerName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Contact</TableCell>
                            <TableCell>{acquisition.ownerContact}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Owner Notified</TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label={acquisition.ownerNotified ? "Yes" : "No"} 
                                color={acquisition.ownerNotified ? "success" : "default"}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
          
          {/* Compensation Tab */}
          <TabPanel value={tabValue} index={2}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Compensation Details</Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">Compensation Amount</TableCell>
                        <TableCell>{acquisition.compensationAmount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Offer Made</TableCell>
                        <TableCell>
                          <Chip 
                            label={acquisition.compensationOffered ? "Yes" : "No"} 
                            color={acquisition.compensationOffered ? "success" : "default"}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Land Value per Hectare</TableCell>
                        <TableCell>
                          {acquisition.compensationAmount ? 
                            `$${Math.round(parseFloat(acquisition.compensationAmount.replace(/[^0-9.]/g, '')) / acquisition.area).toLocaleString()}` : 
                            'Not calculated'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>
          
          {/* Timeline Tab */}
          <TabPanel value={tabValue} index={3}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acquisition.timeline.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.event}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={item.status} 
                          color={getStatusColor(item.status)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          {/* Documents Tab */}
          <TabPanel value={tabValue} index={4}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acquisition.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>{new Date(doc.date).toLocaleDateString()}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          {/* Nearby Properties Tab */}
          <TabPanel value={tabValue} index={5}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Parcel ID</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acquisition.nearbyProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.id}</TableCell>
                      <TableCell>{property.owner}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={property.status} 
                          color={property.status === 'Not Affected' ? 'success' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Edit Details
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AcquisitionDetail;
