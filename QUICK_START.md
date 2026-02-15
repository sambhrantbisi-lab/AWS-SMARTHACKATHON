# 🚀 Quick Start - Brutalist UI Testing

## Start Server
```bash
node server.js
```

## Test URL
**http://localhost:5000/services-brutalist.html**

## What to Test

### 1. Click Service Tiles
- AADHAAR CARD 🆔
- PAN CARD 💳
- PASSPORT 🛂

### 2. Test Forum
1. Type message
2. Select language (हिंदी, தமிழ், తెలుగు)
3. Click POST
4. Watch AI translate

### 3. Check Console
Look for:
- ✅ Translations loaded
- ✅ Gemini/Groq responses
- 🔄 Fallback activation

## Expected Behavior
- Tiles have hover effects
- Clicking opens nested window
- Forum posts translate via AI
- ESC closes windows
- Animations are smooth

## API Keys
- Gemini: 20 RPD (limited)
- Groq: 70,000+ RPD (fallback)

## Files Changed
- `server.js` - Fixed duplicate route

## Status
✅ All systems ready
✅ Syntax validated
✅ Documentation complete

---

**Ready to test!** 🎯
