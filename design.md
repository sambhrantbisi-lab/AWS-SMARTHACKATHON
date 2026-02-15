# Design Document - Civic AI Assistant Platform

## Executive Summary

This document outlines the technical design for the Civic AI Assistant Platform, an intelligent system that helps Indian citizens access government services through natural language interaction. The platform uses OpenAI GPT-3.5-turbo as its reasoning engine, integrated with real government data sources, to provide accurate, step-by-step guidance in multiple languages.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  │  (Desktop)   │  │   Browser    │  │   Browser    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express.js Server (Port 4000)           │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Routes   │  │Middleware  │  │   Static   │    │   │
│  │  │  Handlers  │  │   (CORS,   │  │   Files    │    │   │
│  │  │            │  │    Auth)   │  │            │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AI Service  │  │    Auth      │  │   Service    │      │
│  │  (aiService  │  │   Service    │  │   Matcher    │      │
│  │     .js)     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │    Local     │  │   External   │      │
│  │   Database   │  │    JSON      │  │     APIs     │      │
│  │              │  │    Files     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenAI     │  │    Google    │  │  Data.gov.in │      │
│  │ GPT-3.5-turbo│  │    Gemini    │  │     API      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data
2. **Stateless API**: RESTful design with JWT for authentication
3. **Microservices-Ready**: Modular structure allows future service extraction
4. **Fail-Safe**: Graceful degradation when external services unavailable
5. **Scalability**: Horizontal scaling through load balancing

---

## Component Design

### 1. Frontend Architecture

#### 1.1 Technology Stack
- **Core**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with custom properties
- **Build**: No build step (direct browser execution)
- **State Management**: Local state in JavaScript modules

#### 1.2 File Structure
```
public/
├── index.html              # Main entry point
├── index-brutalist.html    # Brutalist design variant
├── app-complete.js         # Main application logic
├── styles.css              # Global styles
└── assets/                 # Images, icons
```

#### 1.3 UI Components

**Chat Interface Component**
```javascript
class ChatInterface {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.messages = [];
    this.isTyping = false;
  }
  
  addMessage(text, sender) {
    // Add message to UI
  }
  
  showTypingIndicator() {
    // Show AI is typing
  }
  
  clearChat() {
    // Clear conversation
  }
}
```

**Service Card Component**
```javascript
class ServiceCard {
  constructor(service) {
    this.service = service;
  }
  
  render() {
    // Return HTML for service card
  }
  
  onClick() {
    // Handle card click
  }
}
```

#### 1.4 State Management

```javascript
const AppState = {
  user: null,
  currentConversation: [],
  selectedService: null,
  language: 'en',
  
  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  addMessage(message) {
    this.currentConversation.push(message);
  }
};
```

#### 1.5 API Communication
```javascript
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }
  
  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
```

---

### 2. Backend Architecture

#### 2.1 Server Structure
```
AWS-SMARTHACKATHON/
├── server.js              # Express app entry point
├── routes/                # API route handlers
│   ├── auth.js           # Authentication endpoints
│   ├── chat.js           # Chat functionality
│   ├── ai-chat.js        # AI assistant endpoints
│   ├── services.js       # Government services CRUD
│   ├── admin.js          # Admin panel
│   └── realdata.js       # Real data integration
├── services/             # Business logic
│   └── aiService.js      # AI reasoning engine
├── models/               # MongoDB schemas
│   ├── User.js
│   ├── Service.js
│   ├── Conversation.js
│   └── Feedback.js
├── middleware/           # Express middleware
│   ├── auth.js          # JWT verification
│   └── errorHandler.js  # Error handling
└── data/                # Static data
    └── bharatServices.json
```

#### 2.2 API Endpoints

**Authentication**
```
POST   /api/auth/register      # Create new user
POST   /api/auth/login         # User login
POST   /api/auth/logout        # User logout
GET    /api/auth/me            # Get current user
POST   /api/auth/reset         # Password reset
```

**AI Chat**
```
POST   /api/chat               # Send message to AI
GET    /api/chat/history       # Get conversation history
DELETE /api/chat/clear         # Clear conversation
POST   /api/chat/feedback      # Submit feedback on response
```

**Services**
```
GET    /api/services           # List all services
GET    /api/services/:id       # Get service details
POST   /api/services/search    # Search services
GET    /api/services/category/:cat  # Get by category
```

**Admin**
```
GET    /api/admin/stats        # Platform statistics
POST   /api/admin/services     # Create service
PUT    /api/admin/services/:id # Update service
DELETE /api/admin/services/:id # Delete service
GET    /api/admin/users        # List users
```

**Real Data**
```
GET    /api/realdata/government  # Fetch Data.gov.in data
GET    /api/realdata/stocks      # Stock market data
GET    /api/realdata/news        # Government news
```

#### 2.3 Request/Response Flow

**Chat Request Flow**
```
1. Client sends POST /api/chat with { message, userId }
2. Express route handler validates request
3. Auth middleware verifies JWT token
4. Route calls aiService.processQuery(message)
5. aiService classifies intent
6. aiService matches relevant services
7. aiService calls OpenAI API with context
8. OpenAI returns response
9. aiService formats response
10. Response sent to client
11. Conversation saved to MongoDB
```

---

### 3. AI Service Design

#### 3.1 Core AI Service Class

```javascript
class BharatCivicAI {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.services = this.loadBharatServices();
    this.systemPrompt = `[Comprehensive system prompt]`;
  }
  
  async processQuery(userMessage, conversationHistory = []) {
    // 1. Classify intent
    const intent = await this.classifyIntent(userMessage);
    
    // 2. Match services
    const relevantServices = this.matchServices(intent, userMessage);
    
    // 3. Build context
    const context = this.buildContext(relevantServices, conversationHistory);
    
    // 4. Call OpenAI
    const aiResponse = await this.callOpenAI(userMessage, context);
    
    // 5. Format response
    return this.formatResponse(aiResponse, relevantServices);
  }
  
  async classifyIntent(message) {
    const categories = [
      'identity_documents',
      'health_services',
      'employment',
      'education',
      'financial',
      'digital_services'
    ];
    
    // Use OpenAI for classification
    const prompt = `Classify this query into one of: ${categories.join(', ')}\nQuery: ${message}`;
    const response = await this.callOpenAI(prompt, null, 'classification');
    
    return response.category;
  }
  
  matchServices(intent, message) {
    // Keyword matching + semantic search
    return this.services.filter(service => {
      return service.category === intent ||
             this.semanticMatch(service, message) > 0.7;
    });
  }
  
  async callOpenAI(message, context, mode = 'chat') {
    const messages = [
      { role: 'system', content: this.systemPrompt }
    ];
    
    if (context) {
      messages.push({ role: 'system', content: context });
    }
    
    messages.push({ role: 'user', content: message });
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  }
}
```

#### 3.2 Intent Classification Strategy

**Categories and Keywords**
```javascript
const intentKeywords = {
  identity_documents: ['aadhaar', 'pan', 'passport', 'voter', 'id', 'card', 'lost', 'update'],
  health_services: ['hospital', 'doctor', 'medicine', 'ayushman', 'health', 'emergency'],
  employment: ['job', 'employment', 'work', 'mgnrega', 'skill', 'training'],
  education: ['scholarship', 'student', 'school', 'college', 'education'],
  financial: ['bank', 'loan', 'insurance', 'pension', 'money'],
  digital_services: ['digilocker', 'umang', 'mygov', 'online', 'app']
};
```

**Classification Algorithm**
1. Tokenize user message
2. Calculate keyword match score for each category
3. If clear winner (score > 0.7), return category
4. Otherwise, use OpenAI for semantic classification
5. Cache classification results for similar queries

#### 3.3 Service Matching Algorithm

**Scoring System**
```javascript
function calculateServiceRelevance(service, query, intent) {
  let score = 0;
  
  // Category match (40%)
  if (service.category === intent) score += 0.4;
  
  // Keyword match (30%)
  const keywordScore = calculateKeywordMatch(service, query);
  score += keywordScore * 0.3;
  
  // Semantic similarity (30%)
  const semanticScore = calculateSemanticSimilarity(service.description, query);
  score += semanticScore * 0.3;
  
  return score;
}
```

#### 3.4 Response Formatting

**Response Structure**
```javascript
{
  message: "Here's how to apply for a new Aadhaar card...",
  services: [
    {
      id: "aadhaar-001",
      name: "Aadhaar Enrollment",
      link: "https://uidai.gov.in"
    }
  ],
  steps: [
    "Visit nearest Aadhaar enrollment center",
    "Carry proof of identity and address",
    "Provide biometric data",
    "Receive enrollment slip"
  ],
  documents: [
    "Proof of Identity (any one)",
    "Proof of Address (any one)"
  ],
  estimatedTime: "15-30 days",
  followUpSuggestions: [
    "What documents are accepted?",
    "How to track application status?"
  ]
}
```

---

### 4. Database Design

#### 4.1 MongoDB Collections

**Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  preferredLanguage: String,
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  role: String // 'user' | 'admin'
}
```

**Services Collection**
```javascript
{
  _id: ObjectId,
  serviceId: String,
  name: {
    en: String,
    hi: String
  },
  category: String,
  description: {
    en: String,
    hi: String
  },
  eligibility: [String],
  documents: [String],
  steps: [String],
  processingTime: String,
  fees: String,
  officialLink: String,
  contactInfo: {
    phone: String,
    email: String,
    hours: String
  },
  keywords: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Conversations Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: String,
  messages: [
    {
      role: String, // 'user' | 'assistant'
      content: String,
      timestamp: Date,
      intent: String,
      servicesRecommended: [ObjectId],
      feedbackScore: Number // 1-5 or null
    }
  ],
  startedAt: Date,
  lastMessageAt: Date,
  isActive: Boolean
}
```

**Feedback Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  conversationId: ObjectId,
  messageId: ObjectId,
  rating: Number, // 1-5
  feedbackText: String,
  category: String, // 'helpful' | 'incorrect' | 'unclear'
  createdAt: Date
}
```

**Analytics Collection**
```javascript
{
  _id: ObjectId,
  date: Date,
  metrics: {
    totalQueries: Number,
    uniqueUsers: Number,
    avgResponseTime: Number,
    topIntents: [{ intent: String, count: Number }],
    topServices: [{ serviceId: String, count: Number }],
    satisfactionScore: Number
  }
}
```

#### 4.2 Indexing Strategy
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true });

// Services
db.services.createIndex({ category: 1 });
db.services.createIndex({ keywords: 1 });
db.services.createIndex({ "name.en": "text", "description.en": "text" });

// Conversations
db.conversations.createIndex({ userId: 1, startedAt: -1 });
db.conversations.createIndex({ sessionId: 1 });

// Feedback
db.feedback.createIndex({ userId: 1 });
db.feedback.createIndex({ createdAt: -1 });
```

---

### 5. Security Design

#### 5.1 Authentication Flow

**Registration**
```
1. User submits email/phone + password
2. Validate input (email format, password strength)
3. Check if user already exists
4. Hash password with bcrypt (10 salt rounds)
5. Create user record in database
6. Send verification email/SMS
7. Return success message
```

**Login**
```
1. User submits credentials
2. Find user by email/phone
3. Compare password with bcrypt
4. Generate JWT token (expires in 24h)
5. Return token + user info
6. Client stores token in localStorage
```

**JWT Token Structure**
```javascript
{
  userId: "user_id_here",
  role: "user",
  iat: 1234567890,
  exp: 1234654290
}
```

#### 5.2 Authorization Middleware
```javascript
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

#### 5.3 Input Validation
```javascript
const validateChatInput = (req, res, next) => {
  const { message } = req.body;
  
  // Check message exists
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // Check length
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long' });
  }
  
  // Sanitize input
  req.body.message = message.trim();
  
  next();
};
```

#### 5.4 Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests, please try again later'
});

app.use('/api/chat', chatLimiter);
```

---

### 6. UI/UX Design

#### 6.1 Design System

**Color Palette**
```css
:root {
  /* Primary Colors */
  --color-primary: #000000;      /* Black */
  --color-secondary: #FFFF00;    /* Yellow */
  --color-accent: #FF0000;       /* Red */
  
  /* Neutral Colors */
  --color-white: #FFFFFF;
  --color-gray-light: #F5F5F5;
  --color-gray: #CCCCCC;
  --color-gray-dark: #333333;
  
  /* Semantic Colors */
  --color-success: #00FF00;
  --color-error: #FF0000;
  --color-warning: #FFA500;
  --color-info: #0000FF;
}
```

**Typography**
```css
:root {
  /* Font Families */
  --font-primary: 'Arial', 'Helvetica', sans-serif;
  --font-mono: 'Courier New', monospace;
  
  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.25rem;    /* 20px */
  --font-size-xl: 1.5rem;     /* 24px */
  --font-size-2xl: 2rem;      /* 32px */
  --font-size-3xl: 3rem;      /* 48px */
  --font-size-4xl: 4rem;      /* 64px */
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;
}
```

**Spacing System**
```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
}
```

#### 6.2 Layout Structure

**Main Page Layout**
```html
<body>
  <!-- AI Hero Section (Full Width, Top) -->
  <section class="ai-hero">
    <h1>Ask Anything About Government Services</h1>
    <p>Get instant help in your language</p>
    
    <!-- Chat Interface -->
    <div class="chat-container">
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-wrapper">
        <input type="text" placeholder="Describe your problem..." />
        <button>Send</button>
      </div>
    </div>
    
    <!-- Suggested Queries -->
    <div class="suggested-queries">
      <button>Lost Aadhaar card</button>
      <button>Apply for passport</button>
      <button>Find hospitals</button>
    </div>
  </section>
  
  <!-- Services Grid (Below AI) -->
  <section class="services-grid">
    <div class="service-card">...</div>
    <div class="service-card">...</div>
    <div class="service-card">...</div>
  </section>
</body>
```

#### 6.3 Component Specifications

**AI Hero Section**
```css
.ai-hero {
  min-height: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
  padding: var(--space-3xl) var(--space-xl);
}

.ai-hero h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-black);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.chat-container {
  width: 100%;
  max-width: 1200px;
  background: var(--color-white);
  border: 4px solid var(--color-primary);
  min-height: 500px;
}
```

**Chat Message Bubbles**
```css
.message-user {
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-md);
  margin: var(--space-sm) 0;
  border-radius: 0; /* Brutalist - no rounded corners */
  max-width: 70%;
  margin-left: auto;
}

.message-ai {
  background: var(--color-gray-light);
  color: var(--color-primary);
  padding: var(--space-md);
  margin: var(--space-sm) 0;
  border: 2px solid var(--color-primary);
  max-width: 70%;
}
```

**Service Cards**
```css
.service-card {
  background: var(--color-white);
  border: 3px solid var(--color-primary);
  padding: var(--space-xl);
  transition: transform 0.2s;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 var(--color-primary);
}
```

#### 6.4 Responsive Design

**Breakpoints**
```css
/* Mobile First Approach */
/* Base styles: Mobile (< 768px) */

/* Tablet */
@media (min-width: 768px) {
  .ai-hero h1 {
    font-size: var(--font-size-3xl);
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .ai-hero h1 {
    font-size: var(--font-size-4xl);
  }
  
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .chat-container {
    max-width: 1400px;
  }
}
```

#### 6.5 Accessibility Features

**Keyboard Navigation**
```javascript
// Tab order
document.querySelectorAll('.interactive').forEach((el, index) => {
  el.setAttribute('tabindex', index + 1);
});

// Enter key to send message
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Escape to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
```

**ARIA Labels**
```html
<button aria-label="Send message" aria-describedby="send-help">
  Send
</button>
<span id="send-help" class="sr-only">
  Press Enter or click to send your message
</span>

<div role="log" aria-live="polite" aria-atomic="false">
  <!-- Chat messages appear here -->
</div>
```

**Screen Reader Support**
```html
<div class="sr-only" aria-live="assertive">
  AI is typing a response...
</div>

<img src="icon.png" alt="Aadhaar card icon representing identity document services" />
```

---

### 7. Performance Optimization

#### 7.1 Caching Strategy

**Response Caching**
```javascript
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

async function getCachedResponse(query) {
  const cacheKey = query.toLowerCase().trim();
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  
  return null;
}

function setCachedResponse(query, response) {
  const cacheKey = query.toLowerCase().trim();
  cache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });
}
```

**Service Data Caching**
```javascript
let servicesCache = null;
let cacheTimestamp = 0;

function getServices() {
  if (servicesCache && Date.now() - cacheTimestamp < 86400000) {
    return servicesCache;
  }
  
  servicesCache = loadServicesFromDB();
  cacheTimestamp = Date.now();
  return servicesCache;
}
```

#### 7.2 Database Query Optimization

**Efficient Queries**
```javascript
// Bad: Load all services then filter in memory
const allServices = await Service.find({});
const filtered = allServices.filter(s => s.category === 'health');

// Good: Filter at database level
const filtered = await Service.find({ category: 'health' })
  .select('name description link')
  .limit(10);

// Better: Use indexes
const filtered = await Service.find({ category: 'health' })
  .select('name description link')
  .limit(10)
  .lean(); // Return plain objects, not Mongoose documents
```

**Pagination**
```javascript
async function getServices(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const [services, total] = await Promise.all([
    Service.find({})
      .skip(skip)
      .limit(limit)
      .lean(),
    Service.countDocuments({})
  ]);
  
  return {
    services,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

#### 7.3 API Request Optimization

**Request Batching**
```javascript
class RequestBatcher {
  constructor(delay = 100) {
    this.queue = [];
    this.delay = delay;
    this.timer = null;
  }
  
  add(request) {
    this.queue.push(request);
    
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush();
      }, this.delay);
    }
  }
  
  async flush() {
    const requests = [...this.queue];
    this.queue = [];
    this.timer = null;
    
    // Process all requests in parallel
    await Promise.all(requests.map(r => r.execute()));
  }
}
```

**Lazy Loading**
```javascript
// Load services on demand
const servicesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreServices();
    }
  });
});

servicesObserver.observe(document.querySelector('.load-more-trigger'));
```

#### 7.4 Frontend Optimization

**Code Splitting**
```javascript
// Load admin panel only when needed
async function loadAdminPanel() {
  const module = await import('./admin-panel.js');
  module.init();
}
```

**Image Optimization**
```html
<!-- Responsive images -->
<img 
  src="icon-small.png"
  srcset="icon-small.png 300w, icon-medium.png 600w, icon-large.png 1200w"
  sizes="(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
  alt="Service icon"
  loading="lazy"
/>
```

---

### 8. Error Handling

#### 8.1 Error Types

**Custom Error Classes**
```javascript
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

class ValidationError extends APIError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class ExternalServiceError extends APIError {
  constructor(service, message) {
    super(`${service} error: ${message}`, 503);
    this.name = 'ExternalServiceError';
    this.service = service;
  }
}
```

#### 8.2 Error Handling Middleware
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  
  // Handle specific errors
  if (err instanceof APIError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

app.use(errorHandler);
```

#### 8.3 Graceful Degradation

**AI Service Fallback**
```javascript
async function getAIResponse(message) {
  try {
    // Try OpenAI first
    return await callOpenAI(message);
  } catch (error) {
    console.error('OpenAI failed:', error);
    
    try {
      // Fallback to Gemini
      return await callGemini(message);
    } catch (error2) {
      console.error('Gemini failed:', error2);
      
      try {
        // Fallback to Groq
        return await callGroq(message);
      } catch (error3) {
        console.error('All AI services failed');
        
        // Return rule-based response
        return getRuleBasedResponse(message);
      }
    }
  }
}
```

**Database Connection Handling**
```javascript
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
  // Continue running with limited functionality
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected, using cache');
  // Use cached data
});
```

#### 8.4 User-Facing Error Messages

**Error Message Mapping**
```javascript
const userFriendlyErrors = {
  'NETWORK_ERROR': 'Unable to connect. Please check your internet connection.',
  'AI_TIMEOUT': 'The AI is taking longer than usual. Please try again.',
  'INVALID_INPUT': 'Please enter a valid message.',
  'RATE_LIMIT': 'Too many requests. Please wait a moment and try again.',
  'SERVICE_UNAVAILABLE': 'This service is temporarily unavailable. Please try again later.',
  'AUTH_REQUIRED': 'Please log in to continue.',
  'PERMISSION_DENIED': 'You don\'t have permission to access this feature.'
};

function getUserFriendlyError(errorCode, language = 'en') {
  const message = userFriendlyErrors[errorCode] || 'Something went wrong. Please try again.';
  
  if (language === 'hi') {
    return translateToHindi(message);
  }
  
  return message;
}
```

---

### 9. Testing Strategy

#### 9.1 Unit Tests

**AI Service Tests**
```javascript
describe('BharatCivicAI', () => {
  describe('classifyIntent', () => {
    it('should classify Aadhaar query as identity_documents', async () => {
      const ai = new BharatCivicAI();
      const intent = await ai.classifyIntent('I lost my Aadhaar card');
      expect(intent).toBe('identity_documents');
    });
    
    it('should classify health query correctly', async () => {
      const ai = new BharatCivicAI();
      const intent = await ai.classifyIntent('I need hospital near me');
      expect(intent).toBe('health_services');
    });
  });
  
  describe('matchServices', () => {
    it('should return relevant services', () => {
      const ai = new BharatCivicAI();
      const services = ai.matchServices('identity_documents', 'aadhaar');
      expect(services.length).toBeGreaterThan(0);
      expect(services[0].category).toBe('identity_documents');
    });
  });
});
```

**API Endpoint Tests**
```javascript
describe('POST /api/chat', () => {
  it('should return AI response', async () => {
    const response = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ message: 'How to apply for passport?' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('services');
  });
  
  it('should reject without authentication', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Test' });
    
    expect(response.status).toBe(401);
  });
  
  it('should validate message length', async () => {
    const longMessage = 'a'.repeat(1001);
    const response = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ message: longMessage });
    
    expect(response.status).toBe(400);
  });
});
```

#### 9.2 Integration Tests

**End-to-End Chat Flow**
```javascript
describe('Chat Integration', () => {
  it('should complete full conversation flow', async () => {
    // 1. User sends message
    const chatResponse = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Lost Aadhaar card' });
    
    expect(chatResponse.status).toBe(200);
    
    // 2. Get conversation history
    const historyResponse = await request(app)
      .get('/api/chat/history')
      .set('Authorization', `Bearer ${token}`);
    
    expect(historyResponse.body.messages.length).toBeGreaterThan(0);
    
    // 3. Submit feedback
    const feedbackResponse = await request(app)
      .post('/api/chat/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        messageId: chatResponse.body.messageId,
        rating: 5 
      });
    
    expect(feedbackResponse.status).toBe(200);
  });
});
```

#### 9.3 Performance Tests

**Load Testing**
```javascript
// Using artillery or k6
export default function() {
  const payload = JSON.stringify({
    message: 'How to apply for passport?'
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  http.post('http://localhost:4000/api/chat', payload, params);
}
```

---

### 10. Deployment Architecture

#### 10.1 AWS Infrastructure

**Proposed AWS Setup**
```
┌─────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              CloudFront (CDN) + WAF                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Application Load Balancer (ALB)                  │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────┐   ┌──────────────────────┐
│   EC2 Instance 1     │   │   EC2 Instance 2     │
│   (Node.js App)      │   │   (Node.js App)      │
└──────────────────────┘   └──────────────────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Database)                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         ElastiCache Redis (Caching Layer)               │
└─────────────────────────────────────────────────────────┘
```

#### 10.2 Environment Configuration

**Development**
```bash
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/civic-ai
LOG_LEVEL=debug
```

**Staging**
```bash
NODE_ENV=staging
PORT=4000
MONGODB_URI=mongodb+srv://staging-cluster.mongodb.net/civic-ai
LOG_LEVEL=info
ENABLE_CACHING=true
```

**Production**
```bash
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://prod-cluster.mongodb.net/civic-ai
LOG_LEVEL=error
ENABLE_CACHING=true
REDIS_URL=redis://elasticache-endpoint:6379
```

#### 10.3 CI/CD Pipeline

**GitHub Actions Workflow**
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        run: |
          ssh ec2-user@instance "cd /app && git pull && npm install && pm2 restart all"
```

#### 10.4 Monitoring & Logging

**CloudWatch Metrics**
- API response times
- Error rates
- Request counts
- Database query performance
- Memory and CPU usage

**Application Logging**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage
logger.info('User query processed', { userId, intent, responseTime });
logger.error('AI service failed', { error: err.message, stack: err.stack });
```

---

### 11. Internationalization (i18n)

#### 11.1 Language Support

**Supported Languages**
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Marathi (mr)
- Gujarati (gu)

#### 11.2 Translation Structure

**Translation Files**
```javascript
// locales/en.json
{
  "hero.title": "Ask Anything About Government Services",
  "hero.subtitle": "Get instant help in your language",
  "chat.placeholder": "Describe your problem...",
  "chat.send": "Send",
  "services.title": "Popular Services",
  "error.network": "Unable to connect. Please check your internet."
}

// locales/hi.json
{
  "hero.title": "सरकारी सेवाओं के बारे में कुछ भी पूछें",
  "hero.subtitle": "अपनी भाषा में तुरंत सहायता प्राप्त करें",
  "chat.placeholder": "अपनी समस्या बताएं...",
  "chat.send": "भेजें",
  "services.title": "लोकप्रिय सेवाएं",
  "error.network": "कनेक्ट नहीं हो पा रहा। कृपया अपना इंटरनेट जांचें।"
}
```

#### 11.3 Translation Service
```javascript
class TranslationService {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.loadTranslations();
  }
  
  async loadTranslations() {
    const languages = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu'];
    
    for (const lang of languages) {
      const response = await fetch(`/locales/${lang}.json`);
      this.translations[lang] = await response.json();
    }
  }
  
  setLanguage(lang) {
    this.currentLanguage = lang;
    this.updateUI();
  }
  
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }
  
  updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  }
}
```

---

### 12. Analytics & Tracking

#### 12.1 Event Tracking

**Key Events to Track**
```javascript
const analytics = {
  // User events
  trackUserRegistration(userId) {
    this.send('user_registered', { userId, timestamp: Date.now() });
  },
  
  trackUserLogin(userId) {
    this.send('user_login', { userId, timestamp: Date.now() });
  },
  
  // Chat events
  trackQuerySubmitted(userId, query, intent) {
    this.send('query_submitted', { userId, query, intent, timestamp: Date.now() });
  },
  
  trackResponseReceived(userId, responseTime, satisfaction) {
    this.send('response_received', { userId, responseTime, satisfaction, timestamp: Date.now() });
  },
  
  // Service events
  trackServiceViewed(userId, serviceId) {
    this.send('service_viewed', { userId, serviceId, timestamp: Date.now() });
  },
  
  trackServiceClicked(userId, serviceId) {
    this.send('service_clicked', { userId, serviceId, timestamp: Date.now() });
  },
  
  // Error events
  trackError(errorType, errorMessage) {
    this.send('error_occurred', { errorType, errorMessage, timestamp: Date.now() });
  }
};
```

#### 12.2 Dashboard Metrics

**Key Performance Indicators (KPIs)**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average queries per user
- Query resolution rate
- Average response time
- User satisfaction score
- Most searched services
- Peak usage hours
- Error rate
- API success rate

---

### 13. Future Enhancements

#### 13.1 Phase 2 Features

**Voice Interface**
```javascript
class VoiceInterface {
  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.synthesis = window.speechSynthesis;
  }
  
  startListening() {
    this.recognition.lang = 'hi-IN'; // Hindi
    this.recognition.start();
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.processVoiceQuery(transcript);
    };
  }
  
  speak(text, lang = 'hi-IN') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    this.synthesis.speak(utterance);
  }
}
```

**WhatsApp Integration**
```javascript
// Using Twilio WhatsApp API
async function handleWhatsAppMessage(from, body) {
  const response = await aiService.processQuery(body);
  
  await twilioClient.messages.create({
    from: 'whatsapp:+14155238886',
    to: from,
    body: response.message
  });
}
```

#### 13.2 Advanced AI Features

**Sentiment Analysis**
```javascript
async function analyzeSentiment(message) {
  // Detect user frustration or urgency
  const sentiment = await callOpenAI(
    `Analyze sentiment: ${message}`,
    'sentiment-analysis'
  );
  
  if (sentiment === 'urgent') {
    // Prioritize response
    // Suggest emergency contacts
  }
}
```

**Personalized Recommendations**
```javascript
async function getPersonalizedServices(userId) {
  const userHistory = await getUserQueryHistory(userId);
  const userProfile = await getUserProfile(userId);
  
  // ML-based recommendations
  const recommendations = await mlModel.predict({
    history: userHistory,
    profile: userProfile
  });
  
  return recommendations;
}
```

---

## Appendix

### A. API Response Examples

**Chat Response**
```json
{
  "success": true,
  "messageId": "msg_123456",
  "message": "To apply for a new Aadhaar card, follow these steps:\n\n1. Visit your nearest Aadhaar enrollment center\n2. Carry proof of identity and address\n3. Provide biometric data (fingerprints, iris scan, photo)\n4. Receive enrollment slip with enrollment number\n5. Track status online after 90 days\n\nRequired documents:\n- Proof of Identity (any one): Passport, PAN card, Voter ID\n- Proof of Address (any one): Utility bill, Bank statement, Rent agreement",
  "services": [
    {
      "id": "aadhaar-enrollment",
      "name": "Aadhaar Enrollment",
      "link": "https://uidai.gov.in/my-aadhaar/get-aadhaar.html"
    }
  ],
  "intent": "identity_documents",
  "confidence": 0.95,
  "followUpSuggestions": [
    "What documents are accepted for Aadhaar?",
    "How to track Aadhaar application status?",
    "Find Aadhaar center near me"
  ]
}
```

### B. Database Schema Examples

**User Schema (Mongoose)**
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  preferredLanguage: { type: String, default: 'en' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### C. Configuration Files

**package.json Scripts**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.js\""
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Status**: Approved for Implementation  
**Next Review**: March 15, 2026  
**Authors**: Civic AI Development Team
