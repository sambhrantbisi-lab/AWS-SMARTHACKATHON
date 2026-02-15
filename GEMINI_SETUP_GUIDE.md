# Google Gemini API Setup Guide 🚀

## Why Gemini?

✅ **FREE** - No credit card required  
✅ **Reliable** - Google infrastructure (99%+ uptime)  
✅ **Good Quality** - Comparable to GPT-3.5  
✅ **Generous Limits** - 60 requests/min, 1500/day  
✅ **Easy Setup** - Get API key in 2 minutes  

## Step-by-Step Setup

### Step 1: Get Your Free API Key

1. **Visit**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click** "Create API Key"
4. **Select** "Create API key in new project" (or use existing)
5. **Copy** the API key (starts with `AIza...`)

**That's it!** No credit card, no payment info needed.

### Step 2: Add to Your Project

1. Open `.env` file in your project root
2. Add this line:
   ```
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   ```
3. Save the file

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
# Start again
node server.js
```

### Step 4: Test It!

1. Open any page (home, services, stocks, etc.)
2. Click the purple robot button (bottom-right)
3. Type: "Hello, how are you?"
4. You should get an AI response in 1-2 seconds!

## Free Tier Limits

| Limit | Free Tier |
|-------|-----------|
| Requests per minute | 60 |
| Requests per day | 1,500 |
| Requests per month | ~45,000 |
| Cost | $0 |

**For most websites, this is MORE than enough!**

### Example Usage:
- 100 users/day × 5 messages each = 500 requests/day ✅
- 1000 users/day × 1 message each = 1000 requests/day ✅
- 2000 users/day × 1 message each = 2000 requests/day ❌ (need paid tier)

## Troubleshooting

### "API key not configured" error:
- Make sure you added `GEMINI_API_KEY` to `.env`
- Check spelling (it's case-sensitive)
- Restart server after adding key

### "API key invalid" error:
- Verify the key starts with `AIza`
- Make sure you copied the entire key
- Try generating a new key

### "Quota exceeded" error:
- You've hit the 60/min or 1500/day limit
- Wait a few minutes and try again
- Consider upgrading to paid tier if needed

## Paid Tier (Optional)

If you need more requests:

| Plan | Requests/min | Cost |
|------|--------------|------|
| Free | 60 | $0 |
| Pay-as-you-go | 1000 | ~$0.001 per request |

**Most users never need the paid tier!**

## API Key Security

✅ **DO**:
- Keep API key in `.env` file
- Add `.env` to `.gitignore`
- Use different keys for dev/prod

❌ **DON'T**:
- Commit API key to GitHub
- Share API key publicly
- Use same key across projects

## Testing Your Setup

### Test 1: Check Environment Variable
```bash
node -e "console.log(process.env.GEMINI_API_KEY ? 'Key is set ✓' : 'Key not found ✗')"
```

### Test 2: Test API Directly
```bash
curl -X POST http://localhost:5000/api/chat/ai-query \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

Should return:
```json
{
  "response": "Hello! How can I help you today?"
}
```

### Test 3: Test Widget
1. Open http://localhost:5000
2. Click robot button
3. Type "Hello"
4. Should get response in 1-2 seconds

## Comparison: Gemini vs Others

### Google Gemini (FREE):
- Quality: ⭐⭐⭐⭐ (8/10)
- Speed: ⚡⚡⚡ (1-2 seconds)
- Reliability: 99%
- Cost: $0
- Setup: 2 minutes

### OpenAI GPT-3.5 (PAID):
- Quality: ⭐⭐⭐⭐ (9/10)
- Speed: ⚡⚡⚡ (1-2 seconds)
- Reliability: 99.9%
- Cost: ~$0.002/request
- Setup: 5 minutes

### Hugging Face (FREE):
- Quality: ⭐⭐ (4/10)
- Speed: ⚡ (3-10 seconds)
- Reliability: 60%
- Cost: $0
- Setup: 0 minutes (no key needed)

**Winner**: Gemini! Best balance of quality, reliability, and cost.

## Example Responses

### Query: "How do I get Aadhaar?"
**Gemini Response**:
> "To get an Aadhaar card, you need to visit an Aadhaar enrollment center. You can find the nearest center and book an appointment at https://uidai.gov.in. You'll need to provide proof of identity, address, and date of birth. The process is free and takes about 90 days. For assistance, call the helpline at 1947."

### Query: "What are stock market hours?"
**Gemini Response**:
> "The Indian stock market (NSE and BSE) operates from Monday to Friday, 9:15 AM to 3:30 PM IST. Pre-market session is from 9:00 AM to 9:15 AM, and post-market session is from 3:40 PM to 4:00 PM. The market is closed on weekends and public holidays."

## Advanced Configuration

### Adjust Response Length:
Edit `routes/ai-chat.js`:
```javascript
generationConfig: {
    maxOutputTokens: 500,  // Change this (100-2048)
}
```

### Adjust Creativity:
```javascript
generationConfig: {
    temperature: 0.7,  // 0.0 = factual, 1.0 = creative
}
```

### Add Safety Settings:
```javascript
safetySettings: [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
]
```

## Monitoring Usage

Check your usage at:
https://makersuite.google.com/app/apikey

You can see:
- Requests today
- Requests this month
- Rate limit status

## Upgrading to Paid

If you need more than 1500 requests/day:

1. Go to https://console.cloud.google.com
2. Enable billing
3. Limits automatically increase
4. Pay only for what you use (~$0.001 per request)

## Summary

✅ **Setup Time**: 2 minutes  
✅ **Cost**: $0 (free tier)  
✅ **Quality**: Excellent  
✅ **Reliability**: 99%+  
✅ **Limits**: 1500 requests/day  

**Perfect for**: Small to medium websites, personal projects, testing, learning

**Get started now**: https://makersuite.google.com/app/apikey

---

**Your AI chat widget will work perfectly with Gemini!** 🎉
