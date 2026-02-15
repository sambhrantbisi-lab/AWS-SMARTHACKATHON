# Quick Deploy Guide - 5 Minutes ⚡

## Choose Your Platform

### 🟣 Heroku (Recommended for Beginners)
**Why**: Easiest, free tier, great for Node.js

**Steps**:
```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create my-civic-app

# 4. Add MongoDB
heroku addons:create mongolab:sandbox

# 5. Add API keys
heroku config:set DATA_GOV_IN_API_KEY=your_key
heroku config:set ALPHA_VANTAGE_API_KEY=your_key
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 6. Deploy
git push heroku main

# 7. Open app
heroku open
```

---

### 🔺 Vercel (Recommended for Speed)
**Why**: Super fast, automatic deployments, free

**Steps**:
1. Go to https://vercel.com
2. Click "Import Project"
3. Connect GitHub repo
4. Add environment variables in dashboard:
   - `DATA_GOV_IN_API_KEY`
   - `ALPHA_VANTAGE_API_KEY`
   - `JWT_SECRET`
   - `MONGODB_URI` (use MongoDB Atlas)
5. Click "Deploy"

**Done in 2 minutes!**

---

### 🟢 Render (Recommended for Free Hosting)
**Why**: Free tier, no credit card needed

**Steps**:
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Add environment variables
5. Click "Create Web Service"

**Free forever!**

---

## MongoDB Setup (Required)

Your local MongoDB won't work in production. Use MongoDB Atlas:

### Quick Setup:
```
1. Go to https://mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster (M0 Free tier)
4. Create database user
5. Network Access → Add IP: 0.0.0.0/0
6. Connect → Get connection string
7. Add to hosting platform as MONGODB_URI
```

**Connection string format**:
```
mongodb+srv://username:password@cluster.mongodb.net/civic-ai
```

---

## Environment Variables Needed

Copy-paste these into your hosting platform:

```
DATA_GOV_IN_API_KEY=your_actual_key_here
ALPHA_VANTAGE_API_KEY=your_actual_key_here
JWT_SECRET=generate_random_string_here
MONGODB_URI=your_mongodb_atlas_uri_here
DATA_GOV_IN_DATASET_ID=9ef84268-d588-465a-a308-a864a43d0070
NODE_ENV=production
```

---

## After Deployment

### 1. Create Admin User
```bash
# SSH into your server or use platform console
node seed-admin.js
```

### 2. Test Your Site
- Visit your deployed URL
- Try logging in as admin
- Create a test service
- Check if stocks/market data loads

### 3. Change Admin Password
- Login with default credentials
- Go to profile settings
- Change password

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Make sure you're using MongoDB Atlas URI (not localhost)
- Check if IP 0.0.0.0/0 is whitelisted in Atlas

### "API key not found"
- Verify all environment variables are set
- Check spelling matches exactly

### "App crashes on startup"
- Check logs: `heroku logs --tail` (Heroku)
- Make sure all dependencies are in package.json

---

## Cost Breakdown

### Free Tier Options:
- **Heroku**: Free (with credit card)
- **Vercel**: Free (hobby plan)
- **Render**: Free (no credit card needed)
- **MongoDB Atlas**: Free (M0 tier)

**Total Cost**: $0/month 🎉

### Paid Options (Optional):
- **Heroku Hobby**: $7/month
- **Vercel Pro**: $20/month
- **MongoDB Atlas M10**: $0.08/hour

---

## Next Steps

1. ✅ Deploy your app
2. ✅ Set up custom domain (optional)
3. ✅ Enable HTTPS (automatic on most platforms)
4. ✅ Set up monitoring
5. ✅ Add analytics

---

## Need Help?

- **Heroku Issues**: https://help.heroku.com
- **Vercel Issues**: https://vercel.com/support
- **MongoDB Issues**: https://www.mongodb.com/community/forums
- **General**: Check platform documentation

---

**Remember**: Your API keys are safe because they're in the platform dashboard, not in GitHub!
