# 🔧 AI Context Troubleshooting Guide

## Problem
AI says "page context is not available" or doesn't see stocks/commodities on screen.

---

## Quick Fix (Most Common)

### ⚠️ HARD REFRESH YOUR BROWSER
The browser is caching the old JavaScript file!

**Windows/Linux:** `Ctrl + F5` or `Ctrl + Shift + R`  
**Mac:** `Cmd + Shift + R`

This forces the browser to reload all files including the updated `ai-chat-widget.js`.

---

## Step-by-Step Diagnosis

### Step 1: Test on Debug Page

Visit: **http://localhost:5000/test-ai-context.html**

This page has:
- 6 test stocks with correct HTML structure
- Clear instructions
- Expected console output
- Troubleshooting tips

**What to do:**
1. Open the page
2. Open browser console (F12)
3. Click AI robot button
4. Ask: "What stocks are visible?"
5. Check console for context logs

**Expected console output:**
```
📊 Context gathered: {pageName: "Unknown", visibleStocks: Array(6), ...}
📈 Found 6 stocks on screen
Sending to AI API...
Response received: 200
```

**Expected AI response:**
```
The stocks visible on screen are:
1. RELIANCE (Reliance Industries Ltd) - ₹2,450.30
2. TCS (Tata Consultancy Services) - ₹3,890.50
... (all 6 stocks)
```

---

### Step 2: Use Debug Tool

Visit: **http://localhost:5000/test-context-debug.html**

This tool lets you:
1. **Test Context Gathering** - See if selectors work
2. **Test API Call** - See if context reaches backend

**What to do:**
1. Click "Gather Context" button
2. Verify it finds 2 test stocks
3. Click "Send to AI API" button
4. Verify AI response includes the stocks

---

### Step 3: Check Browser Console

Open browser console (F12) and look for:

#### ✅ Good Signs:
```
📊 Context gathered: {...}
📈 Found X stocks on screen
Sending to AI API...
Response received: 200
```

#### ❌ Bad Signs:
```
Context gathering failed: ...
Error: ...
Response received: 500
```

---

### Step 4: Check Network Tab

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Click AI robot and send a message
4. Find the `/api/ai/ai-query` request
5. Click on it → "Payload" or "Request" tab
6. Verify the request body includes `context` object

**Expected request body:**
```json
{
  "message": "What stocks are shown?",
  "context": {
    "page": "/stocks.html",
    "pageName": "Stocks",
    "visibleStocks": [
      {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "price": "₹2,450.30"
      },
      ...
    ]
  }
}
```

---

## Common Issues & Solutions

### Issue 1: "Cannot see the screen" / No context

**Cause:** Browser cached old JavaScript

**Solution:**
```
1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. Or clear browser cache completely
3. Or open in incognito/private window
```

---

### Issue 2: Context is empty `{}`

**Cause:** Stocks/commodities not loaded yet

**Solution:**
```
1. Wait for page to fully load
2. Verify stock cards are visible on screen
3. Check console for loading errors
4. Try asking AI after data loads
```

---

### Issue 3: Console shows "Context gathering failed"

**Cause:** JavaScript error in context gathering

**Solution:**
```
1. Check full error message in console
2. Verify page structure matches expected HTML
3. Test on /test-ai-context.html page
4. Report error details
```

---

### Issue 4: Network request doesn't include context

**Cause:** Old version of ai-chat-widget.js loaded

**Solution:**
```
1. Hard refresh browser
2. Check file timestamp in Network tab
3. Verify ai-chat-widget.js is latest version
4. Clear browser cache completely
```

---

### Issue 5: Backend receives context but AI doesn't use it

**Cause:** Backend prompt formatting issue

**Solution:**
```
1. Check server logs for context received
2. Verify Gemini API is working
3. Test with test-context-stocks.js script
4. Check routes/ai-chat.js for errors
```

---

## Manual Testing Scripts

### Test 1: Context Gathering (Browser Console)
```javascript
// Run this in browser console on stocks page
const stockCards = document.querySelectorAll('.stock-card');
console.log('Found', stockCards.length, 'stock cards');

stockCards.forEach((card, i) => {
    const symbol = card.querySelector('.stock-symbol');
    const name = card.querySelector('.stock-name');
    const price = card.querySelector('.stock-price');
    console.log(i+1, {
        symbol: symbol?.textContent,
        name: name?.textContent,
        price: price?.textContent
    });
});
```

### Test 2: API Call (Terminal)
```bash
node test-context-stocks.js
```

Expected output:
```
✅ API Response received!
AI Response:
────────────────────────────────────────────────────────────
The stocks visible on screen are:
* RELIANCE (Reliance Industries Ltd) - ₹2,450.30
* TCS (Tata Consultancy Services) - ₹3,890.50
...
────────────────────────────────────────────────────────────
```

---

## Verification Checklist

Before reporting an issue, verify:

- [ ] Hard refreshed browser (Ctrl+F5)
- [ ] Tested on /test-ai-context.html page
- [ ] Checked browser console for errors
- [ ] Verified network request includes context
- [ ] Confirmed stocks/commodities are loaded
- [ ] Tested with debug tool
- [ ] Ran test-context-stocks.js script
- [ ] Server is running (node server.js)
- [ ] No JavaScript errors in console

---

## File Versions to Check

### 1. ai-chat-widget.js
Should include:
```javascript
function gatherPageContext() {
    try {
        const context = {...};
        // ... context gathering code ...
        console.log('📊 Context gathered:', context);
```

### 2. routes/ai-chat.js
Should include:
```javascript
async function queryGemini(message, context) {
    // ... context formatting ...
    if (context.visibleStocks && context.visibleStocks.length > 0) {
        systemPrompt += `\n\n📈 VISIBLE STOCKS ON SCREEN...`;
```

---

## Still Not Working?

### Last Resort Steps:

1. **Clear ALL browser data:**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Clear data

2. **Test in different browser:**
   - Try Chrome, Firefox, or Edge
   - Verify it works in one browser

3. **Check server logs:**
   ```bash
   # In terminal where server is running
   # Look for "Querying Google Gemini..." messages
   # Check for any errors
   ```

4. **Restart server:**
   ```bash
   # Stop server (Ctrl+C)
   node server.js
   ```

5. **Test API directly:**
   ```bash
   node test-context-stocks.js
   ```

---

## Success Indicators

### ✅ Everything Working:

**Console:**
```
📊 Context gathered: {pageName: "Stocks", visibleStocks: Array(20)}
📈 Found 20 stocks on screen
Sending to AI API...
Response received: 200
```

**AI Response:**
```
The stocks visible on screen are:
1. RELIANCE (Reliance Industries Ltd) - ₹2,450.30
2. TCS (Tata Consultancy Services) - ₹3,890.50
... (lists all visible stocks)
```

**Network Tab:**
- Request includes full context object
- Response status: 200
- Response includes stock list

---

## Debug URLs

- **Test Page:** http://localhost:5000/test-ai-context.html
- **Debug Tool:** http://localhost:5000/test-context-debug.html
- **Stocks Page:** http://localhost:5000/stocks.html
- **Market Page:** http://localhost:5000/market.html

---

## Contact/Report

If still not working after all steps:
1. Take screenshot of console
2. Copy network request payload
3. Run test-context-stocks.js and copy output
4. Note which browser and version
5. Report with all above information

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| "Cannot see screen" | Hard refresh (Ctrl+F5) |
| Empty context | Wait for data to load |
| JavaScript error | Check console, test on debug page |
| No context in request | Clear cache, hard refresh |
| API error | Check server logs, restart server |

---

**Remember: 90% of issues are solved by hard refreshing the browser! (Ctrl+F5)**
