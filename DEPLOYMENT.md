# 🚀 Netlify Deployment Guide - Esports Arena

## 📋 Overview

This guide will help you deploy the Esports Arena frontend to Netlify with full functionality.

**Important Notes:**
- ⚠️ **Frontend only** on Netlify (static site)
- ⚠️ **Backend must be deployed separately** (Railway, Render, Heroku, etc.)
- ✅ **Demo mode works** without backend (mock data)
- ✅ **Full functionality** when connected to deployed backend

---

## 🎯 Quick Deploy to Netlify

### Option 1: One-Click Deploy (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ganeshraju029-star/Esports-Arena)

1. Click the button above
2. Connect your GitHub repository
3. Configure build settings (auto-detected)
4. Add environment variables
5. Deploy!

### Option 2: Manual Deploy via Git

```bash
# 1. Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit"

# 2. Connect to GitHub
git remote add origin https://github.com/ganeshraju029-star/Esports-Arena.git
git push -u origin main

# 3. Connect Netlify to your repo
# Visit https://app.netlify.com/ and connect your GitHub repo
```

### Option 3: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Deploy
netlify deploy --prod
```

---

## ⚙️ Build Configuration

### Netlify Settings

**Build command:**
```
npm run build
```

**Publish directory:**
```
out
```

**Environment variables (required):**
```
NODE_VERSION=20
NPM_VERSION=10
NEXT_TELEMETRY_DISABLED=1
```

### Environment Variables (Optional)

For full backend integration:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_FRONTEND_URL=https://your-site.netlify.app
```

**Without backend URL:** Site will work in demo mode with mock data.

---

## 🔧 Backend Deployment (Optional but Recommended)

For full functionality, deploy the backend separately:

### Option 1: Railway.app (Recommended)

1. Go to https://railway.app/
2. Create new project → Deploy from GitHub
3. Select your Esports-Arena repo
4. Add `backend` as root directory
5. Add environment variables from `backend/.env.example`
6. Deploy!

**Railway Setup Steps:**

```bash
# In Railway dashboard, set these env vars:
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=production
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### Option 2: Render.com

1. Go to https://render.com/
2. New Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add environment variables

### Option 3: Vercel (Serverless Functions)

You can convert backend routes to Vercel serverless functions:
- Move routes to `api/` folder
- Deploy to Vercel alongside frontend

---

## 🎨 Post-Deployment Configuration

### 1. Update CORS in Backend

After deploying backend, update `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://your-site.netlify.app",
  credentials: true
}));
```

### 2. Update Frontend Environment Variables

In Netlify dashboard → Site Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
NEXT_PUBLIC_FRONTEND_URL=https://your-site.netlify.app
```

### 3. Rebuild Site

After adding environment variables:
- Go to Deploys tab
- Click "Trigger deploy"
- Select "Clear cache and deploy site"

---

## ✅ Testing Your Deployment

### Demo Mode Test (Without Backend)

1. Visit your Netlify URL
2. Try logging in with any email
3. Browse tournaments (mock data)
4. Join tournaments (demo mode)

### Full Mode Test (With Backend)

1. Visit your Netlify URL
2. Register/Login
3. Check if real data loads
4. Join a tournament
5. Check dashboard stats

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Check build locally
npm run build

# Fix any TypeScript errors
# Push fixes to GitHub
# Netlify will auto-redeploy
```

### Issue: API Calls Fail

**Solutions:**
1. Check CORS settings in backend
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Ensure backend is running
4. Check browser console for errors

### Issue: Blank Page After Deploy

**Solutions:**
1. Check browser console for errors
2. Verify `next.config.js` has `output: 'export'`
3. Check if `.env.local` is NOT committed (should be in `.gitignore`)

### Issue: Login Doesn't Work

**Check:**
1. Is backend deployed and running?
2. Is `NEXT_PUBLIC_API_URL` set correctly?
3. Check Network tab in browser DevTools
4. Verify CORS allows your Netlify domain

---

## 📊 Features Comparison

| Feature | Demo Mode (No Backend) | Full Mode (With Backend) |
|---------|----------------------|-------------------------|
| Login/Register | ✅ Mock | ✅ Real |
| Tournaments | ✅ Static | ✅ Dynamic |
| Join Tournament | ✅ Demo | ✅ Real |
| Dashboard Stats | ✅ Mock | ✅ Real |
| Wallet | ✅ Display Only | ✅ Full Functionality |
| Leaderboard | ❌ Not Available | ✅ Available |
| Real-time Updates | ❌ Not Available | ✅ Socket.io |

---

## 🔒 Security Best Practices

1. **Never commit sensitive data:**
   - `.env` files
   - API keys
   - Database passwords

2. **Use Netlify Environment Variables:**
   - Store all secrets in Netlify dashboard
   - Mark them as "Secure" (encrypted)

3. **Enable HTTPS:**
   - Netlify provides free SSL
   - Force HTTPS in Netlify settings

4. **Update CORS origins:**
   - Only allow your production domain
   - Don't use `*` in production

---

## 📈 Performance Optimization

### Enable Auto-Optimization

In Netlify dashboard:
- Site Settings → Build & Deploy → Post Processing
- Enable "Auto Minify" for HTML, CSS, JS

### Set Up Custom Domain

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Netlify: Domain Settings → Add custom domain
3. Update DNS records as instructed
4. Enable HTTPS

### Enable Caching

Add to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🎉 Deployment Checklist

Before going live:

- [ ] All environment variables set
- [ ] Backend deployed (if using full mode)
- [ ] CORS configured correctly
- [ ] Tested login/register
- [ ] Tested tournament features
- [ ] Checked mobile responsiveness
- [ ] Verified all pages load
- [ ] No console errors
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled

---

## 📞 Support Resources

### Netlify Documentation
- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)

### Community
- [Netlify Forum](https://answers.netlify.com/)
- [GitHub Issues](https://github.com/ganeshraju029-star/Esports-Arena/issues)

---

## 🚀 Quick Commands

```bash
# Test build locally
npm run build

# Preview build locally
netlify dev

# Deploy to production
netlify deploy --prod

# Open admin panel
netlify open

# View logs
netlify status
```

---

**Ready to deploy? Let's go! 🎮🏆**

Your site will be live at: `https://your-repo-name.netlify.app`
