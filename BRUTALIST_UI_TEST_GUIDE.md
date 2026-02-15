# Brutalist UI Test Guide

## Overview
The brutalist UI page (`services-brutalist.html`) is an experimental design featuring:
- Bold, high-contrast brutalist aesthetics
- Dynamic animations (glitch effects, floating icons)
- Nested modal windows for service details
- Discussion forums with AI-powered translation
- Multi-language support (8 languages)

## How to Test

### 1. Start the Server
```bash
node server.js
```

### 2. Access the Brutalist Page
Open in browser: **http://localhost:5000/services-brutalist.html**

### 3. Test Service Tiles

#### Available Services:
1. **AADHAAR CARD** 🆔
   - Category: Identity
   - Tags: FREE, ESSENTIAL, ONLINE
   - Fee: Free
   - Processing: 90 days

2. **PAN CARD** 💳
   - Category: Financial
   - Tags: PAID, ESSENTIAL, ONLINE
   - Fee: ₹110
   - Processing: 15 days

3. **PASSPORT** 🛂
   - Category: Identity
   - Tags: PAID, URGENT, ONLINE
   - Fee: ₹1500
   - Processing: 30 days

#### Test Steps:
1. **Hover over tiles** - Should see translate effect and shadow
2. **Click on any tile** - Nested window should open with:
   - Service overview
   - Required documents
   - Online services available
   - Discussion forum

### 4. Test Nested Windows

When a service tile is clicked:
- ✅ Black overlay appears
- ✅ White content window slides up from bottom
- ✅ Close button (×) in top-right corner
- ✅ Service details displayed
- ✅ Discussion forum at bottom

**Close Window:**
- Click the × button
- Press ESC key

### 5. Test Discussion Forum

Each service has its own discussion forum:

#### Post a Message:
1. Type message in input field
2. Select target language from dropdown:
   - ENGLISH
   - हिंदी (Hindi)
   - தமிழ் (Tamil)
   - తెలుగు (Telugu)
3. Click **POST** button
4. Message will be translated using AI (Gemini → Groq fallback)
5. Translated message appears in forum

#### Expected Behavior:
- Input field shows "Translating..." while processing
- Message appears with:
  - Author: "You"
  - Translated text
  - Timestamp: "Just now"
  - Language indicator (e.g., "HI" for Hindi)

### 6. Test AI Translation

The translation uses the same AI system as the chat:
- **Primary**: Google Gemini (20 RPD limit)
- **Fallback**: Groq (70,000+ RPD)

#### Test Cases:
1. **English to Hindi**:
   - Input: "This service is very helpful"
   - Select: हिंदी
   - Expected: "यह सेवा बहुत उपयोगी है"

2. **English to Tamil**:
   - Input: "How long does it take?"
   - Select: தமிழ்
   - Expected: Tamil translation

3. **Rate Limit Test**:
   - Post multiple messages quickly
   - Should fallback to Groq if Gemini exhausted
   - Check browser console for logs

### 7. Test Animations

#### Glitch Effect:
- Title "GOVERNMENT SERVICES" should glitch every 3 seconds
- Subtle position shifts

#### Floating Icons:
- Service icons (🆔, 💳, 🛂) should float up and down
- Smooth 3-second animation loop

#### Slide-Up Modal:
- Nested windows slide up from bottom
- 0.4s cubic-bezier animation

#### Hover Effects:
- Service tiles translate and add shadow on hover
- Navigation buttons change color and lift

### 8. Test Responsive Design

#### Desktop (> 768px):
- Grid layout with 3 columns
- Full-size nested windows
- All animations active

#### Mobile (< 768px):
- Single column layout
- Smaller title font (32px)
- Reduced padding in windows

### 9. Check Browser Console

Look for these logs:
```
✅ Translations loaded: Object.keys(translations)
🌐 Applied translations for language: en
Querying Google Gemini...
Gemini response received
```

Or if rate limited:
```
🚫 GEMINI RATE LIMIT (429) ERROR - Switching to Groq fallback
Querying Groq...
Groq response received
✅ Groq fallback successful!
```

### 10. Test Language Manager Integration

The brutalist page includes the Language Manager:
- Changes language selector in header
- Syncs with AI chat language
- Persists in localStorage

**Note**: The brutalist page currently doesn't have many `data-i18n` elements, so language switching won't affect the page content much. This is expected.

## Known Limitations

### Current State:
- ✅ 3 sample services only
- ✅ Forum messages stored in-memory (lost on page refresh)
- ✅ No reply functionality
- ✅ No message persistence to database
- ✅ No user authentication (all posts as "You")

### Future Enhancements:
- Add more service tiles (20+ services)
- Persist forum messages to MongoDB
- Add user authentication
- Add reply/thread functionality
- Add upvote/downvote system
- Add message search/filter
- Add real-time updates (WebSocket)

## Troubleshooting

### Issue: Nested window doesn't open
- **Check**: Browser console for JavaScript errors
- **Fix**: Ensure `openServiceWindow()` function is defined

### Issue: Translation not working
- **Check**: API keys in `.env` file
- **Check**: Network tab for `/api/ai/translate` request
- **Fix**: Verify Gemini/Groq API keys are valid

### Issue: Animations not smooth
- **Check**: Browser performance
- **Fix**: Reduce animation complexity or disable some effects

### Issue: Forum messages disappear
- **Expected**: Messages are in-memory only
- **Fix**: Implement database persistence (future enhancement)

## API Endpoint

### Translation API
```
POST /api/ai/translate
Content-Type: application/json

{
  "text": "Hello, how are you?",
  "targetLang": "hi"
}

Response:
{
  "translatedText": "नमस्ते, आप कैसे हैं?",
  "service": "gemini" // or "groq"
}
```

### Language Codes:
- `en` - English
- `hi` - Hindi
- `ta` - Tamil
- `te` - Telugu
- `bn` - Bengali
- `gu` - Gujarati
- `kn` - Kannada
- `mr` - Marathi

## Design Philosophy

### Brutalism Principles:
1. **Raw, Honest Design**: No unnecessary decoration
2. **High Contrast**: Black, white, red, yellow, cyan
3. **Bold Typography**: Space Grotesk + Space Mono
4. **Thick Borders**: 6-8px solid black borders
5. **Geometric Shapes**: Rectangles, no rounded corners
6. **Functional Animations**: Purposeful, not decorative
7. **Exposed Structure**: Grid patterns, visible construction

### Color Palette:
- `--black: #000000` - Primary
- `--white: #FFFFFF` - Background
- `--gray: #808080` - Secondary text
- `--accent: #FF0000` - Highlights
- `--yellow: #FFFF00` - Interactive elements
- `--cyan: #00FFFF` - Accents

### Typography:
- **Headings**: Space Mono (monospace, bold)
- **Body**: Space Grotesk (sans-serif)
- **Sizes**: 48px title, 24px headings, 16px body

## Success Criteria

The brutalist UI is working correctly if:
- ✅ All 3 service tiles are visible
- ✅ Tiles have hover effects
- ✅ Clicking tiles opens nested windows
- ✅ Windows display service details
- ✅ Forums are visible in each window
- ✅ Can post messages
- ✅ Messages are translated
- ✅ Animations are smooth
- ✅ Close button works
- ✅ ESC key closes windows

## Next Steps

After testing, consider:
1. Adding more service tiles from `data/bharatServices.json`
2. Implementing MongoDB persistence for forum messages
3. Adding user authentication
4. Creating reply/thread system
5. Adding more brutalist pages (stocks, market)
6. Implementing real-time updates
7. Adding accessibility features (ARIA labels, keyboard nav)

---

**Ready to test!** Start the server and visit http://localhost:5000/services-brutalist.html
