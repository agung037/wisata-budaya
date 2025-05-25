import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import { Container, Box, Typography } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Buat Akun Wisata Budaya
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Daftar untuk mendapatkan rekomendasi tempat wisata dan event budaya yang sesuai dengan preferensi Anda
        </Typography>
      </Box>
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage; 