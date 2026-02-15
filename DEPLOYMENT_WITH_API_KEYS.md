# How to Deploy with API Keys 🚀

## The Problem
Your code needs API keys to work, but you can't put them in GitHub (everyone would see them).

## The Solution
Use **Environment Variables** on your hosting platform.

---

## Step-by-Step: Deploy to Different Platforms

### Option 1: Heroku (Easiest for Node.js)

#### Step 1: Push Code to GitHub (WITHOUT .env)
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### Step 2: Create Heroku App
```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name
```

#### Step 3: Add Environment Variables
```bash
# Add each API key
heroku config:set DATA_GOV_IN_API_KEY=579b464db66ec23bdd00000119204304bc5840c46e6c182d7e2fc8ee
heroku config:set ALPHA_VANTAGE_API_KEY=OFVLY5O1ON2T7OZJ
heroku config:set JWT_SECRET=your_random_secret_here
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Verify they're set
heroku config
```

#### Step 4: Deploy
```bash
git push heroku main
```

**Done!** Your app is live with API keys secure.

---

### Option 2: Vercel (Great for Full-Stack)

#### Step 1: Push to GitHub
```bash
git push origin main
```

#### Step 2: Import Project
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository

#### Step 3: Add Environment Variables
1. In project settings, go to "Environment Variables"
2. Add each variable:
   - Name: `DATA_GOV_IN_API_KEY`
   - Value: `579b464db66ec23bdd00000119204304bc5840c46e6c182d7e2fc8ee`
3. Repeat for all keys from `.env`

#### Step 4: Deploy
Click "Deploy" - Vercel will automatically deploy.

---

### Option 3: Render (Free Tier Available)

#### Step 1: Push to GitHub
```bash
git push origin main
```

#### Step 2: Create Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo

#### Step 3: Add Environment Variables
In the "Environment" section, add:
```
DATA_GOV_IN_API_KEY = 579b464db66ec23bdd00000119204304bc5840c46e6c182d7e2fc8ee
ALPHA_VANTAGE_API_KEY = OFVLY5O1ON2T7OZJ
JWT_SECRET = your_random_secret
MONGODB_URI = your_mongodb_uri
```

#### Step 4: Deploy
Click "Create Web Service"

---

### Option 4: Railway (Modern & Simple)

#### Step 1: Push to GitHub
```bash
git push origin main
```

#### Step 2: Deploy from GitHub
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository

#### Step 3: Add Variables
1. Go to "Variables" tab
2. Click "New Variable"
3. Add each key-value pair

#### Step 4: Deploy
Automatic! Railway deploys on every push.

---

## MongoDB in Production

Your local MongoDB won't work in production. Use **MongoDB Atlas** (free tier):

### Setup MongoDB Atlas:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free M0 tier)
4. Create database user
5. Whitelist all IPs: `0.0.0.0/0`
6. Get connection string

### Connection String Format:
```
mongodb+srv://username:password@cluster.mongodb.net/civic-ai?retryWrites=true&w=majority
```

### Add to Environment Variables:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-ai
```

---

## Complete Deployment Checklist

### Before Deploying:
- [ ] `.env` is in `.gitignore`
- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] All API keys are ready

### During Deployment:
- [ ] Choose hosting platform
- [ ] Connect GitHub repository
- [ ] Add ALL environment variables
- [ ] Set MongoDB URI to Atlas
- [ ] Deploy

### After Deployment:
- [ ] Test the live site
- [ ] Run admin seed script on production
- [ ] Change admin password
- [ ] Monitor API usage

---

## Quick Reference: All Environment Variables

Copy these to your hosting platform:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=generate_random_32_char_string
DATA_GOV_IN_API_KEY=your_data_gov_key
DATA_GOV_IN_DATASET_ID=9ef84268-d588-465a-a308-a864a43d0070
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
TWELVE_DATA_API_KEY=your_twelve_data_key
```

---

## How It Works

### Local Development:
```
Your Computer
├── Code (from GitHub)
└── .env file (NOT in GitHub)
    └── API keys here
```

### Production:
```
Hosting Platform
├── Code (from GitHub)
└── Environment Variables (set in platform dashboard)
    └── API keys here
```

**Key Point**: The `.env` file is ONLY on your computer. Production uses the platform's environment variables.

---

## Testing Production Environment Locally

Want to test production setup locally?

```bash
# Create production env file
cp .env .env.production

# Run with production env
NODE_ENV=production node server.js
```

---

## Common Issues & Solutions

### Issue: "API key not found"
**Solution**: Make sure you added ALL variables from `.env.example`

### Issue: "MongoDB connection failed"
**Solution**: 
- Use MongoDB Atlas URI (not localhost)
- Whitelist all IPs in Atlas
- Check username/password in connection string

### Issue: "JWT secret missing"
**Solution**: Generate and add JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Security Best Practices

1. **Different Keys for Production**
   - Use different API keys than development
   - Easier to track usage
   - Can revoke dev keys without affecting production

2. **Rotate Keys Regularly**
   - Change keys every 3-6 months
   - Update in hosting platform dashboard

3. **Monitor Usage**
   - Check API usage dashboards
   - Set up alerts for unusual activity

4. **Use Secrets Management** (Advanced)
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault

---

## Summary

✅ **DO**:
- Push code to GitHub (without .env)
- Add API keys in hosting platform dashboard
- Use MongoDB Atlas for production
- Test after deployment

❌ **DON'T**:
- Commit .env to GitHub
- Hardcode API keys in code
- Use localhost MongoDB in production
- Share production API keys

---

**Your API keys are safe because**:
1. They're in `.env` (ignored by Git)
2. They're added directly to hosting platform
3. They never appear in GitHub repository
4. Only you can see them in platform dashboard

**Need help?** Check platform-specific docs:
- Heroku: https://devcenter.heroku.com/articles/config-vars
- Vercel: https://vercel.com/docs/environment-variables
- Render: https://render.com/docs/environment-variables
- Railway: https://docs.railway.app/develop/variables
