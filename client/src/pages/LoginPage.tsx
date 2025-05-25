import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { Container, Box, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Selamat Datang di Wisata Budaya
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Masuk untuk menjelajahi tempat wisata dan event budaya di sekitar Anda
        </Typography>
      </Box>
      <LoginForm />
    </Container>
  );
};

export default LoginPage; 