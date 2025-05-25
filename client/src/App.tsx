import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './App.css';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import EventsPage from './pages/EventsPage';
import PostsPage from './pages/PostsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? <>{element}</> : <Navigate to="/login" />;
};

// Guest Route Component (redirects to profile if logged in)
const GuestRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const token = localStorage.getItem('token');
  return !token ? <>{element}</> : <Navigate to="/profile" />;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<GuestRoute element={<LoginPage />} />} />
            <Route path="/register" element={<GuestRoute element={<RegisterPage />} />} />
            
            {/* Main Layout Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/profile" element={<ProtectedRoute element={<MainLayout><div>Profile Page</div></MainLayout>} />} />
            <Route path="/map" element={<MainLayout><MapPage /></MainLayout>} />
            <Route path="/events" element={<MainLayout><EventsPage /></MainLayout>} />
            <Route path="/posts" element={<MainLayout><PostsPage /></MainLayout>} />
            <Route path="/bookmarks" element={<ProtectedRoute element={<MainLayout><div>Bookmarks Page</div></MainLayout>} />} />
            
            {/* Fallback */}
            <Route path="*" element={<MainLayout><div>Not Found</div></MainLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
