# Civic AI Assistant

An AI-powered web application that improves access to information, resources, and opportunities for communities and public systems. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🎯 Problem Statement

This application addresses the challenge of connecting communities with public services, resources, and opportunities through an accessible, AI-powered platform that supports multiple languages, accessibility features, and various interaction methods.

## ✨ Features

### Core Functionality
- **AI-Powered Chat Assistant**: Intelligent conversational interface for finding public services
- **Comprehensive Service Directory**: Searchable database of local public services and resources
- **Multi-language Support**: Available in English, Spanish, French, Chinese, and Arabic
- **Voice Interface**: Speech-to-text and text-to-speech capabilities
- **Accessibility Features**: Screen reader support, high contrast mode, large text, keyboard navigation

### Service Categories
- Healthcare services
- Education and training programs
- Employment assistance
- Housing resources
- Legal aid
- Transportation services
- Social services
- Utilities assistance
- Emergency services

### Accessibility & Inclusion
- **WCAG 2.1 AA Compliant**: Meets web accessibility standards
- **Multi-language Support**: Serves diverse communities
- **Voice Interface**: Supports users with different abilities
- **Low-bandwidth Optimization**: Works on slower internet connections
- **Mobile-responsive Design**: Accessible on all devices

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time communication

### Frontend
- **React 18** with functional components and hooks
- **Material-UI (MUI)** for accessible UI components
- **React Router** for navigation
- **Axios** for API communication
- **i18next** for internationalization
- **React Speech Kit** for voice features

### AI & Language Processing
- Modular AI service architecture (ready for OpenAI, Google AI, etc.)
- Intent detection and categorization
- Context-aware response generation
- Multi-language translation support

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd civic-ai-assistant
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civic-ai
   JWT_SECRET=your_jwt_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_key_here
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system

6. **Run the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   # Server only
   npm run server
   
   # Client only (in another terminal)
   npm run client
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### For Citizens
1. **Browse Services**: Use the service directory to find local public services
2. **Chat Assistant**: Ask questions about services, eligibility, and procedures
3. **Voice Interface**: Use voice commands for hands-free interaction
4. **Multi-language**: Switch between supported languages
5. **Accessibility**: Enable features like high contrast or large text

### For Administrators
1. **Service Management**: Add, update, and manage service listings
2. **Analytics**: Monitor usage patterns and popular queries
3. **Content Management**: Update AI responses and service information

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - Get all services (with filtering)
- `GET /api/services/:id` - Get specific service
- `GET /api/services/category/:category` - Get services by category
- `POST /api/services/search` - Advanced service search

### Chat
- `POST /api/chat/start` - Start new chat session
- `POST /api/chat/continue/:sessionId` - Continue chat session
- `GET /api/chat/history/:sessionId` - Get chat history

## 🎨 Customization

### Adding New Languages
1. Add language resources in `client/src/i18n.js`
2. Update the supported languages list in `LanguageContext.js`
3. Add translation logic in the AI service

### Adding New Service Categories
1. Update the categories enum in `models/Service.js`
2. Add category handling in the AI service
3. Update the frontend category lists

### Integrating External AI Services
1. Implement new AI providers in `utils/aiService.js`
2. Add API keys to environment variables
3. Update the AI response generation logic

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting (recommended for production)
- Environment variable protection

## 📊 Performance Optimization

- Database indexing for fast searches
- Pagination for large datasets
- Image optimization
- Code splitting in React
- Caching strategies
- CDN integration (recommended for production)

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client && npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build the React app
cd client && npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for accessible React components
- OpenAI for AI capabilities
- MongoDB for flexible data storage
- React Speech Kit for voice features
- i18next for internationalization

## 📞 Support

For support, email support@civicai.com or create an issue in the repository.

---

**Built with ❤️ for community empowerment and civic engagement**