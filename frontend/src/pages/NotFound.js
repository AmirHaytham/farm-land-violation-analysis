import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%', textAlign: 'center' }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: '5rem', fontWeight: 'bold', color: 'primary.main' }}>
            404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you are looking for doesn't exist or has been moved.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/"
              startIcon={<Home />}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              component={RouterLink}
              to="-1"
              startIcon={<ArrowBack />}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
