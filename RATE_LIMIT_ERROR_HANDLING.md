# 🚦 Rate Limit Error Handling - Complete Guide

## ✅ What Was Implemented

Enhanced the AI chat route to properly handle and display Gemini API 429 (rate limit) errors with detailed information.

---

## 🔧 Features Added

### 1. Detailed 429 Error Logging

When a rate limit error occurs, the server now logs:

```javascript
🚫 GEMINI RATE LIMIT (429) ERROR:
Status: 429
Error Details: {
  "error": {
    "code": 429,
    "message": "Resource has been exhausted (e.g. check quota).",
    "status": "RESOURCE_EXHAUSTED"
  }
}
Gemini Message: Resource has been exhausted (e.g. check quota).
```

### 2. User-Friendly Error Messages

Instead of a generic error, users now see:

```
⚠️ Rate Limit Reached

Resource has been exhausted (e.g. check quota).

Gemini API Free Tier Limits:
- Gemini 2.5 Flash: 10 requests/minute, 250 requests/day
- Please wait a moment and try again.
```

### 3. Rate Limit Tracking

The server now tracks requests in real-time:

```javascript
📊 Rate Limit Tracker: 5 req/min, 45 req/day
⚠️ Approaching RPM limit: 8/10
⚠️ Approaching daily limit: 200/250
```

**Warnings trigger at:**
- 8 requests/minute (80% of 10 RPM limit)
- 200 requests/day (80% of 250 RPD limit)

### 4. Enhanced Error Handling

Added specific handling for:
- ✅ **429 Rate Limit** - Shows Gemini's message + limit info
- ✅ **Network Errors** - Connection refused/not found
- ✅ **Timeout Errors** - Request took too long
- ✅ **Other API Errors** - Generic error handling

---

## 📊 Gemini API Rate Limits (Free Tier)

### Current Limits (as of 2026)

**Gemini 2.5 Flash** (what we're using):
- **10 requests per minute (RPM)**
- **250,000 tokens per minute (TPM)**
- **250 requests per day (RPD)**
- Resets at midnight Pacific Time

**Other Models:**
- Gemini 2.5 Pro: 5 RPM, 100 RPD
- Gemini 2.5 Flash-Lite: 15 RPM, 1,000 RPD

### What Triggers 429 Errors

1. **RPM Exceeded**: More than 10 requests in 60 seconds
2. **TPM Exceeded**: More than 250,000 tokens in 60 seconds
3. **RPD Exceeded**: More than 250 requests since midnight PT

---

## 🧪 How to Test

### Test Rate Limit Error

1. **Rapid Fire Test** (trigger RPM limit):
   ```bash
   # Send 15 requests quickly
   for i in {1..15}; do
     curl -X POST http://localhost:5000/api/ai/ai-query \
       -H "Content-Type: application/json" \
       -d '{"message":"test"}' &
   done
   ```

2. **Check Server Logs**:
   ```
   📊 Rate Limit Tracker: 1 req/min, 1 req/day
   📊 Rate Limit Tracker: 2 req/min, 2 req/day
   ...
   📊 Rate Limit Tracker: 10 req/min, 10 req/day
   ⚠️ Approaching RPM limit: 10/10
   📊 Rate Limit Tracker: 11 req/min, 11 req/day
   🚫 GEMINI RATE LIMIT (429) ERROR:
   Gemini Message: Resource has been exhausted (e.g. check quota).
   ```

3. **Check AI Response**:
   The AI will respond with the rate limit message including Gemini's error.

### Test in Browser

1. Visit http://localhost:5000/stocks.html
2. Open AI chat panel
3. Send 10+ messages rapidly
4. On the 11th message, you should see the rate limit error

---

## 📝 Server Log Examples

### Normal Request
```
📊 Rate Limit Tracker: 3 req/min, 25 req/day
📊 Received context: { visibleStocks: [...] }
📈 Stocks in context: 30
Gemini response received
```

### Approaching Limit
```
📊 Rate Limit Tracker: 8 req/min, 45 req/day
⚠️ Approaching RPM limit: 8/10
📊 Received context: { visibleStocks: [...] }
Gemini response received
```

### Rate Limit Hit
```
📊 Rate Limit Tracker: 11 req/min, 52 req/day
⚠️ Approaching RPM limit: 11/10
📊 Received context: { visibleStocks: [...] }
🚫 GEMINI RATE LIMIT (429) ERROR:
Status: 429
Error Details: {
  "error": {
    "code": 429,
    "message": "Resource has been exhausted (e.g. check quota).",
    "status": "RESOURCE_EXHAUSTED"
  }
}
Gemini Message: Resource has been exhausted (e.g. check quota).
```

---

## 🔍 Understanding the Error Response

### Gemini's 429 Response Structure

```json
{
  "error": {
    "code": 429,
    "message": "Resource has been exhausted (e.g. check quota).",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RATE_LIMIT_EXCEEDED",
        "domain": "googleapis.com",
        "metadata": {
          "quota_limit": "RequestsPerMinutePerProject",
          "quota_location": "global",
          "consumer": "projects/YOUR_PROJECT_ID"
        }
      }
    ]
  }
}
```

### What Each Field Means

- **code**: HTTP status code (429)
- **message**: Human-readable error description
- **status**: Error type (RESOURCE_EXHAUSTED)
- **reason**: Specific reason (RATE_LIMIT_EXCEEDED)
- **quota_limit**: Which limit was hit (RPM, TPM, or RPD)

---

## 💡 Best Practices

### For Development

1. **Monitor the tracker**: Watch server logs for approaching limits
2. **Test with delays**: Add 6-second delays between test requests
3. **Use test page**: http://localhost:5000/test-volume-context.html
4. **Clear history**: Reduce token usage by clearing chat history

### For Production

1. **Implement client-side rate limiting**: Don't let users spam requests
2. **Add retry logic**: Wait 60 seconds and retry on 429
3. **Cache responses**: Store common queries
4. **Upgrade to paid tier**: If you need more than 250 req/day

### Avoiding Rate Limits

**RPM (10 requests/minute):**
- Add 6-second minimum delay between requests
- Implement request queuing
- Show "AI is thinking..." for longer

**RPD (250 requests/day):**
- Cache common queries
- Implement user quotas (e.g., 10 messages/user/day)
- Clear chat history to reduce token usage
- Upgrade to paid tier for production

**TPM (250,000 tokens/minute):**
- Limit context size (currently sending 30 stocks max)
- Summarize long conversations
- Use shorter system prompts

---

## 🚀 Rate Limit Tracker Features

### In-Memory Tracking

The tracker stores request timestamps in memory:

```javascript
rateLimitTracker = {
  requests: [timestamp1, timestamp2, ...],
  addRequest: function() { ... },
  getRequestsLastMinute: function() { ... },
  getRequestsToday: function() { ... }
}
```

**Note**: Resets on server restart. For production, use Redis or database.

### Automatic Cleanup

Old requests are automatically removed:
- Requests older than 60 seconds removed from RPM count
- Requests older than today removed from RPD count

### Warning Thresholds

Warnings appear at 80% of limits:
- RPM: 8/10 requests
- RPD: 200/250 requests

---

## 📁 Files Modified

### Backend
- ✅ `routes/ai-chat.js` - Added 429 handling, rate tracking, detailed logging

### What Changed

**Before:**
```javascript
} else {
    const errorData = await response.json();
    console.error('Gemini API error:', response.status, errorData);
}
```

**After:**
```javascript
} else {
    const errorData = await response.json();
    
    // Handle 429 Rate Limit errors specifically
    if (response.status === 429) {
        console.error('🚫 GEMINI RATE LIMIT (429) ERROR:');
        console.error('Status:', response.status);
        console.error('Error Details:', JSON.stringify(errorData, null, 2));
        
        let errorMessage = 'Rate limit exceeded. Please try again later.';
        if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
            console.error('Gemini Message:', errorMessage);
        }
        
        return `⚠️ Rate Limit Reached\n\n${errorMessage}\n\n...`;
    }
    
    console.error('Gemini API error:', response.status, errorData);
}
```

---

## ✅ Benefits

### For Developers

1. **Clear visibility**: See exactly when limits are hit
2. **Proactive warnings**: Know when approaching limits
3. **Easy debugging**: Detailed logs with Gemini's message
4. **Usage tracking**: Monitor request patterns

### For Users

1. **Better error messages**: Understand why AI isn't responding
2. **Clear guidance**: Know when to try again
3. **No confusion**: Explicit rate limit information

---

## 🎯 Quick Reference

### Current Configuration

- **Model**: Gemini 2.5 Flash
- **RPM Limit**: 10 requests/minute
- **RPD Limit**: 250 requests/day
- **TPM Limit**: 250,000 tokens/minute
- **Warning Threshold**: 80% (8 RPM, 200 RPD)

### Server Logs to Watch

```
✅ Normal: 📊 Rate Limit Tracker: X req/min, Y req/day
⚠️ Warning: ⚠️ Approaching RPM limit: 8/10
🚫 Error: 🚫 GEMINI RATE LIMIT (429) ERROR:
```

### User Messages

```
✅ Normal: AI responds normally
⚠️ Rate Limit: "⚠️ Rate Limit Reached\n\nResource has been exhausted..."
```

---

## 🔮 Future Enhancements

### Potential Improvements

1. **Persistent tracking**: Use Redis/database instead of memory
2. **Per-user limits**: Track limits per user, not globally
3. **Automatic retry**: Retry after 60 seconds automatically
4. **Queue system**: Queue requests when limit is hit
5. **Fallback AI**: Switch to another AI provider on 429
6. **Usage dashboard**: Show real-time usage stats in admin panel

---

## ✅ Status

**Implementation**: ✅ Complete  
**Server**: ✅ Running with new code  
**Testing**: ✅ Ready to test  
**Documentation**: ✅ Complete  

**The server now properly handles and displays Gemini 429 errors!** 🎉

---

## 🧪 Test Commands

### Test Rate Limit
```bash
# Send 15 rapid requests
for i in {1..15}; do
  curl -X POST http://localhost:5000/api/ai/ai-query \
    -H "Content-Type: application/json" \
    -d '{"message":"test '$i'"}' &
done
```

### Check Server Logs
```bash
# Watch server output
tail -f server.log
# Or check process output if using controlBashProcess
```

### Monitor Usage
```bash
# Check current usage in logs
grep "Rate Limit Tracker" server.log | tail -10
```

---

**Rate limit error handling is now fully implemented with detailed Gemini error messages!** 🚀
