import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();

  // Set theme data attribute on document root for CSS targeting
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <div>Loading...</div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'background.default',
      transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/services" element={<Services />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AccessibilityProvider>
          <AppContent />
        </AccessibilityProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;