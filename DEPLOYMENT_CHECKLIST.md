# ✅ Netlify Deployment Checklist

## Pre-Deployment

### 1. Verify Files
- [ ] `.gitignore` exists and includes `.env.local`
- [ ] `netlify.toml` configured correctly
- [ ] `next.config.js` has `output: 'export'`
- [ ] All dependencies in `package.json`

### 2. Environment Setup
- [ ] Create `.env.local` from `.env.local.example` (for local testing)
- [ ] Test locally: `npm run dev`
- [ ] Build locally: `npm run build`
- [ ] Verify no errors in console

### 3. GitHub Repository
- [ ] Code committed to Git
- [ ] Pushed to GitHub repository
- [ ] Repository is public (or connect Netlify to private repo)

---

## Netlify Configuration

### 4. Connect to Netlify
- [ ] Login to [Netlify](https://app.netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Choose "GitHub" and authorize Netlify
- [ ] Select repository: `ganeshraju029-star/Esports-Arena`

### 5. Build Settings (Auto-detected)
- [ ] **Build command:** `npm run build`
- [ ] **Publish directory:** `out`
- [ ] **Functions directory:** (leave blank)

### 6. Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

**Required:**
- [ ] `NODE_VERSION` = `20`
- [ ] `NPM_VERSION` = `10`
- [ ] `NEXT_TELEMETRY_DISABLED` = `1`

**Optional (for demo mode):**
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_test_xxxxx`

**Optional (for full backend integration):**
- [ ] `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app/api`
- [ ] `NEXT_PUBLIC_SOCKET_URL` = `https://your-backend.railway.app`
- [ ] `NEXT_PUBLIC_FRONTEND_URL` = `https://your-site.netlify.app`

### 7. Deploy
- [ ] Click "Deploy site"
- [ ] Wait for build to complete (~2-5 minutes)
- [ ] Check deploy logs for any errors

---

## Post-Deployment Testing

### 8. Initial Tests
- [ ] Site loads at Netlify URL (e.g., `https://esports-arena.netlify.app`)
- [ ] No 404 errors
- [ ] Homepage displays correctly
- [ ] Navigation works

### 9. Feature Tests

**Demo Mode (Without Backend):**
- [ ] Login with any email works
- [ ] Registration works
- [ ] Tournaments display (mock data)
- [ ] Join tournament shows success message
- [ ] Dashboard loads with mock stats

**Full Mode (With Backend):**
- [ ] Login with real credentials
- [ ] Real tournament data loads
- [ ] Can join tournaments
- [ ] Dashboard shows real user data
- [ ] Wallet balance displays

### 10. Mobile Testing
- [ ] Site is responsive
- [ ] Mobile menu works
- [ ] All buttons clickable
- [ ] Forms work on mobile

---

## Troubleshooting

### Common Issues & Solutions

#### ❌ Build Failed
**Check:**
- TypeScript errors: Run `npm run build` locally
- Missing dependencies: Check `package.json`
- Node version: Ensure `NODE_VERSION=20` in Netlify

#### ❌ Blank Page After Deploy
**Solutions:**
- Check browser console for errors
- Verify `next.config.js` has `output: 'export'`
- Check if `netlify.toml` publish directory is `out`

#### ❌ API Calls Fail (404)
**Solutions:**
- This is normal without backend deployed
- Site will work in demo mode
- To enable full mode, deploy backend separately

#### ❌ Login Doesn't Work
**Check:**
- In demo mode: Any email should work
- In full mode: Verify backend URL is correct
- Check CORS settings in backend

---

## Advanced Configuration

### Custom Domain (Optional)
- [ ] Purchase domain (Namecheap, GoDaddy, etc.)
- [ ] In Netlify: Domain Settings → Add custom domain
- [ ] Follow DNS configuration instructions
- [ ] Enable HTTPS (automatic with Let's Encrypt)

### Performance Optimization
- [ ] Enable Auto Minify in Netlify settings
- [ ] Set up CDN caching headers
- [ ] Optimize images (use WebP format)
- [ ] Enable gzip compression

### Security Hardening
- [ ] All sensitive data in environment variables
- [ ] `.env` files NOT committed to Git
- [ ] HTTPS enabled
- [ ] CORS configured properly (if using backend)

---

## Monitoring & Maintenance

### Regular Checks
- [ ] Check Netlify analytics
- [ ] Monitor build logs for warnings
- [ ] Update dependencies regularly
- [ ] Test after each major update

### Continuous Deployment
- [ ] Every push to `main` branch auto-deploys
- [ ] Use preview deploys for pull requests
- [ ] Set up deploy notifications

---

## Success Criteria

✅ **Your deployment is successful when:**
- Build completes without errors
- Site loads at Netlify URL
- Login/Register works (demo mode)
- Tournaments page loads
- Dashboard accessible after login
- Mobile responsive
- No console errors

---

## Quick Reference

### Useful Netlify Commands
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Preview locally
netlify dev

# Deploy to production
netlify deploy --prod

# Open admin panel
netlify open
```

### Important URLs
- **Frontend:** `https://your-repo-name.netlify.app`
- **Backend (if deployed):** `https://your-app.railway.app`
- **Netlify Dashboard:** `https://app.netlify.com`

---

## Support Resources

- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- 📖 [GET_STARTED.md](./GET_STARTED.md) - Setup instructions
- 🐛 [GitHub Issues](https://github.com/ganeshraju029-star/Esports-Arena/issues)
- 💬 [Netlify Forum](https://answers.netlify.com/)

---

## Final Checklist Before Going Live

- [ ] All tests passed
- [ ] No console errors
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Backup plan ready
- [ ] Team notified (if applicable)

---

**🎉 Ready to deploy? Follow this checklist step by step!**

**Good luck with your deployment! 🚀**
