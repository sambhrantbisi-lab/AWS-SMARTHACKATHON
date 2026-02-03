import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Container,
  useTheme,
  alpha,
  Fade,
  Tooltip
} from '@mui/material';
import { 
  Send, 
  Mic, 
  MicOff, 
  VolumeUp,
  SmartToy,
  Person,
  AutoAwesome
} from '@mui/icons-material';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  // Simple speech synthesis and recognition placeholders
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      if (sessionId) {
        response = await axios.post(`/api/chat/continue/${sessionId}`, {
          message,
          language: 'en'
        });
      } else {
        response = await axios.post('/api/chat/start', {
          message,
          language: 'en',
          location: { city: 'Default City', state: 'Default State' }
        });
        setSessionId(response.data.sessionId);
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleSpeak = (text) => {
    speak(text);
  };

  const toggleListening = () => {
    if (isListening) {
      window.speechSynthesis.cancel();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const defaultSuggestions = [
    "How do I apply for unemployment benefits?",
    "Find healthcare services near me",
    "What housing assistance is available?",
    "How to register to vote?",
    "Find job training programs"
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AutoAwesome sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Civic AI Assistant
          </Typography>
        </Box>
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
          Your intelligent guide to public services and civic information
        </Typography>
      </Box>
      
      {/* Chat Messages */}
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
            backgroundColor: alpha(theme.palette.background.default, 0.3)
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <SmartToy sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Hello! I'm here to help you navigate public services.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                Ask me about healthcare, education, employment, housing, legal aid, or any other public services.
              </Typography>
              
              {/* Default Suggestions */}
              <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Try asking about:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {defaultSuggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      clickable
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        fontWeight: 500,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-1px)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {messages.map((message, index) => (
                <Fade in={true} timeout={300} key={index}>
                  <ListItem
                    className="chat-message"
                    sx={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                      px: 0
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        maxWidth: '75%',
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: message.role === 'user' 
                            ? theme.palette.primary.main 
                            : theme.palette.success.main,
                          mx: 1.5,
                          width: 40,
                          height: 40,
                          boxShadow: theme.shadows[2]
                        }}
                      >
                        {message.role === 'user' ? <Person /> : <SmartToy />}
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2.5,
                          backgroundColor: message.role === 'user' 
                            ? alpha(theme.palette.primary.main, 0.1)
                            : alpha(theme.palette.success.main, 0.05),
                          border: `1px solid ${message.role === 'user' 
                            ? alpha(theme.palette.primary.main, 0.2)
                            : alpha(theme.palette.success.main, 0.2)}`,
                          borderRadius: 3,
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 12,
                            [message.role === 'user' ? 'right' : 'left']: -8,
                            width: 0,
                            height: 0,
                            borderTop: `8px solid ${message.role === 'user' 
                              ? alpha(theme.palette.primary.main, 0.2)
                              : alpha(theme.palette.success.main, 0.2)}`,
                            borderBottom: '8px solid transparent',
                            [message.role === 'user' ? 'borderLeft' : 'borderRight']: '8px solid transparent'
                          }
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {message.content}
                        </Typography>
                        {message.role === 'assistant' && (
                          <Tooltip title="Listen to response">
                            <IconButton
                              size="small"
                              onClick={() => handleSpeak(message.content)}
                              sx={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8,
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.background.paper, 1)
                                }
                              }}
                            >
                              <VolumeUp fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            mt: 1,
                            textAlign: message.role === 'user' ? 'right' : 'left'
                          }}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Paper>
                    </Box>
                  </ListItem>
                </Fade>
              ))}
              {isLoading && (
                <Fade in={true} timeout={300}>
                  <ListItem sx={{ justifyContent: 'flex-start', px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 1.5, width: 40, height: 40 }}>
                        <SmartToy />
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          backgroundColor: alpha(theme.palette.success.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <CircularProgress size={16} color="success" />
                        <Typography variant="body2" color="text.secondary">
                          Thinking...
                        </Typography>
                      </Paper>
                    </Box>
                  </ListItem>
                </Fade>
              )}
            </List>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box sx={{ p: 3, pt: 0 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Suggested follow-up questions:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  clickable
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    fontWeight: 500,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-1px)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Input Area */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about public services, resources, or any civic information..."
              variant="outlined"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.default, 0.8)
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.background.paper
                  }
                }
              }}
            />
            <Tooltip title={isListening ? "Stop listening" : "Voice input"}>
              <IconButton
                onClick={toggleListening}
                disabled={isLoading}
                sx={{
                  backgroundColor: isListening 
                    ? alpha(theme.palette.error.main, 0.1)
                    : alpha(theme.palette.action.hover, 0.5),
                  color: isListening ? theme.palette.error.main : 'inherit',
                  '&:hover': {
                    backgroundColor: isListening 
                      ? alpha(theme.palette.error.main, 0.2)
                      : alpha(theme.palette.action.hover, 0.8)
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {isListening ? <MicOff /> : <Mic />}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                minWidth: 'auto',
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-1px)'
                },
                '&:disabled': {
                  backgroundColor: alpha(theme.palette.action.disabled, 0.3)
                }
              }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat;