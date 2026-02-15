# AI Data Honesty Fix - Wheelchair Accessibility ✅

## Issue Reported
AI was saying "I don't know" when asked about wheelchair accessibility, even when the data was available in OpenStreetMap.

## Root Causes Identified

### 1. Missing Tags Field
The place object was not storing ALL OpenStreetMap tags, only extracting specific fields. This meant any additional data (like detailed accessibility info) was lost.

### 2. Unclear AI Instructions
The AI system prompt didn't have explicit instructions on how to handle missing data vs. available data, leading to generic "I don't know" responses.

### 3. No Web Search Integration
The AI wasn't using web search to supplement missing local data.

## Fixes Applied

### 1. Store All OpenStreetMap Tags ✅
**File**: `public/nearby-brutalist.html`

Added `tags` field to place object to preserve ALL OpenStreetMap data:

```javascript
const place = {
    name: element.tags.name || `${category} (unnamed)`,
    category: category,
    distance: distance,
    lat: element.lat,
    lon: element.lon,
    address: element.tags['addr:full'] || element.tags['addr:street'] || 'Address not available',
    phone: element.tags.phone || element.tags['contact:phone'] || null,
    website: element.tags.website || element.tags['contact:website'] || null,
    email: element.tags.email || element.tags['contact:email'] || null,
    openingHours: element.tags.opening_hours || null,
    wheelchair: element.tags.wheelchair || null,
    cuisine: element.tags.cuisine || null,
    rating: element.tags['stars'] || null,
    capacity: element.tags.capacity || null,
    operator: element.tags.operator || null,
    brand: element.tags.brand || null,
    tags: element.tags // ← NEW: Store ALL OpenStreetMap tags for AI context
};
```

### 2. Enhanced AI Query Message ✅
**File**: `public/nearby-brutalist.html`

Updated the message sent to AI to include:
- All OpenStreetMap tags as JSON
- Explicit wheelchair accessibility status
- Clear instructions on how to handle missing data
- Web search enablement

```javascript
message: `User is asking about ${placeData.name} (a ${placeData.category}): "${userQuery}". 

Available information about this place from OpenStreetMap:
- Name: ${placeData.name}
- Category: ${placeData.category}
- Distance: ${placeData.distance.toFixed(2)} km from user
- Address: ${placeData.address}
- Opening Hours: ${placeData.openingHours || 'Not available'}
- Phone: ${placeData.phone || 'Not available'}
- Wheelchair Accessible: ${placeData.wheelchair || 'Not specified in OpenStreetMap data'}
- Brand: ${placeData.brand || 'Independent'}
- Operator: ${placeData.operator || 'Unknown'}
${placeData.cuisine ? `- Cuisine: ${placeData.cuisine}` : ''}
${placeData.website ? `- Website: Available` : ''}
${placeData.email ? `- Email: ${placeData.email}` : ''}
${placeData.capacity ? `- Capacity: ${placeData.capacity}` : ''}

ALL OpenStreetMap Tags Available: ${JSON.stringify(placeData.tags || {})}

IMPORTANT INSTRUCTIONS:
1. If wheelchair accessibility is asked and the data shows "wheelchair: yes" or "wheelchair: no", state it clearly
2. If wheelchair data is "Unknown" or "Not specified", say: "Wheelchair accessibility is not specified in OpenStreetMap data. I recommend calling ${placeData.phone || 'the facility'} to confirm accessibility features."
3. For any question where data is not available, suggest calling the phone number or checking the website
4. Use the web search results if available to provide current information
5. Be honest about data limitations - don't make up information

Provide a helpful 2-3 sentence answer based on the available data:`,
context: context,
enableWebSearch: true // ← NEW: Enable web search for current information
```

### 3. Improved Fallback Logic ✅
**File**: `public/nearby-brutalist.html`

Enhanced the client-side fallback to check both direct field and tags:

```javascript
} else if (queryLower.includes('wheelchair') || queryLower.includes('accessible')) {
    // Check both direct field and tags
    const wheelchairData = placeData.wheelchair || placeData.tags?.wheelchair;
    
    if (wheelchairData === 'yes') {
        advice = '✅ Yes, this location is wheelchair accessible according to OpenStreetMap data.';
    } else if (wheelchairData === 'no') {
        advice = '❌ According to OpenStreetMap, this location may not be wheelchair accessible. However, I recommend calling ahead to confirm current accessibility features.';
    } else if (wheelchairData === 'limited') {
        advice = '⚠️ This location has limited wheelchair accessibility. Call ahead to discuss specific accessibility needs.';
    } else {
        advice = '❓ Wheelchair accessibility information is not specified in OpenStreetMap data. ';
        if (placeData.phone) {
            advice += `I strongly recommend calling ${placeData.phone} to ask about ramps, elevators, accessible restrooms, and other accessibility features.`;
        } else {
            advice += 'Call ahead to ask about ramps, elevators, accessible restrooms, and other accessibility features.';
        }
    }
}
```

### 4. AI System Prompt Enhancement ✅
**File**: `routes/ai-chat.js`

Added explicit instructions to both Gemini and Groq AI models:

```javascript
CRITICAL INSTRUCTIONS FOR DATA HONESTY:
1. WHEELCHAIR ACCESSIBILITY:
   - If wheelchair data shows "yes" → Say "Yes, wheelchair accessible"
   - If wheelchair data shows "no" → Say "Not wheelchair accessible according to data"
   - If wheelchair data shows "limited" → Say "Limited wheelchair accessibility"
   - If wheelchair data is "Unknown" or "Not specified" → Say "Wheelchair accessibility is not specified in OpenStreetMap data. Recommend calling to confirm."
   
2. MISSING DATA:
   - Be completely honest when data is not available
   - Never say "I don't know" without checking the provided context first
   - If data exists in the context, use it
   - If data is missing, suggest calling the phone number or checking the website
   
3. WEB SEARCH:
   - If web search results are provided, use them to supplement the local data
   - Cite sources when using web search information
   
4. GENERAL:
   - When the user asks about what's on screen, list the VISIBLE items shown above
   - Reference specific stock symbols, commodity names, or services from the visible list
   - Be specific and use the actual data from the context
   - Provide helpful, actionable advice

Provide a helpful, concise answer (2-3 sentences max) based on the context above:
```

## Expected Behavior Now

### Scenario 1: Wheelchair Data Available (Yes)
**User**: "Is this hospital wheelchair accessible?"
**AI**: "✅ Yes, this location is wheelchair accessible according to OpenStreetMap data."

### Scenario 2: Wheelchair Data Available (No)
**User**: "Is this hospital wheelchair accessible?"
**AI**: "❌ According to OpenStreetMap, this location may not be wheelchair accessible. However, I recommend calling ahead to confirm current accessibility features."

### Scenario 3: Wheelchair Data Available (Limited)
**User**: "Is this hospital wheelchair accessible?"
**AI**: "⚠️ This location has limited wheelchair accessibility. Call ahead to discuss specific accessibility needs."

### Scenario 4: Wheelchair Data Not Available
**User**: "Is this hospital wheelchair accessible?"
**AI**: "❓ Wheelchair accessibility is not specified in OpenStreetMap data. I strongly recommend calling [phone number] to ask about ramps, elevators, accessible restrooms, and other accessibility features."

### Scenario 5: Web Search Provides Additional Info
**User**: "Is this hospital wheelchair accessible?"
**AI**: "Wheelchair accessibility is not specified in OpenStreetMap data. However, according to [web source], this facility has wheelchair ramps and accessible parking. I recommend calling to confirm current accessibility features."

## Data Flow

```
User asks question
    ↓
Frontend collects place data (including ALL tags)
    ↓
Web search performed (if enabled)
    ↓
AI receives:
    - All place data fields
    - Complete OpenStreetMap tags as JSON
    - Web search results (if available)
    - Explicit instructions on data honesty
    ↓
AI checks context thoroughly
    ↓
AI provides honest, actionable answer
    ↓
If AI fails, fallback logic provides smart response
```

## Files Modified
1. `public/nearby-brutalist.html` - Added tags field, enhanced AI query, improved fallback
2. `routes/ai-chat.js` - Enhanced system prompts for both Gemini and Groq

## Testing Checklist
- [ ] Test with place that HAS wheelchair:yes in OSM
- [ ] Test with place that HAS wheelchair:no in OSM
- [ ] Test with place that HAS wheelchair:limited in OSM
- [ ] Test with place that has NO wheelchair data in OSM
- [ ] Test with web search providing additional info
- [ ] Test fallback logic when AI service is unavailable
- [ ] Test with other questions (parking, hours, etc.)

## Benefits
✅ AI now checks ALL available data before saying "I don't know"
✅ Explicit handling of wheelchair accessibility with clear symbols
✅ Web search supplements missing local data
✅ Fallback logic provides smart responses even if AI fails
✅ Users get actionable advice (call phone number, check website)
✅ Complete transparency about data sources and limitations

---

**Status**: ✅ COMPLETE AND READY FOR TESTING
**Date**: February 15, 2026
**Priority**: HIGH (Accessibility is critical)
