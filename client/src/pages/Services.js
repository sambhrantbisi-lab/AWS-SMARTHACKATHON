import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import { Search, Phone, Email, LocationOn } from '@mui/icons-material';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'healthcare',
    'education', 
    'employment',
    'housing',
    'legal',
    'transportation',
    'social-services',
    'utilities',
    'emergency'
  ];

  useEffect(() => {
    fetchServices();
  }, [currentPage, selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12
      };
      
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/api/services', { params });
      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchServices();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Public Services Directory
      </Typography>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Services Grid */}
      {loading ? (
        <Typography>Loading services...</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} md={6} lg={4} key={service._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {service.name}
                    </Typography>
                    
                    <Chip
                      label={service.category.replace('-', ' ')}
                      size="small"
                      color="primary"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      {service.department}
                    </Typography>
                    
                    {/* Contact Information */}
                    <Box sx={{ mt: 2 }}>
                      {service.contact.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{service.contact.phone}</Typography>
                        </Box>
                      )}
                      
                      {service.contact.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{service.contact.email}</Typography>
                        </Box>
                      )}
                      
                      {service.contact.address && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {service.contact.address.city}, {service.contact.address.state}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {/* Languages */}
                    {service.languages && service.languages.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Languages: {service.languages.join(', ')}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Accessibility Features */}
                    {service.accessibility && (
                      <Box sx={{ mt: 1 }}>
                        {service.accessibility.wheelchairAccessible && (
                          <Chip label="Wheelchair Accessible" size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                        )}
                        {service.accessibility.signLanguage && (
                          <Chip label="Sign Language" size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Services;