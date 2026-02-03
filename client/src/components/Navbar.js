import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Select,
  FormControl,
  Tooltip,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  AccountCircle,
  Language,
  Accessibility,
  Menu as MenuIcon,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [langAnchorEl, setLangAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenu = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: muiTheme.palette.primary.main,
        boxShadow: muiTheme.shadows[1],
        borderBottom: `1px solid ${muiTheme.palette.divider}`
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.025em',
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 0.9
            }
          }}
        >
          {t('app.title', 'Civic AI Assistant')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/services"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {t('nav.services', 'Services')}
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/chat"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {t('nav.chat', 'Chat Assistant')}
          </Button>

          {/* Dark Mode Toggle */}
          <Tooltip title={isDarkMode ? t('nav.lightMode', 'Switch to Light Mode') : t('nav.darkMode', 'Switch to Dark Mode')}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                ml: 1,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
              aria-label={isDarkMode ? t('nav.lightMode', 'Switch to Light Mode') : t('nav.darkMode', 'Switch to Dark Mode')}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* Language Selector */}
          <Tooltip title={t('nav.changeLanguage', 'Change Language')}>
            <IconButton
              color="inherit"
              onClick={handleLangMenu}
              sx={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
              aria-label={t('nav.changeLanguage', 'Change Language')}
              aria-controls={langAnchorEl ? 'language-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={langAnchorEl ? 'true' : undefined}
            >
              <Language />
            </IconButton>
          </Tooltip>
          <Menu
            id="language-menu"
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLangClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 2,
                mt: 1,
                boxShadow: muiTheme.shadows[3]
              }
            }}
          >
            {supportedLanguages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  handleLangClose();
                }}
                selected={currentLanguage === lang.code}
                sx={{
                  fontWeight: currentLanguage === lang.code ? 600 : 400,
                  '&:hover': {
                    backgroundColor: muiTheme.palette.action.hover
                  }
                }}
              >
                {lang.name}
              </MenuItem>
            ))}
          </Menu>

          {user ? (
            <>
              <Tooltip title={t('nav.account', 'Account')}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    ml: 1,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    borderRadius: 2,
                    mt: 1,
                    boxShadow: muiTheme.shadows[3]
                  }
                }}
              >
                <MenuItem 
                  onClick={() => { navigate('/profile'); handleClose(); }}
                  sx={{
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: muiTheme.palette.action.hover
                    }
                  }}
                >
                  {t('nav.profile', 'Profile')}
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: muiTheme.palette.action.hover
                    }
                  }}
                >
                  {t('nav.logout', 'Logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {t('nav.login', 'Login')}
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/register"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'inherit',
                  ml: 1,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {t('nav.register', 'Register')}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;