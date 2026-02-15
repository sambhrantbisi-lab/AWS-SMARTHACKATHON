# AI Chat Drag Bug Fix

## 🐛 Issue
When trying to drag and move the AI chat floating window, the entire dialog would vanish.

## 🔍 Root Cause
**Variable Name Conflict**: The function parameter `window` was shadowing the global `window` object.

In the `setupDragging()` function and related functions, the parameter was named `window`, which conflicted with the browser's global `window` object. When calculating boundaries in the drag function:

```javascript
// BEFORE (BROKEN):
function setupDragging(window) {
  function drag(e) {
    // This was using global window.innerWidth/innerHeight
    // but window.offsetWidth/offsetHeight referred to the parameter
    const maxX = window.innerWidth - window.offsetWidth;  // ❌ CONFLICT!
    const maxY = window.innerHeight - window.offsetHeight; // ❌ CONFLICT!
  }
}
```

The code was trying to access:
- `window.innerWidth` (global browser window) ✅
- `window.offsetWidth` (chat element parameter) ✅
- But JavaScript got confused about which `window` to use!

This caused incorrect boundary calculations, making the element position itself outside the viewport and disappear.

## ✅ Solution
Renamed all `window` parameters to `chatWindow` to avoid the naming conflict:

```javascript
// AFTER (FIXED):
function setupDragging(chatWindow) {
  function drag(e) {
    // Now clearly separated: global window vs chat element
    const maxX = window.innerWidth - chatWindow.offsetWidth;  // ✅ CLEAR!
    const maxY = window.innerHeight - chatWindow.offsetHeight; // ✅ CLEAR!
  }
}
```

## 📁 Files Modified
- `public/ai-chat-floating.js` (v2.0 → v2.1)

## 🔧 Functions Fixed
1. `setupDragging(chatWindow)` - Main drag handler
2. `toggleMinimize(chatWindow)` - Minimize/restore
3. `closeWindow(chatWindow)` - Close animation
4. `updateLanguage()` - Language switching
5. `setupEventListeners(chatWindow)` - Event binding
6. `init()` - Initialization

## 🧪 Testing
To test the fix:
1. Open any page with the AI chat (index.html, stocks.html, market.html, services.html)
2. Click and drag the AI chat header
3. The window should now move smoothly without disappearing
4. Release to drop in new position
5. Position is saved to localStorage

## ✨ Features Still Working
- ✅ Draggable anywhere on screen
- ✅ Stays within viewport boundaries
- ✅ Position persists across page reloads
- ✅ Minimize to circle
- ✅ Multi-language support (5 languages)
- ✅ Mobile-friendly (full-screen on small devices)
- ✅ Touch support for mobile dragging
- ✅ Context awareness (stocks, commodities, services)

## 📊 Impact
- **Severity**: High (core functionality broken)
- **User Impact**: 100% of users trying to drag
- **Fix Complexity**: Low (simple variable rename)
- **Testing**: Manual testing confirmed working

---

**Status**: 🟢 Fixed
**Version**: 2.1
**Date**: February 7, 2026
**Bug Type**: Variable shadowing / naming conflict
