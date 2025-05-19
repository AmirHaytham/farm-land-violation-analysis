import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Made with <3 by Amir Haytham '}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="#">
            Privacy Policy
          </Link>
          {' | '}
          <Link color="inherit" href="#">
            Terms of Service
          </Link>
          {' | '}
          <Link color="inherit" href="#">
            Contact Us
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
