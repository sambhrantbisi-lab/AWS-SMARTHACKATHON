# 🎯 AI Chat Panel - User Guide

## Quick Overview

The AI Chat Panel is a permanent assistant on the right side of every page. It's powered by Google Gemini and can help you with questions about stocks, commodities, services, and general information.

---

## 🖼️ Panel Layout

```
┌─────────────────────────────────────┬──────────────┐
│                                     │ [←] 🤖 AI    │
│                                     │  Assistant   │
│  Your Page Content                  │──────────────│
│  (Adjusts automatically)            │              │
│                                     │  Welcome!    │
│                                     │  I can help  │
│                                     │  you with... │
│                                     │              │
│                                     │  💬 Your     │
│                                     │  messages    │
│                                     │              │
│                                     │──────────────│
│                                     │ [Type here]  │
└─────────────────────────────────────┴──────────────┘
         ↑                                    ↑
    Main Content                      AI Chat Panel
```

---

## 🎮 How to Use

### 1. Chatting with AI

**Type a message:**
1. Click in the input box at the bottom of the panel
2. Type your question or message
3. Press `Enter` to send (or click the send button)
4. AI will respond in a few seconds

**Tips:**
- Use `Shift+Enter` for a new line without sending
- Ask specific questions for better answers
- The AI can see what's on your current page

**Example Questions:**
- "What stocks are visible on this page?"
- "Tell me about Reliance Industries"
- "How do I apply for a passport?"
- "What commodities are showing high prices?"

---

### 2. Resizing the Panel

**Make it wider or narrower:**
1. Move your mouse to the **left edge** of the panel
2. You'll see the cursor change to a resize cursor (↔)
3. Click and drag left or right
4. Release when you reach your preferred width

**Size Limits:**
- **Minimum**: 300px (narrow)
- **Maximum**: 600px (wide)
- **Default**: 400px (medium)

**Visual Guide:**
```
Narrow (300px)          Medium (400px)         Wide (600px)
┌────────┬──┐          ┌────────┬────┐        ┌────────┬──────┐
│        │  │          │        │    │        │        │      │
│ Page   │AI│          │ Page   │ AI │        │ Page   │  AI  │
│        │  │          │        │    │        │        │      │
└────────┴──┘          └────────┴────┘        └────────┴──────┘
```

---

### 3. Collapsing the Panel

**Minimize to save space:**
1. Click the **arrow button** (←) in the panel header
2. Panel collapses to a thin 50px strip
3. Click the arrow again (→) to expand

**Keyboard Shortcut:**
- Press `Ctrl+B` to toggle collapse/expand

**Collapsed View:**
```
┌──────────────────────────────────────────┬─┐
│                                          │→│
│  Full Width Page Content                 │ │
│  (Panel is minimized)                    │A│
│                                          │I│
└──────────────────────────────────────────┴─┘
```

---

### 4. Your Settings Are Saved

**Automatic memory:**
- Your panel width is remembered
- Collapsed/expanded state is saved
- Settings persist when you navigate to other pages
- Resets when you close the browser tab

**Example:**
1. Resize panel to 500px
2. Navigate to another page
3. Panel is still 500px ✓
4. Close browser tab
5. Open new tab → Panel resets to 400px

---

## 🎯 Context-Aware Features

### The AI Knows What You're Looking At

**On Stocks Page:**
- AI can see the stocks displayed
- Ask: "What's the price of Reliance?"
- Ask: "Which stocks are performing well?"

**On Market Page:**
- AI can see commodity prices
- Ask: "What commodities are visible?"
- Ask: "Tell me about gold prices"

**On Services Page:**
- AI can see government services
- Ask: "What services are available?"
- Ask: "How do I apply for Aadhaar?"

**On Home Page:**
- AI provides general assistance
- Ask about any government service
- Get help navigating the portal

---

## 💡 Tips & Tricks

### Best Practices

1. **Be Specific**
   - ❌ "Tell me about stocks"
   - ✅ "What's the current price of TCS stock?"

2. **Use Context**
   - ❌ "What's the price?" (AI doesn't know which stock)
   - ✅ "What's the price of the first stock on this page?"

3. **Ask Follow-ups**
   - First: "What stocks are visible?"
   - Then: "Tell me more about the top one"

4. **Multiple Questions**
   - You can ask multiple questions in one message
   - Example: "What's the price of Reliance and TCS?"

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+B` | Toggle collapse/expand |
| `Enter` | Send message |
| `Shift+Enter` | New line |

---

## 🎨 Panel Features

### Visual Elements

**Header:**
- 🤖 AI Assistant icon and title
- ← Arrow button to collapse/expand

**Messages Area:**
- White bubbles for AI responses
- Translucent bubbles for your messages
- Auto-scrolls to latest message
- Loading animation while AI thinks

**Input Area:**
- Text box for typing messages
- Send button (paper plane icon)
- Fixed at bottom (doesn't scroll away)

### Colors

- **Panel Background**: Purple gradient
- **AI Messages**: White background
- **Your Messages**: Light translucent
- **Header**: Dark overlay

---

## 📱 Mobile Experience

### On Small Screens

**Automatic Adjustments:**
- Panel takes full width when expanded
- Resize handle is hidden (not needed)
- Collapse still works (minimize to 50px)
- Touch-friendly buttons

**Mobile Layout:**
```
Expanded:                Collapsed:
┌──────────────┐        ┌──────────────┬┐
│              │        │              ││
│  AI Panel    │        │  Full Page   ││
│  (Full Width)│        │  Content     ││
│              │        │              ││
└──────────────┘        └──────────────┴┘
```

---

## 🔧 Troubleshooting

### Panel Not Appearing?

**Solution:**
1. Refresh the page (F5)
2. Clear browser cache (Ctrl+Shift+R)
3. Check if JavaScript is enabled
4. Try a different browser

### Can't Resize?

**Check:**
- Is the panel collapsed? (Expand it first)
- Are you dragging the left edge?
- Is your mouse cursor showing ↔?

### Messages Not Sending?

**Check:**
1. Is your internet connected?
2. Is the server running?
3. Check browser console for errors (F12)
4. Try refreshing the page

### AI Not Responding?

**Possible Causes:**
- Server is processing (wait a few seconds)
- API key issue (contact admin)
- Network error (check connection)
- Try sending the message again

---

## 🎓 Example Conversations

### Example 1: Stock Inquiry
```
You: What stocks are visible on this page?

AI: I can see 20 stocks currently displayed:
    1. Reliance Industries - ₹2,450.30
    2. TCS - ₹3,234.50
    3. HDFC Bank - ₹1,567.80
    ... and 17 more stocks.
    
    Would you like details about any specific stock?

You: Tell me about Reliance

AI: Reliance Industries (RELIANCE) is currently trading at 
    ₹2,450.30. It's one of India's largest conglomerates...
```

### Example 2: Service Help
```
You: How do I apply for a passport?

AI: To apply for a passport in India:
    1. Visit the Passport Seva website
    2. Register and create an account
    3. Fill out the application form
    4. Pay the fee online
    5. Book an appointment at PSK
    6. Visit PSK with required documents
    
    Would you like more details about any step?
```

### Example 3: Market Data
```
You: What commodities are showing high prices?

AI: Based on the current market data visible:
    - Gold: ₹62,450/10g (High)
    - Silver: ₹74,230/kg (High)
    - Crude Oil: ₹6,890/barrel (Moderate)
    
    Gold and Silver are at elevated levels today.
```

---

## ✅ Quick Reference

### Panel Controls
- **Resize**: Drag left edge
- **Collapse**: Click arrow or Ctrl+B
- **Send Message**: Type and press Enter
- **New Line**: Shift+Enter

### Panel Sizes
- **Default**: 400px
- **Minimum**: 300px
- **Maximum**: 600px
- **Collapsed**: 50px

### Where It Works
- ✅ Home page
- ✅ Services page
- ✅ Stocks page
- ✅ Market page
- ✅ All other pages

---

## 🎉 Enjoy Your AI Assistant!

The panel is designed to be your helpful companion while browsing the Digital India Portal. It's always there when you need it, and out of the way when you don't.

**Happy chatting!** 🤖💬

---

**Need Help?** Ask the AI: "How do I use this panel?"
