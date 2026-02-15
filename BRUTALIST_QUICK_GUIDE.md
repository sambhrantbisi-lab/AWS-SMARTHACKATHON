# 🚀 Brutalist Design - Quick Guide

## What Changed

**EVERYTHING** now has brutalist design:
- ✅ Home page
- ✅ Services page  
- ✅ Stocks page
- ✅ Market page

## Start Testing

```bash
node server.js
```

Then visit: **http://localhost:5000/**

## What You'll See

### Home Page
```
┌─────────────────────────────────────┐
│ DIGITAL INDIA PORTAL (glitching)   │
│ [HOME] [SERVICES] [STOCKS] [MARKET]│
└─────────────────────────────────────┘

        🇮🇳
   YOUR CIVIC ASSISTANT
   
[START AI ASSISTANT] [BROWSE SERVICES]

┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│500+ │ │2000+│ │  8  │ │24/7 │
│SRVCS│ │STOCK│ │LANG │ │ AI  │
└─────┘ └─────┘ └─────┘ └─────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│🏛️        │ │📈        │ │🌾        │
│GOVT      │ │STOCKS    │ │MARKET    │
│SERVICES  │ │LIVE DATA │ │PRICES    │
└──────────┘ └──────────┘ └──────────┘
```

### Services Page
```
┌─────────────────────────────────────┐
│ GOVERNMENT SERVICES                 │
│ [ALL] [IDENTITY] [FINANCIAL]        │
└─────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│🆔        │ │💳        │ │🛂        │
│AADHAAR   │ │PAN CARD  │ │PASSPORT  │
│CARD      │ │          │ │          │
│[FREE]    │ │[PAID]    │ │[PAID]    │
└──────────┘ └──────────┘ └──────────┘

Click → Opens nested window with forum
```

### Stocks Page
```
┌─────────────────────────────────────┐
│ LIVE STOCK MARKET                   │
│ [SEARCH...] [SECTOR] [REFRESH]      │
└─────────────────────────────────────┘

┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│2000+│ │ 850 │ │1150 │ │OPEN │
│TOTAL│ │GAIN │ │LOSS │ │STAT │
└─────┘ └─────┘ └─────┘ └─────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│RELIANCE  │ │TCS       │ │INFY      │
│₹2,450.50 │ │₹3,890.25 │ │₹1,678.90 │
│▲ +1.2%   │ │▼ -0.5%   │ │▲ +2.1%   │
└──────────┘ └──────────┘ └──────────┘

Click → Opens modal with chart
```

### Market Page
```
┌─────────────────────────────────────┐
│ COMMODITY MARKET                    │
│ [SEARCH...] [STATE] [REFRESH]       │
└─────────────────────────────────────┘

┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 500 │ │ 28  │ │TODAY│ │LIVE │
│ITEMS│ │STATE│ │DATE │ │DATA │
└─────┘ └─────┘ └─────┘ └─────┘

┌────────────────────────────────────┐
│COMMODITY│LOCATION│WHOLESALE│RETAIL│
├────────────────────────────────────┤
│Rice     │Mumbai  │₹45/kg   │₹52/kg│
│Wheat    │Delhi   │₹32/kg   │₹38/kg│
│Onion    │Pune    │₹25/kg   │₹30/kg│
└────────────────────────────────────┘

Click row → Opens price detail modal
```

## Key Features

### Visual Style
- ⬛ Thick black borders (6-8px)
- 🔲 No rounded corners
- 🎨 High contrast (black/white/red/yellow/cyan)
- 📝 Bold uppercase text
- ⚡ Aggressive animations

### Interactions
- **Hover**: Cards lift up with shadow
- **Click**: Opens modal windows
- **Search**: Real-time filtering
- **Language**: Switch anytime
- **AI Chat**: Floating window (bottom-right)

### Animations
- Title glitches every 3 seconds
- Icons float up and down
- Modals slide up from bottom
- Hover effects translate + shadow

## Navigation

All pages linked:
```
HOME ←→ SERVICES ←→ STOCKS ←→ MARKET
```

Language selector on every page:
```
[ENGLISH ▼] → हिंदी, বাংলা, తెలుగు, தமிழ், ગુજરાતી
```

## Test Checklist

- [ ] Home page loads with brutalist design
- [ ] All 4 navigation buttons work
- [ ] Service tiles open nested windows
- [ ] Stock cards display real data
- [ ] Stock modal shows chart
- [ ] Commodity table loads data
- [ ] Search and filter work
- [ ] Language switching works
- [ ] AI chat opens (bottom-right)
- [ ] All animations smooth
- [ ] Mobile responsive

## URLs

- **Home**: http://localhost:5000/
- **Services**: http://localhost:5000/services-brutalist.html
- **Stocks**: http://localhost:5000/stocks-brutalist.html
- **Market**: http://localhost:5000/market-brutalist.html

## Troubleshooting

### Page looks normal (not brutalist)
- Check URL has `-brutalist.html`
- Hard refresh: `Ctrl + Shift + R`
- Clear cache

### No data loading
- Check server is running
- Check browser console for errors
- Verify API endpoints working

### Animations not working
- Check browser supports CSS animations
- Check no JavaScript errors
- Try different browser

---

## 🎯 Quick Summary

**All pages are now brutalist!**

Visit http://localhost:5000/ and enjoy the raw, honest, functional design.

No BS. Just brutal efficiency. 🔥
