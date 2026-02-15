import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};

// Professional color palette - civic-friendly and trustworthy
const lightPalette = {
  primary: {
    main: '#2563eb', // Professional blue
    light: '#3b82f6',
    dark: '#1d4ed8',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#64748b', // Slate gray
    light: '#94a3b8',
    dark: '#475569',
    contrastText: '#ffffff'
  },
  background: {
    default: '#f8fafc', // Very light gray
    paper: '#ffffff',
    elevated: '#f1f5f9'
  },
  text: {
    primary: '#0f172a', // Dark slate
    secondary: '#475569',
    disabled: '#94a3b8'
  },
  divider: '#e2e8f0',
  success: {
    main: '#059669',
    light: '#10b981',
    dark: '#047857'
  },
  warning: {
    main: '#d97706',
    light: '#f59e0b',
    dark: '#b45309'
  },
  error: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c'
  },
  info: {
    main: '#0284c7',
    light: '#0ea5e9',
    dark: '#0369a1'
  }
};

const darkPalette = {
  primary: {
    main: '#3b82f6', // Brighter blue for dark mode
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#94a3b8', // Lighter slate for dark mode
    light: '#cbd5e1',
    dark: '#64748b',
    contrastText: '#000000'
  },
  background: {
    default: '#0f172a', // Dark slate
    paper: '#1e293b',
    elevated: '#334155'
  },
  text: {
    primary: '#f8fafc', // Light text
    secondary: '#cbd5e1',
    disabled: '#64748b'
  },
  divider: '#334155',
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  },
  info: {
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0284c7'
  }
};

// Professional typography scale
const typography = {
  fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em'
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.025em'
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.025em'
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.5
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.025em'
  }
};

// Professional component overrides
const getComponentOverrides = (isDark) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 20px',
        fontWeight: 500,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          transform: 'translateY(0)'
        },
        '&:focus-visible': {
          outline: `2px solid ${isDark ? '#3b82f6' : '#2563eb'}`,
          outlineOffset: '2px'
        }
      },
      contained: {
        '&:hover': {
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)'
        }
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)'
        }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: isDark 
          ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.24)'
          : '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)'
        }
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? '#64748b' : '#94a3b8'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px'
          }
        }
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: isDark
          ? '0 1px 3px rgba(0, 0, 0, 0.4)'
          : '0 1px 3px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(8px)'
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12
      },
      elevation1: {
        boxShadow: isDark
          ? '0 1px 3px rgba(0, 0, 0, 0.3)'
          : '0 1px 3px rgba(0, 0, 0, 0.12)'
      }
    }
  }
});

export const CustomThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('themeMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('themeMode')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('themeMode', newMode ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      ...(isDarkMode ? darkPalette : lightPalette)
    },
    typography,
    components: getComponentOverrides(isDarkMode),
    shape: {
      borderRadius: 8
    },
    spacing: 8,
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
      }
    }
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};