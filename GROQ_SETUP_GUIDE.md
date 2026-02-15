# 🚀 Groq API Setup Guide - 70,000+ Free Requests Per Day!

## Why Groq?

After Google's December 2025 rate limit cuts, Gemini free tier now only allows **20 requests per day**. Groq offers a much better free tier:

### Gemini vs Groq Comparison

| Feature | Gemini Free | Groq Free |
|---------|-------------|-----------|
| **RPD (Requests/Day)** | 20 | 70,000+ |
| **RPM (Requests/Minute)** | 15 | 30 |
| **Speed** | Fast | Very Fast |
| **Quality** | Excellent | Excellent |
| **Cost** | Free | Free |

**Groq is 3,500x better for free tier!**

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Get Groq API Key

1. Visit: https://console.groq.com
2. Sign up with Google/GitHub (free)
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)

### Step 2: Add to .env File

Open your `.env` file and add:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
# Start again
node server.js
```

**That's it!** The system will now use Groq as fallback when Gemini hits rate limits.

---

## 🔄 How the Fallback Works

The system tries APIs in this order:

1. **Gemini** (primary) - 20 RPD
2. **Groq** (fallback) - 70,000+ RPD

```javascript
// Try Gemini first
response = await queryGemini(message, context);

// If Gemini fails, use Groq
if (!response) {
    response = await queryGroq(message, context);
}
```

### When Groq is Used

- ✅ When Gemini hits 20 daily requests
- ✅ When Gemini returns 429 error
- ✅ When Gemini API is down
- ✅ When Gemini key is invalid/missing

---

## 📊 Groq Rate Limits (Free Tier)

### Current Limits

- **30 RPM** (Requests Per Minute)
- **70,000+ RPD** (Requests Per Day)
- **14,400 TPM** (Tokens Per Minute)
- **No credit card required**

### Models Available

1. **llama-3.3-70b-versatile** (Default - Best balance)
   - 70B parameters
   - Very fast
   - Excellent quality

2. **llama-3.1-70b-versatile**
   - Previous version
   - Still excellent

3. **mixtral-8x7b-32768**
   - Good for long context
   - 32K context window

4. **gemma2-9b-it**
   - Google's Gemma model
   - Smaller, faster

---

## 🧪 Testing

### Test Groq Connection

Create `test-groq.js`:

```javascript
require('dotenv').config();

async function testGroq() {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
        console.error('❌ GROQ_API_KEY not found in .env');
        return;
    }
    
    console.log('🧪 Testing Groq API...');
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'user', content: 'Say "Groq is working!" in one sentence.' }
                ],
                max_tokens: 50
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Groq API is working!');
            console.log('Response:', data.choices[0].message.content);
        } else {
            const error = await response.json();
            console.error('❌ Groq API error:', error);
        }
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
}

testGroq();
```

Run:
```bash
node test-groq.js
```

Expected output:
```
🧪 Testing Groq API...
✅ Groq API is working!
Response: Groq is working!
```

---

## 🎯 Benefits of Dual Setup

### With Both Gemini + Groq

**Advantages:**
1. **70,020 total free requests/day** (20 Gemini + 70,000 Groq)
2. **Automatic failover** - No downtime
3. **Best of both** - Gemini quality + Groq capacity
4. **Zero cost** - Both are free

**How it works:**
- First 20 requests use Gemini (highest quality)
- Requests 21+ use Groq (still excellent quality)
- Users never see errors
- Seamless experience

---

## 📝 Server Logs

### With Groq Configured

```
📊 Rate Limit Tracker: 21 req/min, 21 req/day
Querying Google Gemini...
🚫 GEMINI RATE LIMIT (429) ERROR:
Gemini unavailable, trying Groq...
Querying Groq...
✅ Groq response received
```

### Without Groq

```
📊 Rate Limit Tracker: 21 req/min, 21 req/day
Querying Google Gemini...
🚫 GEMINI RATE LIMIT (429) ERROR:
❌ AI service unavailable
```

---

## 🔧 Advanced Configuration

### Change Groq Model

Edit `routes/ai-chat.js`:

```javascript
body: JSON.stringify({
    model: 'mixtral-8x7b-32768', // Change model here
    messages: [...],
    temperature: 0.7,
    max_tokens: 800,
})
```

### Adjust Temperature

```javascript
temperature: 0.5, // More focused (0.0-1.0)
temperature: 0.9, // More creative
```

### Increase Max Tokens

```javascript
max_tokens: 1500, // Longer responses
```

---

## 💰 Cost Comparison

### Free Tier Limits

| Provider | RPD | Cost |
|----------|-----|------|
| **Groq** | 70,000+ | $0 |
| **Gemini** | 20 | $0 |
| **OpenAI** | 0 | Paid only |

### Paid Tier (if needed)

| Provider | Cost per 1M tokens |
|----------|-------------------|
| **Groq** | $0.05-0.10 |
| **Gemini** | $0.30-2.50 |
| **OpenAI** | $0.50-15.00 |

**Groq is cheapest even on paid tier!**

---

## 🚨 Troubleshooting

### Error: "GROQ_API_KEY not found"

**Solution:**
1. Check `.env` file exists
2. Verify key is on its own line
3. No spaces around `=`
4. Restart server

### Error: "Invalid API key"

**Solution:**
1. Get new key from https://console.groq.com
2. Copy entire key (starts with `gsk_`)
3. Update `.env`
4. Restart server

### Error: "Rate limit exceeded"

**Solution:**
- Groq free tier: 30 RPM, 70,000 RPD
- Wait 1 minute for RPM reset
- Very unlikely to hit 70,000 RPD

### Groq Not Being Used

**Check:**
1. Is Gemini key working? (Groq only used as fallback)
2. Check server logs for "trying Groq..."
3. Verify GROQ_API_KEY in .env
4. Restart server

---

## 📊 Monitoring Usage

### Check Which API is Being Used

Server logs show:
```
Querying Google Gemini...     ← Using Gemini
Gemini response received

OR

Gemini unavailable, trying Groq...  ← Switched to Groq
Querying Groq...
Groq response received
```

### Track Daily Usage

Groq dashboard: https://console.groq.com/usage

Shows:
- Requests today
- Tokens used
- Response times
- Error rates

---

## ✅ Verification Checklist

- [ ] Groq account created
- [ ] API key obtained
- [ ] Key added to `.env`
- [ ] Server restarted
- [ ] Test request successful
- [ ] Fallback working (test by hitting Gemini limit)

---

## 🎉 Benefits Summary

### What You Get

✅ **70,000+ free requests/day** (vs 20 with Gemini alone)  
✅ **Automatic failover** (no downtime)  
✅ **Very fast responses** (Groq is optimized for speed)  
✅ **Excellent quality** (Llama 3.3 70B is top-tier)  
✅ **Zero cost** (completely free)  
✅ **No credit card** (unlike OpenAI)  

### What It Costs

**$0.00** - Completely free!

---

## 🚀 Next Steps

1. **Get Groq API key**: https://console.groq.com
2. **Add to .env**: `GROQ_API_KEY=gsk_...`
3. **Restart server**: `node server.js`
4. **Test**: Send 21+ messages to trigger Groq fallback
5. **Enjoy**: 70,000+ free requests per day!

---

## 📞 Support

### Groq Resources
- **Console**: https://console.groq.com
- **Docs**: https://console.groq.com/docs
- **Discord**: https://discord.gg/groq
- **Status**: https://status.groq.com

### Common Questions

**Q: Is Groq really free?**  
A: Yes! 70,000+ RPD with no credit card required.

**Q: How is it so fast?**  
A: Groq uses custom LPU (Language Processing Unit) hardware.

**Q: What's the quality like?**  
A: Excellent - Llama 3.3 70B rivals GPT-4 on many tasks.

**Q: Will it stay free?**  
A: Current free tier is very generous. Even paid tier is cheap.

---

**Setup Groq now and get 3,500x more free requests!** 🚀
