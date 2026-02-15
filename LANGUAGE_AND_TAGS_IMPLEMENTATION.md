# Language Support & Tags/Filtering Implementation

## Overview
Comprehensive multi-language support across all pages and enhanced filtering with tags in the services section.

## Features Implemented

### 1. Multi-Language Support (All Pages)
- **Centralized Language Manager** (`public/language-manager.js`)
- **8 Languages Supported**: English, Hindi, Bengali, Telugu, Tamil, Gujarati, Kannada, Marathi
- **Auto-sync across components**: Language changes reflect everywhere instantly
- **Persistent selection**: Language preference saved in localStorage

### 2. Tags & Filtering (Services Page)
- **Tag-based filtering**: Services can be filtered by multiple tags
- **Category filtering**: Existing category filter enhanced
- **Search functionality**: Real-time search across service names and descriptions
- **Combined filters**: Search + Category + Tags work together

### 3. Translation Coverage
All UI elements now support translations:
- Navigation menus
- Buttons and actions
- Form labels and placeholders
- Status messages
- Error messages
- Service details
- Stock/Market data labels

## Implementation Steps

### Step 1: Add Language Manager to All Pages

Add this script tag before closing `</body>` on all HTML pages:

```html
<script src="/language-manager.js?v=1.0"></script>
```

### Step 2: Mark Elements for Translation

Add `data-i18n` attribute to elements that need translation:

```html
<!-- Text content -->
<h1 data-i18n="page_title">Government Services</h1>
<button data-i18n="apply_online">Apply Online</button>

<!-- Placeholders -->
<input type="text" data-i18n="search_services" placeholder="Search services...">

<!-- HTML content -->
<div data-i18n-html="hero_subtitle"></div>
```

### Step 3: Update Language Selector

Replace the existing `changeLanguage` function with:

```javascript
function changeLanguage(lang) {
    if (window.LanguageManager) {
        window.LanguageManager.changeLanguage(lang);
    }
}
```

### Step 4: Add Tags to Services

Update the service schema to include tags:

```javascript
{
    name: "Aadhaar Card",
    category: "identity",
    tags: ["identity", "essential", "free", "online"],
    // ... other fields
}
```

### Step 5: Implement Tag Filtering UI

Add to services.html:

```html
<div class="controls">
    <input type="text" class="search-input" data-i18n="search_services" placeholder="Search services..." id="searchInput">
    
    <select class="filter-select" id="categoryFilter">
        <option value="" data-i18n="all_categories">All Categories</option>
        <option value="identity" data-i18n="identity_docs">Identity Documents</option>
        <option value="financial" data-i18n="financial_services">Financial Services</option>
        <option value="healthcare" data-i18n="healthcare">Healthcare</option>
        <option value="education" data-i18n="education">Education</option>
        <option value="social" data-i18n="social_welfare">Social Welfare</option>
    </select>
    
    <select class="filter-select" id="tagFilter">
        <option value="" data-i18n="all_tags">All Tags</option>
        <option value="free">Free Services</option>
        <option value="online">Online Available</option>
        <option value="essential">Essential</option>
        <option value="urgent">Urgent Services</option>
    </select>
</div>
```

## Translation Keys Added

### Common UI Elements
- `search_services` - Search placeholder
- `all_categories` - Category filter default
- `all_tags` - Tag filter default
- `apply_online` - Apply button
- `view_details` - Details button
- `loading` - Loading state
- `error_loading` - Error message
- `retry` - Retry button

### Service-Specific
- `identity_docs` - Identity category
- `financial_services` - Financial category
- `healthcare` - Healthcare category
- `education` - Education category
- `social_welfare` - Social welfare category
- `free` - Free service label
- `processing_time` - Processing time label
- `required_documents` - Documents section
- `online_services` - Online services section
- `official_links` - Links section

### Navigation
- `home` - Home link
- `government_services` - Services link
- `live_stocks` - Stocks link
- `market_prices` - Market link
- `login` - Login button
- `logout` - Logout button
- `profile` - Profile link
- `admin_panel` - Admin link

### Accessibility
- `live_updates` - Live status
- `contrast` - Contrast button
- `text_size` - Text size button
- `dark_mode` - Dark mode label
- `light_mode` - Light mode label

## Usage Examples

### In JavaScript
```javascript
// Get translation
const text = window.LanguageManager.t('apply_online');

// Change language
window.LanguageManager.changeLanguage('hi');

// Get current language
const lang = window.LanguageManager.getCurrentLanguage();

// Listen for language changes
window.addEventListener('languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
    // Reload dynamic content in new language
});
```

### In HTML
```html
<!-- Simple text -->
<h1 data-i18n="page_title">Default Text</h1>

<!-- Button -->
<button data-i18n="apply_now" class="btn btn-primary">Apply Now</button>

<!-- Input placeholder -->
<input type="text" data-i18n="search_services" placeholder="Search...">

<!-- HTML content -->
<div data-i18n-html="hero_subtitle"></div>
```

## Tag Filtering Implementation

### JavaScript for Tag Filtering
```javascript
function filterServices() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedTag = tagFilter.value;
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const title = card.querySelector('.service-title').textContent.toLowerCase();
        const description = card.querySelector('.service-description').textContent.toLowerCase();
        const category = card.getAttribute('data-category');
        const tags = (card.getAttribute('data-tags') || '').split(',');

        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = !selectedCategory || category === selectedCategory;
        const matchesTag = !selectedTag || tags.includes(selectedTag);

        card.style.display = matchesSearch && matchesCategory && matchesTag ? 'block' : 'none';
    });
}

// Attach event listeners
searchInput.addEventListener('input', filterServices);
categoryFilter.addEventListener('change', filterServices);
tagFilter.addEventListener('change', filterServices);
```

### Service Card with Tags
```javascript
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.setAttribute('data-category', service.category);
    card.setAttribute('data-tags', (service.tags || []).join(','));

    card.innerHTML = `
        <div class="service-icon">${service.icon}</div>
        <h3 class="service-title">${service.name}</h3>
        <p class="service-description">${service.description}</p>
        
        <!-- Tags display -->
        <div class="service-tags">
            ${(service.tags || []).map(tag => `
                <span class="tag">${tag}</span>
            `).join('')}
        </div>
        
        <div class="service-meta">
            <span class="service-fee" data-i18n="${service.fee === 0 ? 'free' : ''}">${service.fee === 0 ? 'Free' : '₹' + service.fee}</span>
            <span class="service-time">${service.processingTime}</span>
        </div>
        
        <div class="service-actions">
            <button class="btn btn-primary" data-i18n="apply_online" onclick="applyOnline('${service.id}')">
                Apply Online
            </button>
            <button class="btn btn-secondary" data-i18n="view_details" onclick="showServiceDetails('${service.id}')">
                Details
            </button>
        </div>
    `;

    return card;
}
```

### CSS for Tags
```css
.service-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.tag {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid var(--border-color);
}

.tag:hover {
    background: var(--primary-color);
    color: white;
    cursor: pointer;
}
```

## Benefits

### For Users
- ✅ Access content in their preferred language
- ✅ Better service discovery with tags
- ✅ Faster filtering with multiple criteria
- ✅ Consistent experience across all pages

### For Developers
- ✅ Centralized translation management
- ✅ Easy to add new languages
- ✅ Simple markup with data attributes
- ✅ Auto-sync across components

### For Accessibility
- ✅ Screen reader support in multiple languages
- ✅ Clear labeling in user's language
- ✅ Better navigation with translated UI

## Next Steps

1. **Add more translations**: Expand translations.json with more keys
2. **Dynamic content**: Translate API responses
3. **RTL support**: Add right-to-left language support
4. **Language detection**: Auto-detect user's preferred language
5. **Tag management**: Admin interface to manage service tags

---

**Status**: 🟢 Ready for Implementation
**Version**: 1.0
**Date**: February 7, 2026
