import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Profile = () => {
  const { user } = useAuth();
  const { settings, updateSetting } = useAccessibility();
  const [saved, setSaved] = useState(false);

  const handleAccessibilityChange = (setting) => (event) => {
    updateSetting(setting, event.target.checked);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Name:</strong> {user?.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {user?.email}
        </Typography>
        {user?.location && (
          <Typography variant="body1">
            <strong>Location:</strong> {user.location.city}, {user.location.state}
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Accessibility Settings
        </Typography>
        
        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Settings saved successfully!
          </Alert>
        )}
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.highContrast}
              onChange={handleAccessibilityChange('highContrast')}
            />
          }
          label="High Contrast Mode"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.largeText}
              onChange={handleAccessibilityChange('largeText')}
            />
          }
          label="Large Text"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.screenReader}
              onChange={handleAccessibilityChange('screenReader')}
            />
          }
          label="Screen Reader Support"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.reducedMotion}
              onChange={handleAccessibilityChange('reducedMotion')}
            />
          }
          label="Reduced Motion"
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary">
          These settings help make the application more accessible. Changes are saved automatically.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;