# Context Issue Diagnosis

## Problem Identified
DuckDuckGo Instant Answer API returns empty results for specific business queries like "Apollo Hospital Delhi opening hours".

## Test Results
```
Query: "Apollo Hospital Delhi opening hours"
Response: 202 (Accepted)
Abstract: "" (empty)
RelatedTopics: [] (empty)
```

## Root Cause
DuckDuckGo's Instant Answer API is designed for:
- General knowledge queries ("What is Python?")
- Wikipedia summaries
- Dictionary definitions
- Simple facts

It does NOT work well for:
- Specific business information
- Opening hours
- Real-time data
- Local business details

## Solutions

### Option 1: Google Custom Search API (Recommended)
- **Pros**: Accurate, comprehensive results
- **Cons**: Requires API key, 100 free queries/day
- **Setup**: https://developers.google.com/custom-search/v1/overview

### Option 2: SerpAPI
- **Pros**: Easy to use, good results
- **Cons**: Requires API key, limited free tier
- **Setup**: https://serpapi.com/

### Option 3: Bing Search API
- **Pros**: Microsoft Azure, good results
- **Cons**: Requires API key and Azure account
- **Setup**: https://www.microsoft.com/en-us/bing/apis/bing-web-search-api

### Option 4: Web Scraping (Not Recommended)
- **Pros**: No API key needed
- **Cons**: Unreliable, may break, legal issues

### Option 5: Disable Web Search, Focus on Local Data
- **Pros**: No external dependencies
- **Cons**: Limited to OpenStreetMap data only

## Recommended Immediate Fix

Since web search isn't working reliably, we should:

1. **Improve OpenStreetMap data usage**
   - Extract ALL available tags
   - Parse opening_hours format better
   - Show raw data when available

2. **Better fallback messages**
   - Be honest about data limitations
   - Provide actionable advice (call, visit website)
   - Show what data IS available

3. **Add Google Places API (Optional)**
   - More reliable for business data
   - Requires API key but has generous free tier
   - 28,000 free requests/month

## Current Status

The AI is working correctly, but web search is returning empty results. The "no context" issue is because:

1. OpenStreetMap data may not have opening hours for that specific place
2. Web search (DuckDuckGo) returns empty results
3. AI correctly reports "not available" because both sources lack data

## What Users See

**User**: "What are the opening hours?"

**AI Response**: "Opening hours are not specified in OpenStreetMap data. Call [phone] to confirm."

This is CORRECT behavior when:
- OSM doesn't have the data
- Web search returns nothing
- Phone number is available

## Next Steps

1. **Short-term**: Improve messaging to be more helpful
2. **Medium-term**: Add Google Custom Search API
3. **Long-term**: Add Google Places API for business data

Would you like me to:
A) Implement Google Custom Search API (requires API key)
B) Implement Google Places API (requires API key)
C) Improve the current fallback messages
D) All of the above
