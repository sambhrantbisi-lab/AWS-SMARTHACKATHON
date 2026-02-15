# Google Custom Search API Setup Guide

## Why Google Custom Search?

DuckDuckGo's Instant Answer API doesn't work well for specific business queries like:
- "Apollo Hospital Delhi opening hours"
- "wheelchair accessible restaurants near me"
- "pharmacy open now"

Google Custom Search provides:
- ✅ Accurate business information
- ✅ Real-time data
- ✅ 100 free queries per day
- ✅ Better results for local businesses

## Setup Steps

### Step 1: Get Google Custom Search API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Custom Search API":
   - Go to "APIs & Services" → "Library"
   - Search for "Custom Search API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
5. (Optional) Restrict the API key:
   - Click on the API key
   - Under "API restrictions", select "Custom Search API"
   - Save

### Step 2: Create Custom Search Engine

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" or "Create"
3. Configure your search engine:
   - **Name**: "Digital India Business Search" (or any name)
   - **What to search**: Select "Search the entire web"
   - **Search settings**: Enable "Image search" and "SafeSearch"
4. Click "Create"
5. Copy the "Search engine ID" (looks like: `0123456789abcdef:ghijklmnop`)

### Step 3: Add to .env File

Add these lines to your `.env` file:

```bash
# Web Search for AI
GOOGLE_SEARCH_API_KEY=AIzaSy...your_api_key_here
GOOGLE_SEARCH_ENGINE_ID=0123456789abcdef:ghijklmnop
```

### Step 4: Restart Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm start
```

## Testing

1. Open browser console (F12)
2. Go to nearby services page
3. Search for hospitals
4. Click on an AI recommendation
5. Ask: "what are the opening hours?"
6. Check server logs for:
   ```
   🔍 Using Google Custom Search API...
   ✅ Google Search found 5 results
   ```

## Free Tier Limits

- **100 queries per day** (free)
- **10,000 queries per day** (paid, $5 per 1,000 queries after first 10k)

For a small application with ~50 users asking ~2 questions each per day = 100 queries/day (within free tier!)

## Alternative: Disable Web Search

If you don't want to set up Google Search, the app will still work with OpenStreetMap data only. Just don't add the API keys.

The AI will say:
- "Opening hours not specified in OpenStreetMap. Call [phone] to confirm."

This is honest and provides actionable advice.

## Cost Estimate

### Free Tier (100 queries/day):
- **Cost**: $0
- **Usage**: ~50 users, 2 questions each
- **Perfect for**: Development, small deployments

### Paid Tier (10,000 queries/day):
- **Cost**: $5 per 1,000 queries after first 10,000
- **Usage**: ~5,000 users, 2 questions each
- **Perfect for**: Production, large deployments

## Troubleshooting

### "API key not valid"
- Check that Custom Search API is enabled in Google Cloud Console
- Verify the API key is copied correctly
- Check API key restrictions

### "Search engine ID not found"
- Verify the search engine ID from Programmable Search Engine console
- Make sure it includes the colon (`:`) in the middle

### "Quota exceeded"
- You've hit the 100 queries/day limit
- Wait until tomorrow or upgrade to paid tier
- App will fall back to DuckDuckGo (limited results)

### Still no results?
- Check server logs for error messages
- Verify internet connection
- Try a different search query

## Benefits of Google Search

### Before (DuckDuckGo only):
```
User: "What are the opening hours?"
AI: "Opening hours not specified in OpenStreetMap."
```

### After (with Google Search):
```
User: "What are the opening hours?"
AI: "According to Google, Apollo Hospital Delhi is open 24/7 with emergency services available. Call +91-11-2692-5858 to confirm."
```

Much better user experience!

---

**Setup Time**: 10-15 minutes
**Cost**: Free (100 queries/day)
**Benefit**: Much better AI responses with current information
