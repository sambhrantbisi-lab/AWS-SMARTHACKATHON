# How API Keys Work in Deployment 🔑

## Visual Explanation

### Your Computer (Development)
```
┌─────────────────────────────────────┐
│  Your Local Machine                 │
│                                     │
│  📁 Project Folder                  │
│  ├── server.js                      │
│  ├── package.json                   │
│  ├── .env  ← API keys HERE          │
│  └── .gitignore  ← Ignores .env     │
│                                     │
│  When you run: node server.js       │
│  It reads API keys from .env        │
└─────────────────────────────────────┘
```

### GitHub (Code Storage)
```
┌─────────────────────────────────────┐
│  GitHub Repository                  │
│                                     │
│  📁 Your Repo                        │
│  ├── server.js  ✅                  │
│  ├── package.json  ✅               │
│  ├── .env  ❌ NOT HERE!             │
│  └── .gitignore  ✅                 │
│                                     │
│  .env is ignored, so it's safe!     │
└─────────────────────────────────────┘
```

### Production Server (Heroku/Vercel/etc)
```
┌─────────────────────────────────────┐
│  Hosting Platform                   │
│                                     │
│  📁 Deployed Code (from GitHub)     │
│  ├── server.js                      │
│  ├── package.json                   │
│  └── NO .env file                   │
│                                     │
│  ⚙️  Environment Variables          │
│  (Set in platform dashboard)        │
│  ├── DATA_GOV_IN_API_KEY=xxx        │
│  ├── ALPHA_VANTAGE_API_KEY=xxx      │
│  └── JWT_SECRET=xxx                 │
│                                     │
│  Server reads from environment!     │
└─────────────────────────────────────┘
```

## The Flow

### Step 1: Development
```
You write code → Use .env for API keys → Test locally
```

### Step 2: Push to GitHub
```
git add .
git commit -m "My app"
git push origin main

GitHub receives:
✅ All code files
❌ NO .env (blocked by .gitignore)
```

### Step 3: Deploy to Hosting
```
Hosting Platform:
1. Pulls code from GitHub
2. You manually add API keys in dashboard
3. Server reads from environment variables
4. App works with API keys!
```

## Code Example

Your `server.js` uses `process.env`:

```javascript
// This works BOTH locally and in production!
const apiKey = process.env.DATA_GOV_IN_API_KEY;

// Local: Reads from .env file
// Production: Reads from platform environment variables
```

## Real Example: Heroku

### What You Do:
```bash
# 1. Push code (no .env)
git push origin main

# 2. Add API keys to Heroku
heroku config:set DATA_GOV_IN_API_KEY=your_key_here

# 3. Deploy
git push heroku main
```

### What Happens:
```
Heroku Server:
├── Gets code from GitHub
├── Sees process.env.DATA_GOV_IN_API_KEY in code
├── Looks up DATA_GOV_IN_API_KEY in its environment
└── Uses the value you set with heroku config:set
```

## Why This is Secure

### ❌ Bad Way (Don't Do):
```javascript
// Hardcoded - EVERYONE can see this!
const apiKey = "579b464db66ec23bdd000011920430";
```

### ✅ Good Way (Do This):
```javascript
// From environment - Only you can see the actual value
const apiKey = process.env.DATA_GOV_IN_API_KEY;
```

## FAQ

### Q: Where do I put API keys?
**A**: 
- **Local**: In `.env` file
- **Production**: In hosting platform dashboard

### Q: Will my API keys be on GitHub?
**A**: No! `.gitignore` prevents `.env` from being committed.

### Q: How does production get API keys?
**A**: You add them manually in the hosting platform's settings.

### Q: Can others see my production API keys?
**A**: No! Only you (the owner) can see them in the platform dashboard.

### Q: What if I accidentally commit .env?
**A**: 
1. Remove it from Git history
2. Rotate (change) all API keys immediately
3. Update .env with new keys

## Platform-Specific Instructions

### Heroku Dashboard:
```
1. Go to app dashboard
2. Click "Settings"
3. Click "Reveal Config Vars"
4. Add: KEY = VALUE
5. Click "Add"
```

### Vercel Dashboard:
```
1. Go to project settings
2. Click "Environment Variables"
3. Add: NAME = VALUE
4. Select environment (Production)
5. Click "Save"
```

### Render Dashboard:
```
1. Go to web service
2. Click "Environment"
3. Add: KEY = VALUE
4. Click "Save Changes"
```

## Summary

```
┌──────────────┐
│ Your .env    │  ← Local only, not in GitHub
└──────────────┘
       │
       │ (gitignore blocks)
       ▼
┌──────────────┐
│   GitHub     │  ← Code only, no secrets
└──────────────┘
       │
       │ (platform pulls code)
       ▼
┌──────────────┐
│  Production  │  ← You add keys in dashboard
│  + API Keys  │
└──────────────┘
```

**Bottom Line**: 
- Code goes to GitHub (public)
- API keys stay private (local .env + platform dashboard)
- Never the two shall meet in GitHub!
