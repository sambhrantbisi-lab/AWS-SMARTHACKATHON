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
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Chat,
  Search,
  LocalHospital,
  School,
  Work,
  Home as HomeIcon,
  Gavel,
  DirectionsBus,
  ArrowForward,
  Accessibility
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const features = [
    {
      icon: <Chat sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: t('home.features.aiAssistant.title', 'AI-Powered Assistant'),
      description: t('home.features.aiAssistant.description', 'Get instant help finding public services and information through our intelligent chat assistant.'),
      action: t('home.features.aiAssistant.action', 'Start Chatting'),
      link: '/chat'
    },
    {
      icon: <Search sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: t('home.features.serviceSearch.title', 'Service Directory'),
      description: t('home.features.serviceSearch.description', 'Browse and search through comprehensive database of local public services and resources.'),
      action: t('home.features.serviceSearch.action', 'Browse Services'),
      link: '/services'
    }
  ];

  const serviceCategories = [
    { icon: <LocalHospital />, name: t('categories.healthcare', 'Healthcare'), color: theme.palette.error.main },
    { icon: <School />, name: t('categories.education', 'Education'), color: theme.palette.info.main },
    { icon: <Work />, name: t('categories.employment', 'Employment'), color: theme.palette.success.main },
    { icon: <HomeIcon />, name: t('categories.housing', 'Housing'), color: theme.palette.warning.main },
    { icon: <Gavel />, name: t('categories.legal', 'Legal Aid'), color: theme.palette.secondary.main },
    { icon: <DirectionsBus />, name: t('categories.transportation', 'Transportation'), color: '#ff6b35' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        className="hero-gradient"
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
          borderRadius: 3,
          color: 'white',
          mb: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.1,
              mb: 3
            }}
          >
            {t('home.hero.title', 'Your Civic Information Assistant')}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 5, 
              opacity: 0.95,
              fontWeight: 400,
              lineHeight: 1.4,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            {t('home.hero.subtitle', 'Connecting communities with public services, resources, and opportunities through AI-powered assistance.')}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            '& .MuiButton-root': {
              minWidth: { xs: '200px', md: '220px' }
            }
          }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/chat"
              endIcon={<ArrowForward />}
              className="professional-button"
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                fontWeight: 600,
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                '&:hover': { 
                  backgroundColor: alpha('#ffffff', 0.95),
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              {t('home.hero.startChat', 'Start Chat Assistant')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/services"
              endIcon={<Search />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.8)',
                color: 'white',
                fontWeight: 600,
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                borderWidth: '2px',
                '&:hover': { 
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '2px',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {t('home.hero.browseServices', 'Browse Services')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}
          >
            {t('home.features.title', 'How We Help Your Community')}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            {t('home.features.subtitle', 'Discover the tools designed to make accessing public services simple and efficient.')}
          </Typography>
        </Container>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
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
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                  }
                }}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center', 
                  p: { xs: 3, md: 4 }
                }}>
                  <Box sx={{ 
                    mb: 3,
                    p: 2,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h4" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', md: '1.75rem' },
                      mb: 2
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1.1rem'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to={feature.link}
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem'
                    }}
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
      <Box sx={{ mb: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}
          >
            {t('home.categories.title', 'Service Categories')}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            {t('home.categories.subtitle', 'Explore services organized by category to find exactly what you need.')}
          </Typography>
        </Container>
        
        <Grid container spacing={2} justifyContent="center">
          {serviceCategories.map((category, index) => (
            <Grid item key={index}>
              <Chip
                icon={category.icon}
                label={category.name}
                variant="outlined"
                component={Link}
                to={`/services?category=${category.name.toLowerCase()}`}
                clickable
                sx={{
                  p: 2,
                  height: 'auto',
                  borderRadius: 3,
                  borderWidth: '2px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& .MuiChip-label': { 
                    px: 3, 
                    py: 1.5, 
                    fontSize: '1rem',
                    fontWeight: 500
                  },
                  '& .MuiChip-icon': { 
                    color: category.color,
                    fontSize: '1.2rem'
                  },
                  borderColor: alpha(category.color, 0.3),
                  color: category.color,
                  '&:hover': {
                    backgroundColor: alpha(category.color, 0.08),
                    borderColor: category.color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(category.color, 0.2)}`
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${category.color}`,
                    outlineOffset: '2px'
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Accessibility Notice */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.success.main, 0.05),
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Box sx={{ 
          mb: 3,
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette.success.main, 0.1)
        }}>
          <Accessibility sx={{ 
            fontSize: 40, 
            color: theme.palette.success.main 
          }} />
        </Box>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.success.dark,
            mb: 2
          }}
        >
          {t('home.accessibility.title', 'Accessible for Everyone')}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          {t('home.accessibility.description', 'Our platform supports multiple languages, screen readers, high contrast mode, and keyboard navigation to ensure everyone can access public services.')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;