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
  CircularProgress
} from '@mui/material';
import { Send, Mic, MicOff, VolumeUp } from '@mui/icons-material';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Simple speech synthesis and recognition placeholders
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
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
    startListening();
  };

  return (
    <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Civic AI Assistant
      </Typography>
      
      {/* Chat Messages */}
      <Paper
        sx={{
          flex: 1,
          p: 2,
          mb: 2,
          overflow: 'auto',
          backgroundColor: '#fafafa'
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Hello! I'm here to help you find public services and information.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ask me about healthcare, education, employment, housing, or any other public services.
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    maxWidth: '70%',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.role === 'user' ? '#1976d2' : '#4caf50',
                      mx: 1
                    }}
                  >
                    {message.role === 'user' ? 'U' : 'AI'}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f1f8e9',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    {message.role === 'assistant' && (
                      <IconButton
                        size="small"
                        onClick={() => handleSpeak(message.content)}
                        sx={{ position: 'absolute', top: 4, right: 4 }}
                      >
                        <VolumeUp fontSize="small" />
                      </IconButton>
                    )}
                  </Paper>
                </Box>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#4caf50', mr: 1 }}>AI</Avatar>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Thinking...
                  </Typography>
                </Box>
              </ListItem>
            )}
          </List>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Suggested questions:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                clickable
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input Area */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
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
        />
        <IconButton
          onClick={toggleListening}
          color="default"
          disabled={isLoading}
        >
          <Mic />
        </IconButton>
        <Button
          variant="contained"
          onClick={() => sendMessage()}
          disabled={!inputMessage.trim() || isLoading}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <Send />
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;