import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
  Chip
} from '@mui/material';
import {
  Chat,
  Search,
  LocalHospital,
  School,
  Work,
  Home as HomeIcon,
  Gavel,
  DirectionsBus
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Chat sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('home.features.aiAssistant.title', 'AI-Powered Assistant'),
      description: t('home.features.aiAssistant.description', 'Get instant help finding public services and information through our intelligent chat assistant.'),
      action: t('home.features.aiAssistant.action', 'Start Chatting'),
      link: '/chat'
    },
    {
      icon: <Search sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('home.features.serviceSearch.title', 'Service Directory'),
      description: t('home.features.serviceSearch.description', 'Browse and search through comprehensive database of local public services and resources.'),
      action: t('home.features.serviceSearch.action', 'Browse Services'),
      link: '/services'
    }
  ];

  const serviceCategories = [
    { icon: <LocalHospital />, name: t('categories.healthcare', 'Healthcare'), color: '#e53e3e' },
    { icon: <School />, name: t('categories.education', 'Education'), color: '#3182ce' },
    { icon: <Work />, name: t('categories.employment', 'Employment'), color: '#38a169' },
    { icon: <HomeIcon />, name: t('categories.housing', 'Housing'), color: '#d69e2e' },
    { icon: <Gavel />, name: t('categories.legal', 'Legal Aid'), color: '#805ad5' },
    { icon: <DirectionsBus />, name: t('categories.transportation', 'Transportation'), color: '#dd6b20' }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {t('home.hero.title', 'Your Civic Information Assistant')}
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          {t('home.hero.subtitle', 'Connecting communities with public services, resources, and opportunities through AI-powered assistance.')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/chat"
            sx={{
              backgroundColor: 'white',
              color: '#1976d2',
              '&:hover': { backgroundColor: '#f5f5f5' },
              px: 4,
              py: 1.5
            }}
          >
            {t('home.hero.startChat', 'Start Chat Assistant')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/services"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': { borderColor: '#f5f5f5', backgroundColor: 'rgba(255,255,255,0.1)' },
              px: 4,
              py: 1.5
            }}
          >
            {t('home.hero.browseServices', 'Browse Services')}
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          {t('home.features.title', 'How We Help Your Community')}
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to={feature.link}
                    size="large"
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Service Categories */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          {t('home.categories.title', 'Service Categories')}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {serviceCategories.map((category, index) => (
            <Grid item key={index}>
              <Chip
                icon={category.icon}
                label={category.name}
                variant="outlined"
                sx={{
                  p: 2,
                  height: 'auto',
                  '& .MuiChip-label': { px: 2, py: 1, fontSize: '1rem' },
                  '& .MuiChip-icon': { color: category.color },
                  borderColor: category.color,
                  '&:hover': {
                    backgroundColor: `${category.color}15`,
                    borderColor: category.color
                  }
                }}
                component={Link}
                to={`/services?category=${category.name.toLowerCase()}`}
                clickable
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Accessibility Notice */}
      <Box
        sx={{
          backgroundColor: '#f8f9fa',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}
      >
        <Typography variant="h6" gutterBottom>
          {t('home.accessibility.title', 'Accessible for Everyone')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('home.accessibility.description', 'Our platform supports multiple languages, screen readers, high contrast mode, and keyboard navigation to ensure everyone can access public services.')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;