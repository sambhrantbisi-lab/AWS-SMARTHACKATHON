# Web Search Priority Fix ✅

## Issue Reported
AI was saying "not specified in OpenStreetMap data" even though web search was enabled and could potentially find the information online.

## Root Cause
The AI instructions didn't prioritize web search results. It was checking local OpenStreetMap data first and stopping there, without utilizing the web search results that were being fetched.

## Solution Applied

### 1. Reordered AI Instructions - Web Search First! ✅
**Files**: `public/nearby-brutalist.html`, `routes/ai-chat.js`

Changed the instruction priority to check web search FIRST:

#### Before (Wrong Priority):
```
1. Check local OpenStreetMap data
2. If not found, say "not available"
3. (Web search results ignored)
```

#### After (Correct Priority):
```
1. CHECK WEB SEARCH RESULTS FIRST ← NEW!
2. Then check local OpenStreetMap data
3. Combine both sources
4. Only if BOTH lack data, say "not available"
```

### 2. Enhanced Frontend Instructions ✅
**File**: `public/nearby-brutalist.html`

```javascript
detailedMessage += `CRITICAL INSTRUCTIONS - READ CAREFULLY:\n`;
detailedMessage += `1. OPENING HOURS:\n`;
detailedMessage += `   - FIRST: Check if web search results contain opening hours information\n`;
detailedMessage += `   - SECOND: If you see "Opening Hours: [value] ✓ DATA AVAILABLE" above, STATE THE HOURS\n`;
detailedMessage += `   - THIRD: If you see "Opening Hours: NOT AVAILABLE ✗" AND no web search results, say "Opening hours not specified in OpenStreetMap. Call ${placeData.phone || 'the facility'} to confirm."\n`;
detailedMessage += `   - If web search found hours, use them and cite the source\n`;
detailedMessage += `   - Check the tags JSON for "opening_hours" field as backup\n\n`;

detailedMessage += `2. WHEELCHAIR ACCESSIBILITY:\n`;
detailedMessage += `   - FIRST: Check if web search results mention wheelchair accessibility\n`;
detailedMessage += `   - SECOND: If you see "Wheelchair Accessible: yes ✓", say "Yes, wheelchair accessible"\n`;
detailedMessage += `   - If you see "Wheelchair Accessible: no ✓", say "Not wheelchair accessible according to data"\n`;
detailedMessage += `   - If you see "Wheelchair Accessible: limited ✓", say "Limited wheelchair accessibility"\n`;
detailedMessage += `   - If you see "NOT SPECIFIED ✗" AND no web search results, say "Not specified in OpenStreetMap. Call to confirm."\n`;
detailedMessage += `   - If web search found accessibility info, use it and cite the source\n\n`;

detailedMessage += `3. WEB SEARCH PRIORITY:\n`;
detailedMessage += `   - Web search results are CURRENT and should be prioritized over missing local data\n`;
detailedMessage += `   - If web search provides information that local data lacks, USE IT\n`;
detailedMessage += `   - Always cite the source when using web search: "According to [source], ..."\n`;
detailedMessage += `   - Combine local data (distance, address) with web search data (hours, reviews)\n\n`;

detailedMessage += `4. GENERAL RULES:\n`;
detailedMessage += `   - ALWAYS check web search results FIRST for missing data\n`;
detailedMessage += `   - ALWAYS check the data marked with ✓ before saying "not available"\n`;
detailedMessage += `   - If data has ✓, USE IT in your answer\n`;
detailedMessage += `   - If data has ✗ but web search has it, USE WEB SEARCH DATA\n`;
detailedMessage += `   - If both local and web search lack data, admit it and suggest calling\n`;
detailedMessage += `   - Be honest - never make up information\n\n`;
```

### 3. Updated Backend AI System Prompts ✅
**File**: `routes/ai-chat.js` (Both Gemini and Groq)

```javascript
CRITICAL INSTRUCTIONS FOR DATA HONESTY:

1. WEB SEARCH PRIORITY (MOST IMPORTANT):
   - If web search results are provided above, CHECK THEM FIRST
   - Web search results contain CURRENT information from the internet
   - Use web search to fill gaps in local OpenStreetMap data
   - Always cite the source: "According to [source], ..."
   - Combine local data (distance, address) with web search data (hours, reviews, accessibility)

2. OPENING HOURS:
   - FIRST: Check web search results for opening hours
   - SECOND: Check if context shows "Opening Hours: [value] ✓ DATA AVAILABLE" → STATE THE HOURS EXACTLY
   - THIRD: Check context.place.openingHours field
   - FOURTH: Check context.place.allTags.opening_hours as backup
   - If found anywhere, provide the hours with source
   - If not found anywhere, say "Opening hours not available. Call to confirm."
   
3. WHEELCHAIR ACCESSIBILITY:
   - FIRST: Check web search results for accessibility information
   - SECOND: Check if wheelchair data shows "yes/no/limited" in context
   - If found, state it clearly with source
   - If not found anywhere, say "Accessibility not specified. Call to confirm."
   
4. MISSING DATA HANDLING:
   - Be completely honest when data is not available ANYWHERE (local + web search)
   - ALWAYS check web search results before saying "not available"
   - ALWAYS check the provided context thoroughly before saying "not available"
   - If you see a field with actual data (not "Not available" or "Unknown"), USE IT
   - If data is truly missing everywhere, suggest calling the phone number
```

## Data Source Priority (New Order)

### For ANY Question:
1. **🌐 Web Search Results** (FIRST - Current, real-time data)
2. **✓ Local OpenStreetMap Data** (SECOND - Verified available data)
3. **📋 OSM Tags Backup** (THIRD - Additional OSM fields)
4. **❓ Admit Missing** (LAST - Only if all sources lack data)

## Expected Behavior Now

### Scenario 1: OSM Has Data
**User**: "What are the opening hours?"
**Local Data**: `Opening Hours: Mo-Fr 09:00-18:00 ✓`
**Web Search**: No additional info
**AI**: "Opening hours are Mo-Fr 09:00-18:00 according to OpenStreetMap."

### Scenario 2: OSM Missing, Web Search Has Data
**User**: "What are the opening hours?"
**Local Data**: `Opening Hours: NOT AVAILABLE ✗`
**Web Search**: "Hours: 9 AM - 6 PM daily (from Google)"
**AI**: "According to Google, the hours are 9 AM - 6 PM daily. Call [phone] to confirm current hours."

### Scenario 3: Both Have Data (Combine)
**User**: "Tell me about this place"
**Local Data**: Distance 2.5 km, Address available
**Web Search**: Hours, reviews, ratings
**AI**: "Located 2.5 km away at [address]. According to [source], hours are [hours] and it has [rating] stars. Call [phone] for more details."

### Scenario 4: Neither Has Data
**User**: "What are the opening hours?"
**Local Data**: `Opening Hours: NOT AVAILABLE ✗`
**Web Search**: No results found
**AI**: "Opening hours are not available in OpenStreetMap or online sources. Call [phone] to confirm current hours."

## Web Search Integration Flow

```
User asks question
    ↓
Frontend sends request with enableWebSearch: true
    ↓
Backend performs DuckDuckGo search
    ↓
Search results added to AI context (TOP of prompt)
    ↓
AI checks web search results FIRST
    ↓
AI checks local OSM data SECOND
    ↓
AI combines both sources
    ↓
AI provides comprehensive answer with citations
```

## Source Citation Examples

### Good Citations:
- "According to Google, the hours are..."
- "Based on DuckDuckGo search results, this facility..."
- "OpenStreetMap shows the distance is 2.5 km, and according to [website], they're open..."

### Bad Citations:
- "The hours are..." (no source)
- "I found that..." (vague)
- "It seems like..." (uncertain)

## Benefits

✅ **Current Information**: Web search provides real-time, up-to-date data
✅ **Comprehensive Answers**: Combines local + web data for complete picture
✅ **Source Transparency**: Always cites where information comes from
✅ **Fallback Coverage**: Multiple data sources reduce "not available" responses
✅ **User Trust**: Clear attribution builds confidence in answers
✅ **Actionable Advice**: Still suggests calling when all sources fail

## Testing

### Test 1: Place with No OSM Hours
1. Find a place without opening_hours in OSM
2. Ask: "what are the hours?"
3. Check if AI uses web search results
4. Verify source citation is included

### Test 2: Place with OSM Hours
1. Find a place with opening_hours in OSM
2. Ask: "what are the hours?"
3. Should use OSM data (more reliable)
4. May supplement with web search for additional context

### Test 3: Check Server Logs
```
🔍 Performing web search for query...
🔍 Searching for: "Apollo Hospital Delhi opening hours"
✅ Found 3 web search results
Querying Google Gemini...
Gemini response received
```

### Test 4: Check Browser Console
Look for the AI query message - should see:
```
🌐 WEB SEARCH RESULTS (Current Information from Internet):

1. Apollo Hospital Delhi
   Open 24/7, Emergency services available
   Source: https://...

2. ...
```

## Files Modified
1. `public/nearby-brutalist.html` - Reordered instructions, web search first
2. `routes/ai-chat.js` - Updated both Gemini and Groq system prompts

## Related Documents
- `WEB_SEARCH_RAG_COMPLETE.md` - Initial web search implementation
- `AI_DATA_HONESTY_FIX.md` - Data checking improvements
- `OPENING_HOURS_FIX.md` - Opening hours specific fixes

---

**Status**: ✅ COMPLETE AND READY FOR TESTING
**Date**: February 15, 2026
**Priority**: HIGH (Critical for data accuracy)
**Impact**: AI will now use web search to supplement missing local data
