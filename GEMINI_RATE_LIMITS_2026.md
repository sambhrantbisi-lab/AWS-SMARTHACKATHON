# 🚦 Gemini API Rate Limits - Complete Guide (2026)

## 📊 Current Free Tier Limits (January 2026)

### Gemini 2.5 Flash (Your Current Model)

**Rate Limits:**
- **10 RPM** (Requests Per Minute)
- **250,000 TPM** (Tokens Per Minute)
- **250 RPD** (Requests Per Day)
- **1M Context Window** (Fully accessible)

**Daily Reset:** Midnight Pacific Time

**Your Usage Pattern:**
- Typical AI chat: 2-4 seconds per response
- Average tokens per request: ~1,000-2,000
- Estimated daily capacity: **250 user queries**

---

## 🎯 What This Means for Your Portal

### Current Configuration

Your Digital India Portal uses **Gemini 2.5 Flash** which is the **recommended default** for most applications.

**Capacity Analysis:**
```
10 RPM = 600 requests/hour (theoretical max)
250 RPD = ~10 requests/hour sustained over 24 hours
```

**Realistic Usage:**
- **Light usage**: 50-100 queries/day - ✅ Well within limits
- **Moderate usage**: 100-200 queries/day - ✅ Comfortable
- **Heavy usage**: 200-250 queries/day - ⚠️ Approaching limit
- **Very heavy**: 250+ queries/day - ❌ Will hit daily limit

### Per-User Impact

**Single User:**
- Can make 10 requests per minute (very fast)
- Can make 250 requests per day (plenty for personal use)

**Multiple Users:**
- 10 concurrent users = 25 requests/day each
- 50 concurrent users = 5 requests/day each
- 100 concurrent users = 2.5 requests/day each

---

## ⚠️ December 2025 Changes

**What Changed:**
Google reduced free tier quotas by **50-80%** on December 7, 2025.

**Before (2024):**
- Gemini 2.5 Flash: ~1,500 RPD
- Much more generous limits

**After (Current):**
- Gemini 2.5 Flash: 250 RPD
- Significant reduction but still usable

**Impact on Your Project:**
- ✅ Development/testing: No impact
- ✅ Personal use: No impact
- ✅ Small team: Minimal impact
- ⚠️ Public deployment: May need monitoring
- ❌ High-traffic production: Will need paid tier

---

## 📈 Model Comparison

### Gemini 2.5 Pro
- **5 RPM** | **250K TPM** | **100 RPD**
- Best quality, most restrictive limits
- Use for: Complex reasoning, code debugging

### Gemini 2.5 Flash ⭐ (Current)
- **10 RPM** | **250K TPM** | **250 RPD**
- Best balance of quality and availability
- Use for: General chat, content generation

### Gemini 2.5 Flash-Lite
- **15 RPM** | **250K TPM** | **1,000 RPD**
- Highest throughput, lower quality
- Use for: High-volume, simple tasks

---

## 🔍 Understanding Rate Limits

### 1. Requests Per Minute (RPM)
**What it means:** Maximum API calls in any 60-second window

**Your limit:** 10 RPM
- Can handle rapid-fire questions (6 seconds between requests)
- Resets every minute
- Good for interactive chat

**Example:**
```
User asks 10 questions in 30 seconds → ✅ OK
User asks 11 questions in 30 seconds → ❌ 429 Error on 11th
Wait 30 seconds → ✅ Can ask 10 more
```

### 2. Tokens Per Minute (TPM)
**What it means:** Total tokens (input + output) processed per minute

**Your limit:** 250,000 TPM
- Input tokens: Your question + context
- Output tokens: AI's response
- Average request: 1,000-2,000 tokens

**Example:**
```
Request with 30 stocks context: ~3,000 tokens
AI response: ~500 tokens
Total: ~3,500 tokens per request

250,000 TPM ÷ 3,500 = ~71 requests/minute theoretical max
(But RPM limit of 10 kicks in first)
```

### 3. Requests Per Day (RPD)
**What it means:** Total API calls allowed in 24 hours

**Your limit: