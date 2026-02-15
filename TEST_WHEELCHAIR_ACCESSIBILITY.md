# Testing Wheelchair Accessibility AI Responses

## Quick Test Guide

### Setup
1. Start the server: `npm start` or `node server.js`
2. Open browser: `http://localhost:5000/nearby-brutalist.html`
3. Enable location access (or use manual coordinates)

### Test Scenarios

#### Test 1: Hospital with Wheelchair Data
1. Select "HOSPITALS" category
2. Click "SEARCH NEARBY"
3. Wait for AI recommendations to load
4. Click on an AI recommendation tile
5. In the chat input, type: **"is this wheelchair accessible?"**
6. Press Enter

**Expected Result**:
- If OSM has `wheelchair:yes` → "✅ Yes, wheelchair accessible"
- If OSM has `wheelchair:no` → "❌ Not wheelchair accessible, call to confirm"
- If OSM has `wheelchair:limited` → "⚠️ Limited accessibility"
- If no data → "❓ Not specified in OpenStreetMap, call [phone] to confirm"

#### Test 2: Pharmacy Accessibility
1. Select "PHARMACY" category
2. Click "SEARCH NEARBY"
3. Click on an AI recommendation
4. Ask: **"wheelchair accessible?"**

**Expected Result**: Clear answer based on available data, with phone number suggestion if data is missing

#### Test 3: Restaurant with Custom Requirements
1. Select "RESTAURANTS" category
2. In "CUSTOM REQUIREMENTS" field, type: **"wheelchair accessible"**
3. Click "SEARCH NEARBY"
4. AI should prioritize wheelchair-accessible restaurants

**Expected Result**: AI recommendations should favor places with `wheelchair:yes` in OSM data

#### Test 4: Multiple Questions
1. Select any category and search
2. Click on an AI recommendation
3. Ask multiple questions:
   - "wheelchair accessible?"
   - "has parking?"
   - "open now?"
   - "what are the hours?"

**Expected Result**: Each question should get a specific answer based on available data

#### Test 5: Fallback Logic (No AI)
1. Disconnect internet or disable AI API keys temporarily
2. Select a category and search
3. Click on a recommendation
4. Ask: "wheelchair accessible?"

**Expected Result**: Fallback logic should provide smart response with emojis and phone number

### What to Look For

#### ✅ Good Responses
- Clear yes/no/limited/unknown status
- Emoji indicators (✅ ❌ ⚠️ ❓)
- Phone number included when data is missing
- Actionable advice ("call to confirm", "check website")
- References to data source ("according to OpenStreetMap")

#### ❌ Bad Responses
- Generic "I don't know" without checking data
- Making up information not in the data
- Not suggesting to call when data is missing
- Ignoring available wheelchair data

### Sample Test Locations

#### Delhi Area (28.6139, 77.2090)
- Many hospitals with OSM data
- Good mix of accessible and non-accessible places

#### Mumbai Area (19.0760, 72.8777)
- Large number of services
- Varied accessibility data

#### Bangalore Area (12.9716, 77.5946)
- Tech-friendly area with good OSM coverage
- Modern facilities often have accessibility data

### Debugging

#### Check Browser Console
```javascript
// Should see:
console.log('Place data:', allPlacesData);
// Should include 'tags' field with all OSM data
```

#### Check Network Tab
- Look for `/api/ai/ai-query` requests
- Check request payload includes:
  - `message` with wheelchair question
  - `context.place.wheelchair` field
  - `context.place.allTags` with complete OSM data
  - `enableWebSearch: true`

#### Check Server Logs
```
📊 Rate Limit Tracker: X req/min, Y req/day
🔍 Performing web search for query...
✅ Found N web search results
Querying Google Gemini...
Gemini response received
```

### Common Issues & Solutions

#### Issue: AI still says "I don't know"
**Solution**: 
1. Check if place has wheelchair data in OSM
2. Verify `tags` field is present in place object
3. Check AI system prompt includes data honesty instructions
4. Try refreshing the page (cache issue)

#### Issue: No AI recommendations appear
**Solution**:
1. Check browser console for errors
2. Verify API keys are configured in `.env`
3. Check rate limits (15 RPM for Gemini)
4. Try selecting different categories

#### Issue: Fallback doesn't work
**Solution**:
1. Check if fallback logic is in try-catch block
2. Verify wheelchair check includes both `placeData.wheelchair` and `placeData.tags?.wheelchair`
3. Check console for JavaScript errors

### Expected Console Output

```
📍 Location obtained: {lat: 28.6139, lon: 77.2090}
Found 45 places
AI response for hospital: Apollo Hospital is recommended...
Added AI recommendation for hospital: Apollo Hospital
Total recommendations to display: 3
Place data stored for ai-tile-0
🔍 Searching for: "Apollo Hospital Delhi wheelchair accessible"
✅ Found 3 web search results
Querying Google Gemini...
Gemini response received
```

### Success Criteria

✅ AI provides specific answer when data is available
✅ AI admits when data is missing and suggests calling
✅ Fallback logic works when AI is unavailable
✅ Web search supplements missing data
✅ Phone numbers are included in responses
✅ Emoji indicators make responses clear
✅ All OSM tags are accessible to AI
✅ Custom requirements filter works

---

**Test Duration**: 10-15 minutes
**Priority**: HIGH (Accessibility is critical)
**Status**: Ready for testing
