# 🚀 Netlify Deployment with Local API Access

## 📋 Overview
Complete guide to deploy Esports Arena on Netlify while connecting to your local/remote API server.

## 🔧 Configuration Options

### **Option 1: Environment Variables (Recommended)**
In Netlify Dashboard → Site Settings → Build & Deploy → Environment:

```bash
# For Production API
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NODE_ENV=development

# For Local API Testing
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development

# Force Mock Data (if needed)
FORCE_MOCK_DATA=false
```

### **Option 2: Backend URL Configuration**
Update your backend URL in `lib/config.js`:

```javascript
API_URL: 'https://your-backend-domain.com/api'
```

## 🚀 Deployment Steps

### **1. Build Application**
```bash
# Clean build
rm -rf .next out

# Production build
npm run build
```

### **2. Deploy to Netlify**
```bash
# Using Netlify CLI
netlify deploy --prod --dir=out

# Or drag & drop 'out' folder to Netlify
```

### **3. Set Environment Variables**
In Netlify Dashboard:
- Go to Site settings → Build & deploy → Environment
- Add the variables from Option 1

## 🌐 API Access Patterns

### **Development Mode (Local API):**
```javascript
// Environment variables in Netlify
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development

// Result: Uses real API calls to localhost:5000
```

### **Production Mode (Remote API):**
```javascript
// Environment variables in Netlify
NEXT_PUBLIC_API_URL=https://your-backend.com/api
NODE_ENV=development

// Result: Uses real API calls to your backend
```

### **Mock Mode (Offline):**
```javascript
// Environment variables in Netlify
NEXT_PUBLIC_API_URL=
NODE_ENV=production
FORCE_MOCK_DATA=true

// Result: Uses mock data, no API calls
```

## 🔧 Backend Setup Requirements

### **For Local API Access:**
1. **Start Backend Server:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

2. **Enable CORS for Netlify:**
In your backend `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-site.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

3. **Configure Environment:**
```javascript
// backend/.env
FRONTEND_URL=https://your-site.netlify.app
```

### **For Remote API Access:**
1. **Deploy Backend to Cloud:**
   - Heroku, Vercel, AWS, DigitalOcean
   - Ensure HTTPS and proper CORS

2. **Update Frontend Config:**
```javascript
// lib/config.js
API_URL: 'https://your-backend-domain.com/api'
```

## 📱 Testing API Connection

### **Test Local API:**
```bash
# 1. Start backend locally
cd backend && npm start

# 2. Set Netlify env to local API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# 3. Test endpoints
curl https://your-site.netlify.app/api/health
```

### **Test Remote API:**
```bash
# 1. Deploy backend to cloud
# 2. Update environment variables
# 3. Test deployment
curl https://your-site.netlify.app/api/health
```

## 🔍 Debugging API Issues

### **Common Problems:**

#### **CORS Errors:**
```javascript
// Backend CORS Configuration
app.use(cors({
  origin: [
    'https://your-site.netlify.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

#### **API Timeouts:**
```javascript
// Frontend timeout handling
const response = await fetch(`${config.API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  signal: AbortSignal.timeout(10000) // 10 second timeout
});
```

#### **Environment Detection:**
```javascript
// Check current mode
console.log('API URL:', config.API_URL);
console.log('Use Mock:', config.USE_MOCK_DATA());
console.log('Is Development:', config.IS_DEVELOPMENT);
```

## 🚀 Quick Deployment Commands

### **Deploy with Local API:**
```bash
# 1. Set environment variables
export NEXT_PUBLIC_API_URL=http://localhost:5000/api
export NODE_ENV=development

# 2. Build and deploy
npm run build
netlify deploy --prod --dir=out
```

### **Deploy with Remote API:**
```bash
# 1. Set environment variables
export NEXT_PUBLIC_API_URL=https://your-backend.com/api
export NODE_ENV=development

# 2. Build and deploy
npm run build
netlify deploy --prod --dir=out
```

### **Deploy with Mock Data:**
```bash
# 1. Build for production
npm run build

# 2. Deploy
netlify deploy --prod --dir=out
```

## 📊 Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://api.example.com/api` |
| `NODE_ENV` | Environment mode | `development` |
| `FORCE_MOCK_DATA` | Force mock mode | `false` |
| `FRONTEND_URL` | CORS allowed origin | `https://site.netlify.app` |

## 🎯 Deployment Checklist

### **Pre-Deployment:**
- [ ] Backend server accessible
- [ ] CORS configured for Netlify domain
- [ ] Environment variables tested locally
- [ ] Build process completes successfully
- [ ] All API endpoints work

### **Post-Deployment:**
- [ ] Site loads on Netlify URL
- [ ] API calls reach backend
- [ ] Authentication works
- [ ] No CORS errors in console
- [ ] All features functional

## 🔧 Troubleshooting

### **API Not Working:**
1. Check environment variables in Netlify dashboard
2. Verify backend is running and accessible
3. Check CORS configuration
4. Review browser console for errors

### **Build Errors:**
1. Clear Next.js cache: `rm -rf .next`
2. Check TypeScript errors
3. Verify all imports are correct
4. Test build locally first

### **Authentication Issues:**
1. Verify API endpoints match
2. Check JWT configuration
3. Test with Postman/curl first
4. Review network requests in browser

---

**🚀 Your Esports Arena is now ready for Netlify deployment with API access!**
