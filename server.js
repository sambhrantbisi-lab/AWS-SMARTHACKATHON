const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve data files
app.use('/data', express.static(path.join(__dirname, 'data')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai-chat'));
app.use('/api/ai', require('./routes/translate'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/market', require('./routes/market'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/news', require('./routes/news'));
app.use('/api/discussions', require('./routes/discussions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/realdata', require('./routes/realdata'));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civic-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  directConnection: true, // Force direct connection
}).catch(err => {
  console.log('MongoDB connection failed:', err.message);
  console.log('Server will continue running without database features');
});

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('⚠️  MongoDB connection error:', err.message);
  console.log('Server will continue running without database features');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Test route to serve new UI
app.get('/new', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-new.html'));
});

// Serve the brutalist home page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-brutalist.html'));
});

// Serve static files (after route handlers to prevent index.html override)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file for all other non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-fixed.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});