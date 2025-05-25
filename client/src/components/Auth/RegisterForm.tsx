import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Container,
  Alert,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { value: 'budaya', label: 'Budaya' },
  { value: 'sejarah', label: 'Sejarah' },
  { value: 'alam', label: 'Alam' }
];

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handlePreferenceChange = (category: string) => {
    setPreferences(prev => 
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi input
    if (!name || !email || !password) {
      setError('Nama, email dan password harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    try {
      await register(name, email, password, preferences);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Daftar Akun
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nama"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Konfirmasi Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Pilih Preferensi Wisata
            </Typography>
            
            <FormGroup>
              {CATEGORIES.map((category) => (
                <FormControlLabel
                  key={category.value}
                  control={
                    <Checkbox 
                      checked={preferences.includes(category.value)}
                      onChange={() => handlePreferenceChange(category.value)}
                    />
                  }
                  label={category.label}
                />
              ))}
            </FormGroup>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Daftar
          </Button>
          
          <Box textAlign="center">
            <Typography variant="body2">
              Sudah punya akun?{' '}
              <Button
                onClick={() => navigate('/login')}
                sx={{ p: 0, textTransform: 'none' }}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm; 