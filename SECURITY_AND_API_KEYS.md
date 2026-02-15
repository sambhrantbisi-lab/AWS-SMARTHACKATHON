# Security & API Keys Guide 🔐

## API Keys Protection

### ✅ What We've Done

1. **`.env` file is in `.gitignore`**
   - Your API keys in `.env` will NOT be committed to GitHub
   - Safe from public exposure

2. **Created `.env.example`**
   - Template file with placeholder values
   - Can be safely committed to GitHub
   - Shows what environment variables are needed

3. **Hidden API keys in terminal output**
   - `seed-admin.js` no longer shows password
   - `test-commodity-api.js` hides API key value
   - Only shows if key is set or not

4. **Added dark mode support for login modal**
   - Modal now works properly in dark mode
   - Form inputs styled for dark theme
   - Close button visible in dark mode

## Setup for New Developers

### Step 1: Copy Environment File
```bash
cp .env.example .env
```

### Step 2: Add Your API Keys
Edit `.env` and replace placeholder values:

```env
# Your actual API keys
DATA_GOV_IN_API_KEY=your_actual_key_here
ALPHA_VANTAGE_API_KEY=your_actual_key_here
JWT_SECRET=generate_a_random_secret_here
```

### Step 3: Never Commit .env
The `.gitignore` file already excludes `.env`, but double-check:
```bash
git status
# .env should NOT appear in the list
```

## Getting API Keys

### 1. Data.gov.in API Key
- Visit: https://data.gov.in/
- Register for an account
- Request API access
- Copy your API key to `.env`

### 2. Alpha Vantage API Key
- Visit: https://www.alphavantage.co/support/#api-key
- Fill in the form
- Get free API key (500 requests/day)
- Copy to `.env`

### 3. Twelve Data API Key (Optional)
- Visit: https://twelvedata.com/
- Sign up for free account
- Get API key from dashboard
- Copy to `.env`

### 4. JWT Secret
Generate a random secret:
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://randomkeygen.com/
```

## Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore`
- Use `.env.example` for documentation
- Rotate API keys regularly
- Use different keys for dev/prod
- Set strong JWT secrets
- Change default admin password
- Use HTTPS in production
- Enable rate limiting

### ❌ DON'T:
- Commit `.env` to Git
- Share API keys in chat/email
- Use same keys across projects
- Hardcode secrets in code
- Use weak passwords
- Expose admin credentials
- Log sensitive data

## Checking for Exposed Secrets

### Before Committing:
```bash
# Check what will be committed
git status

# Make sure .env is not listed
git diff --cached

# Search for potential secrets
git grep -i "api_key\|secret\|password" -- ':!.env.example'
```

### If You Accidentally Committed Secrets:

1. **Immediately rotate the exposed keys**
2. **Remove from Git history:**
```bash
# Remove file from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (be careful!)
git push origin --force --all
```

3. **Use BFG Repo-Cleaner (easier):**
```bash
# Install BFG
# Visit: https://rtyley.github.io/bfg-repo-cleaner/

# Remove .env from history
bfg --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Environment mode | `development` |
| `PORT` | No | Server port | `5000` |
| `MONGODB_URI` | Yes | MongoDB connection | `mongodb://localhost:27017/civic-ai` |
| `JWT_SECRET` | Yes | JWT signing secret | `random_32_char_string` |
| `DATA_GOV_IN_API_KEY` | Yes | Data.gov.in API | `your_key_here` |
| `DATA_GOV_IN_DATASET_ID` | Yes | Dataset ID | `9ef84268-d588-465a-a308-a864a43d0070` |
| `ALPHA_VANTAGE_API_KEY` | Yes | Stock data API | `your_key_here` |
| `TWELVE_DATA_API_KEY` | No | Alternative stock API | `your_key_here` |
| `OPENAI_API_KEY` | No | AI features | `your_key_here` |
| `GOOGLE_TRANSLATE_API_KEY` | No | Translation | `your_key_here` |

## Production Deployment

### Environment Variables in Production:

**Heroku:**
```bash
heroku config:set DATA_GOV_IN_API_KEY=your_key
heroku config:set ALPHA_VANTAGE_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret
```

**Vercel:**
```bash
vercel env add DATA_GOV_IN_API_KEY
vercel env add ALPHA_VANTAGE_API_KEY
vercel env add JWT_SECRET
```

**AWS/DigitalOcean:**
- Use their environment variable management
- Or use AWS Secrets Manager / Parameter Store

**Docker:**
```bash
docker run -e DATA_GOV_IN_API_KEY=your_key \
           -e ALPHA_VANTAGE_API_KEY=your_key \
           -e JWT_SECRET=your_secret \
           your-image
```

## Monitoring & Alerts

### Set up alerts for:
- Unusual API usage patterns
- Failed authentication attempts
- API key rotation reminders
- Security vulnerability scans

### Tools:
- GitHub Secret Scanning (automatic)
- GitGuardian (free for public repos)
- TruffleHog (local scanning)
- npm audit (dependency vulnerabilities)

## Quick Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` exists with placeholders
- [ ] All API keys are in `.env` (not hardcoded)
- [ ] JWT secret is strong and random
- [ ] Admin password has been changed
- [ ] No secrets in Git history
- [ ] Production uses different keys than dev
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Regular security audits scheduled

## Files That Should Never Be Committed

```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.pem
*.key
*.cert
config/secrets.js
credentials.json
```

## Emergency Response

### If API Keys Are Exposed:

1. **Immediately:**
   - Rotate all exposed keys
   - Revoke old keys from provider dashboards
   - Check for unauthorized usage

2. **Within 24 hours:**
   - Review access logs
   - Update all deployments with new keys
   - Notify team members

3. **Follow-up:**
   - Document the incident
   - Review security practices
   - Implement additional safeguards

---

**Status**: ✅ API Keys Protected
**Date**: February 7, 2026
**Security Level**: Enhanced

**Remember**: Security is an ongoing process, not a one-time setup!
