# Opening Hours Data Fix ✅

## Issue Reported
AI was saying "opening hours data is not available" even when the data existed in OpenStreetMap.

## Root Cause
The AI wasn't explicitly checking the data fields before responding. It needed clearer instructions with visual markers (✓ and ✗) to distinguish between available and missing data.

## Solution Applied

### 1. Enhanced Message Format with Visual Markers ✅
**File**: `public/nearby-brutalist.html`

Created a detailed message builder that explicitly marks data availability:

```javascript
// Build detailed message with explicit data checks
let detailedMessage = `User is asking about ${placeData.name} (a ${placeData.category}): "${userQuery}"\n\n`;

detailedMessage += `AVAILABLE DATA FROM OPENSTREETMAP:\n`;
detailedMessage += `- Name: ${placeData.name}\n`;
detailedMessage += `- Category: ${placeData.category}\n`;
detailedMessage += `- Distance: ${placeData.distance.toFixed(2)} km from user\n`;
detailedMessage += `- Address: ${placeData.address}\n`;

// Opening Hours - be explicit
if (placeData.openingHours) {
    detailedMessage += `- Opening Hours: ${placeData.openingHours} ✓ DATA AVAILABLE\n`;
} else if (placeData.tags?.opening_hours) {
    detailedMessage += `- Opening Hours: ${placeData.tags.opening_hours} ✓ DATA AVAILABLE\n`;
} else {
    detailedMessage += `- Opening Hours: NOT AVAILABLE IN OPENSTREETMAP ✗\n`;
}

// Phone
if (placeData.phone) {
    detailedMessage += `- Phone: ${placeData.phone} ✓ DATA AVAILABLE\n`;
} else {
    detailedMessage += `- Phone: NOT AVAILABLE ✗\n`;
}

// Wheelchair
if (placeData.wheelchair) {
    detailedMessage += `- Wheelchair Accessible: ${placeData.wheelchair} ✓ DATA AVAILABLE\n`;
} else if (placeData.tags?.wheelchair) {
    detailedMessage += `- Wheelchair Accessible: ${placeData.tags.wheelchair} ✓ DATA AVAILABLE\n`;
} else {
    detailedMessage += `- Wheelchair Accessible: NOT SPECIFIED IN OPENSTREETMAP ✗\n`;
}
```

### 2. Explicit AI Instructions ✅
**File**: `public/nearby-brutalist.html`

Added crystal-clear instructions for the AI:

```javascript
detailedMessage += `CRITICAL INSTRUCTIONS - READ CAREFULLY:\n`;
detailedMessage += `1. OPENING HOURS:\n`;
detailedMessage += `   - If you see "Opening Hours: [value] ✓ DATA AVAILABLE" above, STATE THE HOURS\n`;
detailedMessage += `   - If you see "Opening Hours: NOT AVAILABLE ✗", say "Opening hours not specified in OpenStreetMap. Call ${placeData.phone || 'the facility'} to confirm."\n`;
detailedMessage += `   - Check the tags JSON for "opening_hours" field as backup\n\n`;

detailedMessage += `2. WHEELCHAIR ACCESSIBILITY:\n`;
detailedMessage += `   - If you see "Wheelchair Accessible: yes ✓", say "Yes, wheelchair accessible"\n`;
detailedMessage += `   - If you see "Wheelchair Accessible: no ✓", say "Not wheelchair accessible according to data"\n`;
detailedMessage += `   - If you see "Wheelchair Accessible: limited ✓", say "Limited wheelchair accessibility"\n`;
detailedMessage += `   - If you see "NOT SPECIFIED ✗", say "Not specified in OpenStreetMap. Call to confirm."\n\n`;

detailedMessage += `3. GENERAL RULES:\n`;
detailedMessage += `   - ALWAYS check the data marked with ✓ before saying "not available"\n`;
detailedMessage += `   - If data has ✓, USE IT in your answer\n`;
detailedMessage += `   - If data has ✗, admit it's not available and suggest calling\n`;
detailedMessage += `   - Use web search results if provided to supplement missing data\n`;
detailedMessage += `   - Be honest - never make up information\n\n`;
```

### 3. Improved Fallback Logic ✅
**File**: `public/nearby-brutalist.html`

Enhanced client-side fallback to check both fields and tags:

```javascript
} else if (queryLower.includes('open') || queryLower.includes('hours') || queryLower.includes('timing')) {
    // Check both direct field and tags
    const hoursData = placeData.openingHours || placeData.tags?.opening_hours;
    
    if (hoursData) {
        advice = `🕐 Opening hours: ${hoursData}. Note that hours may vary on holidays or special occasions.`;
    } else {
        advice = '❓ Opening hours are not specified in OpenStreetMap data. ';
        if (placeData.phone) {
            advice += `Call ${placeData.phone} to confirm current hours and any holiday schedules.`;
        } else {
            advice += 'Call ahead to confirm current hours and any holiday schedules.';
        }
    }
}
```

### 4. Updated AI System Prompts ✅
**File**: `routes/ai-chat.js`

Enhanced both Gemini and Groq system prompts:

```javascript
CRITICAL INSTRUCTIONS FOR DATA HONESTY:

1. OPENING HOURS:
   - If the context shows "Opening Hours: [value] ✓ DATA AVAILABLE" → STATE THE HOURS EXACTLY
   - If it shows "Opening Hours: NOT AVAILABLE ✗" → Say "Opening hours not specified in OpenStreetMap"
   - Check context.place.openingHours field
   - Check context.place.allTags.opening_hours as backup
   - If found, provide the hours. If not found, admit it and suggest calling
   
2. WHEELCHAIR ACCESSIBILITY:
   - If wheelchair data shows "yes" → Say "Yes, wheelchair accessible"
   - If wheelchair data shows "no" → Say "Not wheelchair accessible according to data"
   - If wheelchair data shows "limited" → Say "Limited wheelchair accessibility"
   - If wheelchair data is "Unknown" or "Not specified" → Say "Wheelchair accessibility is not specified in OpenStreetMap data. Recommend calling to confirm."
   
3. MISSING DATA:
   - Be completely honest when data is not available
   - ALWAYS check the provided context thoroughly before saying "not available"
   - If you see a field with actual data (not "Not available" or "Unknown"), USE IT
   - If data is truly missing, suggest calling the phone number or checking the website
```

## Expected Behavior Now

### Scenario 1: Opening Hours Available
**User**: "What are the opening hours?"
**AI**: "🕐 Opening hours: Mo-Fr 09:00-18:00, Sa 10:00-14:00. Note that hours may vary on holidays or special occasions."

### Scenario 2: Opening Hours Not Available
**User**: "What are the opening hours?"
**AI**: "❓ Opening hours are not specified in OpenStreetMap data. Call [phone number] to confirm current hours and any holiday schedules."

### Scenario 3: "Open now?" Question
**User**: "Is it open now?"
**AI with hours**: "According to OpenStreetMap, the hours are Mo-Fr 09:00-18:00. [Current time analysis]. Call to confirm."
**AI without hours**: "Opening hours are not specified. Call [phone number] to check if they're currently open."

### Scenario 4: Multiple Data Points
**User**: "Tell me about this place"
**AI**: "This is [name], a [category] located [distance] away. Opening hours: [hours] ✓. Wheelchair accessible: [yes/no] ✓. Phone: [number] ✓."

## Visual Markers System

### ✓ DATA AVAILABLE
- Indicates the field has actual data from OpenStreetMap
- AI should USE this data in the response
- Example: `Opening Hours: Mo-Fr 09:00-18:00 ✓ DATA AVAILABLE`

### ✗ NOT AVAILABLE
- Indicates the field is missing from OpenStreetMap
- AI should admit it's not available and suggest calling
- Example: `Opening Hours: NOT AVAILABLE IN OPENSTREETMAP ✗`

## Data Checking Priority

1. **Primary Field**: Check `placeData.openingHours`
2. **Backup Field**: Check `placeData.tags?.opening_hours`
3. **Tags JSON**: Check complete tags object
4. **Web Search**: Use web search results if available
5. **Fallback**: Admit not available, suggest calling

## Benefits

✅ **Visual Clarity**: ✓ and ✗ markers make data availability obvious
✅ **Explicit Instructions**: AI knows exactly what to do with each marker
✅ **Dual Checking**: Checks both direct field and tags object
✅ **Fallback Safety**: Client-side logic handles AI failures
✅ **Actionable Advice**: Always provides phone number when data is missing
✅ **Web Search Integration**: Supplements missing data with online info
✅ **Honest Responses**: Never makes up information

## Testing

### Test 1: Place with Opening Hours
1. Search for hospitals/pharmacies/banks
2. Click AI recommendation
3. Ask: "what are the hours?" or "open now?"
4. Should see actual hours if available in OSM

### Test 2: Place without Opening Hours
1. Search for parks or ATMs (often no hours)
2. Click AI recommendation
3. Ask: "what are the hours?"
4. Should see "not specified" with phone number

### Test 3: Check Console
```javascript
// Should see in message:
"Opening Hours: Mo-Fr 09:00-18:00 ✓ DATA AVAILABLE"
// or
"Opening Hours: NOT AVAILABLE IN OPENSTREETMAP ✗"
```

## Files Modified
1. `public/nearby-brutalist.html` - Enhanced message builder with visual markers
2. `routes/ai-chat.js` - Updated system prompts for both Gemini and Groq

## Common OpenStreetMap Opening Hours Formats

- `24/7` - Open 24 hours, 7 days a week
- `Mo-Fr 09:00-18:00` - Monday to Friday, 9 AM to 6 PM
- `Mo-Fr 09:00-18:00; Sa 10:00-14:00` - Different hours on Saturday
- `Mo-Su 08:00-20:00` - Monday to Sunday
- `Mo-Fr 09:00-18:00; PH off` - Closed on public holidays

The AI will now correctly interpret and relay these formats to users.

---

**Status**: ✅ COMPLETE AND READY FOR TESTING
**Date**: February 15, 2026
**Priority**: HIGH (Critical user information)
**Related**: AI_DATA_HONESTY_FIX.md, WEB_SEARCH_RAG_COMPLETE.md
