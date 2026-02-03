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
  Pagination,
  Container,
  useTheme,
  alpha,
  Skeleton,
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  Search, 
  Phone, 
  Email, 
  LocationOn, 
  Language,
  AccessibilityNew,
  Schedule,
  FilterList
} from '@mui/icons-material';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();

  const categories = [
    { value: 'healthcare', label: 'Healthcare', color: theme.palette.error.main },
    { value: 'education', label: 'Education', color: theme.palette.info.main },
    { value: 'employment', label: 'Employment', color: theme.palette.success.main },
    { value: 'housing', label: 'Housing', color: theme.palette.warning.main },
    { value: 'legal', label: 'Legal Aid', color: theme.palette.secondary.main },
    { value: 'transportation', label: 'Transportation', color: '#ff6b35' },
    { value: 'social-services', label: 'Social Services', color: '#9c27b0' },
    { value: 'utilities', label: 'Utilities', color: '#607d8b' },
    { value: 'emergency', label: 'Emergency Services', color: '#f44336' }
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

  const getCategoryColor = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.color : theme.palette.primary.main;
  };

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1).replace('-', ' ');
  };

  const ServiceSkeleton = () => (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="rectangular" width={100} height={24} sx={{ my: 2, borderRadius: 1 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="55%" height={16} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3rem' },
            mb: 2
          }}
        >
          Public Services Directory
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Discover and connect with essential public services in your community
        </Typography>
      </Box>
      
      {/* Search and Filters */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: theme.shadows[1]
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Search & Filter Services
            </Typography>
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search services, departments, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
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
                  sx={{
                    borderRadius: 2
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: category.color,
                            mr: 1.5
                          }}
                        />
                        {category.label}
                      </Box>
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
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <ServiceSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : services.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No services found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search terms or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} md={6} lg={4} key={service._id}>
                <Card 
                  className="service-card"
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: alpha(getCategoryColor(service.category), 0.3)
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          lineHeight: 1.3,
                          flex: 1,
                          mr: 1
                        }}
                      >
                        {service.name}
                      </Typography>
                    </Box>
                    
                    <Chip
                      label={getCategoryLabel(service.category)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getCategoryColor(service.category), 0.1),
                        color: getCategoryColor(service.category),
                        fontWeight: 500,
                        mb: 2,
                        borderRadius: 2
                      }}
                    />
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {service.description}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mb: 2
                      }}
                    >
                      {service.department}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* Contact Information */}
                    <Box sx={{ mb: 2 }}>
                      {service.contact.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Phone sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.contact.phone}
                          </Typography>
                        </Box>
                      )}
                      
                      {service.contact.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Email sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              wordBreak: 'break-word'
                            }}
                          >
                            {service.contact.email}
                          </Typography>
                        </Box>
                      )}
                      
                      {service.contact.address && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.contact.address.city}, {service.contact.address.state}
                          </Typography>
                        </Box>
                      )}
                      
                      {service.hours && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Schedule sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.hours.monday || 'Hours vary'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {/* Languages */}
                    {service.languages && service.languages.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Language sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {service.languages.join(', ')}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Accessibility Features */}
                    {service.accessibility && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {service.accessibility.wheelchairAccessible && (
                          <Chip 
                            icon={<AccessibilityNew />}
                            label="Wheelchair Accessible" 
                            size="small" 
                            variant="outlined"
                            className="accessibility-indicator"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        )}
                        {service.accessibility.signLanguage && (
                          <Chip 
                            label="Sign Language" 
                            size="small" 
                            variant="outlined"
                            className="accessibility-indicator"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        )}
                        {service.accessibility.braille && (
                          <Chip 
                            label="Braille" 
                            size="small" 
                            variant="outlined"
                            className="accessibility-indicator"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 500
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Services;