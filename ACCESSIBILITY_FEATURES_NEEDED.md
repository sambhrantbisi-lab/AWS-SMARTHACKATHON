# Accessibility Features Missing from Other Pages

## Current Status
- ✅ **Home page** (`public/index.html`): Has all accessibility features
- ❌ **Services page** (`public/services.html`): Missing accessibility bar and login
- ❌ **Stocks page** (`public/stocks.html`): Missing accessibility bar and login  
- ❌ **Market page** (`public/market.html`): Missing accessibility bar and login
- ❌ **Chat page** (`public/chat.html`): Missing accessibility bar and login

## Features to Add to All Pages

### 1. Accessibility Bar (above navigation)
```html
<div class="accessibility-bar">
    <div class="accessibility-controls">
        <div class="live-status">
            <div class="live-dot"></div>
            <span>Live Updates</span>
        </div>
        
        <div class="language-selector">
            <select id="languageSelector" onchange="changeLanguage(this.value)">
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <!-- ... other languages -->
            </select>
        </div>
        
        <div class="accessibility-buttons">
            <button class="access-btn" onclick="toggleHighContrast()">
                <i class="fas fa-adjust"></i>
                <span>Contrast</span>
            </button>
            <button class="access-btn" onclick="toggleLargeText()">
                <i class="fas fa-text-height"></i>
                <span>Text Size</span>
            </button>
            <button class="access-btn" onclick="toggleDarkMode()">
                <i class="fas fa-moon" id="themeIcon"></i>
                <span id="themeText">Dark</span>
            </button>
        </div>
    </div>
</div>
```

### 2. Login Button in Navigation
```html
<button class="login-btn" onclick="showLogin()" id="loginSection">
    <i class="fas fa-sign-in-alt me-2"></i>Login to Digital India
</button>
```

### 3. CSS Styles Needed
- `.accessibility-bar` - Top bar styling
- `.accessibility-controls` - Grid layout
- `.live-status` - Live indicator
- `.language-selector` - Language dropdown
- `.accessibility-buttons` - Button group
- `.access-btn` - Individual buttons
- `.high-contrast` - High contrast mode
- `.large-text` - Large text mode
- `.login-btn` - Login button styling

### 4. JavaScript Functions Needed
- `toggleHighContrast()` - Toggle high contrast mode
- `toggleLargeText()` - Toggle large text mode
- `toggleDarkMode()` - Toggle dark/light theme
- `changeLanguage(lang)` - Change language
- `showLogin()` - Show login modal

## Implementation Plan

1. Extract common CSS from home page
2. Extract common JavaScript functions
3. Add accessibility bar HTML to each page
4. Add login button to each page navigation
5. Ensure all functions work consistently across pages
6. Test on all pages

## Priority
**HIGH** - This is an accessibility requirement and should be consistent across all pages.
