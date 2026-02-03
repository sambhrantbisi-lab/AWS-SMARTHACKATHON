# 🚀 Civic AI Assistant - Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install --legacy-peer-deps
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civic-ai
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://cloud.mongodb.com
- Create cluster and get connection string
- Update MONGODB_URI in .env file

### 4. Seed Database (Optional)

```bash
node seed.js
```

### 5. Start the Application

**Option A: Development Mode (Recommended)**
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
cd client
npm start
```

**Option B: Using the startup script**
```bash
./start.sh
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🧪 Testing

Test the API endpoints:
```bash
node test-api.js
```

## 📱 Features Available

### Core Functionality
- ✅ AI-powered chat assistant
- ✅ Service directory with search and filtering
- ✅ Multi-language support (English, Spanish)
- ✅ User authentication and profiles
- ✅ Accessibility features
- ✅ Responsive design

### Service Categories
- Healthcare
- Education
- Employment
- Housing
- Legal Aid
- Transportation
- Social Services
- Utilities
- Emergency Services

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
sudo systemctl start mongod
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill process using port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

**3. React Build Issues**
```
Module not found errors
```
**Solution**: Clear cache and reinstall
```bash
cd client
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**4. SSL/Network Issues**
```
ERR_SSL_CIPHER_OPERATION_FAILED
```
**Solution**: Configure npm
```bash
npm config set strict-ssl false
npm config set registry http://registry.npmjs.org/
```

## 🌐 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_secure_jwt_secret
```

### Build for Production
```bash
cd client
npm run build
cd ..
npm start
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get specific service
- `POST /api/services/search` - Search services

### Chat
- `POST /api/chat/start` - Start chat session
- `POST /api/chat/continue/:sessionId` - Continue chat

## 🎯 Next Steps

1. **Add Real AI Integration**: Replace mock AI with OpenAI, Google AI, or similar
2. **Enhanced Voice Features**: Implement proper speech recognition
3. **Mobile App**: Create React Native version
4. **Admin Dashboard**: Build service management interface
5. **Analytics**: Add usage tracking and insights
6. **Notifications**: Implement push notifications
7. **Offline Support**: Add PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues or questions:
- Create GitHub issue
- Check troubleshooting section
- Review logs in browser console and terminal

---

**Built with ❤️ for community empowerment**