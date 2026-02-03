# 🇮🇳 Civic AI Assistant - Bharat-First Platform

A comprehensive AI-powered platform connecting Indian citizens with government services, public welfare schemes, and civic information through intelligent assistance.

## ✨ Features Implemented

### 🤖 AI-Powered Intelligence
- **ChatGPT Integration**: Real conversational AI for understanding citizen queries
- **Intent Classification**: Automatically detects user needs (health, employment, education, etc.)
- **Multi-language Support**: Hindi and English with Indian context
- **Smart Recommendations**: AI suggests relevant services based on queries

### 🏛️ Bharat-First Services
- **Realistic Indian Data**: PHC, PMKVY, Jan Aushadhi, PMAY, Legal Aid, etc.
- **Government Schemes**: Integration with actual Indian welfare programs
- **Local Context**: Indian timings, addresses, phone numbers, and procedures
- **Rural & Urban Focus**: Simple language accessible to all citizens

### 🎯 Functional Features
- **Interactive Chat Interface**: Real-time AI conversation with suggestions
- **Service Directory**: Browse 8 categories of government services
- **Smart Search**: AI-powered search with category filtering
- **Service Details**: Complete information including eligibility, documents, hours
- **Professional UI**: Dark/light mode, accessibility features, responsive design

### 🛡️ Responsible AI
- **Ethical Guidelines**: Disclaimers for health/legal matters
- **No Diagnosis**: AI assists but doesn't replace professional advice
- **Fallback Responses**: Works even without OpenAI API key
- **Citizen-Centric**: Focus on empowerment, not replacement of services

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- Optional: OpenAI API key for enhanced ChatGPT responses

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd civic-ai-assistant
npm install
```

2. **Environment Setup**
```bash
# .env file is already created with defaults
# Optional: Add your OpenAI API key for full ChatGPT integration
# OPENAI_API_KEY=your_key_here
```

3. **Start the Server**
```bash
npm start
# Server runs on http://localhost:4000
```

4. **Test the Demo**
```bash
node test-demo.js
# Runs comprehensive API tests
```

## 🎯 Demo-Ready Features

### For Hackathon Judges
1. **Visit**: http://localhost:4000
2. **Try Chat**: Click "Start Chat Assistant" 
   - Ask: "मुझे स्वास्थ्य सेवा चाहिए" (I need health services)
   - Ask: "How to get skill training?"
   - Ask: "Housing subsidy schemes"
3. **Browse Services**: Click category chips or "Browse Services"
4. **View Details**: Click any service for complete information
5. **AI Integration**: All responses powered by real AI logic

### Working User Flow
```
User Query → AI Understanding → Service Matching → ChatGPT Response → Follow-up Suggestions
```

## 📁 Project Architecture

```
civic-ai-assistant/
├── 🎨 Frontend (Static HTML + Vanilla JS)
│   ├── public/index.html      # Professional UI with dark mode
│   └── public/app.js          # Full AI-powered functionality
├── 🧠 AI Services
│   ├── services/aiService.js  # ChatGPT integration & intent detection
│   └── data/bharatServices.json # Realistic Indian service data
├── 🔌 Backend APIs
│   ├── routes/chat.js         # AI chat endpoints
│   ├── routes/services.js     # Service search & filtering
│   └── server.js              # Express server (Port 4000)
├── 📊 Database Models
│   ├── models/ChatSession.js  # Chat history
│   ├── models/Service.js      # Service schema
│   └── models/User.js         # User management
└── 🧪 Testing
    └── test-demo.js           # Comprehensive API tests
```

## 🔧 API Endpoints

### Chat AI
- `POST /api/chat/start` - Start new AI conversation
- `POST /api/chat/continue/:sessionId` - Continue chat session
- `POST /api/chat/quick` - Quick AI query

### Services
- `GET /api/services` - Get all Bharat services
- `GET /api/services/:id` - Get service details
- `POST /api/services/search` - AI-powered search
- `GET /api/services/category/:category` - Filter by category

## 🎨 UI Features

### Professional Design
- **Modern Typography**: Inter font family
- **Color Palette**: Government-grade blue/indigo theme
- **Dark Mode**: System preference + manual toggle
- **Accessibility**: WCAG compliant, keyboard navigation
- **Responsive**: Works on desktop, tablet, mobile

### Interactive Elements
- **Smooth Animations**: Hover effects, transitions
- **Ripple Effects**: Material Design feedback
- **Loading States**: User feedback during AI processing
- **Modal Interfaces**: Chat and service browsing
- **Smart Suggestions**: Context-aware quick actions

## 🇮🇳 Bharat Services Data

### Categories Implemented
1. **Healthcare** (स्वास्थ्य): PHC, Jan Aushadhi, vaccination
2. **Employment** (रोजगार): PMKVY, skill training, job placement
3. **Education** (शिक्षा): Libraries, computer training, scholarships
4. **Housing** (आवास): PMAY, housing subsidy, affordable housing
5. **Legal Aid** (कानूनी): Free legal services, court assistance
6. **Transportation** (परिवहन): DTC buses, metro connectivity
7. **Welfare** (कल्याण): PDS, ration cards, subsidies

### Data Authenticity
- Real government department names
- Actual scheme names (PMKVY, PMAY, Ayushman Bharat)
- Indian phone number formats
- Hindi + English descriptions
- Realistic eligibility criteria
- Proper government office timings

## 🤖 AI Implementation

### ChatGPT Integration
```javascript
// System prompt ensures Indian context
"You are a helpful AI assistant for Indian citizens seeking 
information about government services and public welfare schemes."
```

### Intent Detection
- Keyword-based classification
- Multi-language support (Hindi/English)
- 7 categories: healthcare, employment, education, housing, legal, transport, welfare

### Fallback System
- Works without OpenAI API key
- Generates contextual responses using service data
- Maintains conversation flow

## 🧪 Testing

Run comprehensive tests:
```bash
node test-demo.js
```

Tests verify:
- ✅ Service data loading (8 services)
- ✅ AI chat with intent detection
- ✅ Multi-language queries (Hindi/English)
- ✅ Service search and filtering
- ✅ Category browsing
- ✅ Service detail retrieval

## 🎯 Hackathon Judge Demo Script

1. **Open**: http://localhost:4000
2. **Chat Test**: 
   - "मुझे डॉक्टर की जरूरत है" → Should detect healthcare intent
   - "Job training programs" → Should show PMKVY and employment services
3. **Browse Test**: Click healthcare category → Should show PHC and Jan Aushadhi
4. **Detail Test**: Click any service → Should show complete information
5. **Search Test**: Search "vaccination" → Should find relevant health services

## 🔮 Future Enhancements

- Voice input/output (speech-to-text)
- Regional language support (Tamil, Bengali, etc.)
- Location-based service filtering
- Real-time service availability
- Integration with actual government APIs
- Mobile app version

## 🤝 Contributing

This is a hackathon project demonstrating AI-powered civic engagement. The focus is on:
- Realistic Indian context
- Functional AI integration
- Professional UI/UX
- Demo-ready features

## 📄 License

MIT License - Built for community empowerment and civic engagement.

---

**🎉 Status**: ✅ Complete and Demo-Ready
**🎯 Focus**: Bharat-first AI-powered civic assistance
**🏆 Hackathon**: AWS Smart Hackathon 2024