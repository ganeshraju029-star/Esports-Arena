# 🎮 Esports Arena - Complete Setup Instructions

## 🚀 START HERE - Quick Launch

### Step 1: Install & Start (5 minutes)

**Double-click this file:** `start-servers.bat`

This will automatically:
- ✅ Check Node.js installation
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Start backend server (port 5000)
- ✅ Start frontend server (port 3000)

**Wait for both servers to fully start** (you'll see "ready" messages)

---

### Step 2: Verify Connection (1 minute)

Open your browser and visit:
```
http://localhost:3000/test-connection
```

You should see:
- ✅ Green checkmark = Backend connected
- ✅ API health response displayed
- ✅ Tournaments loaded from database

If you see red X, see troubleshooting below.

---

### Step 3: Login & Test (2 minutes)

1. Go to http://localhost:3000
2. Click "Login" button
3. Use these credentials:
   - **Email:** `admin@esportsarena.com`
   - **Password:** `admin123456`
4. You'll be redirected to dashboard
5. Browse tournaments, join events, test features!

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js v16+** installed ([Download](https://nodejs.org/))
- [ ] **MongoDB** running locally OR cloud connection string
- [ ] **Ports 3000 & 5000** available (not used by other apps)
- [ ] **Internet connection** for dependency installation

### Check Node.js Installation
```bash
node --version  # Should show v16.x.x or higher
npm --version   # Should show 8.x.x or higher
```

### MongoDB Options

**Option A: Local MongoDB (Recommended for development)**
- Download: https://www.mongodb.com/try/download/community
- Windows service: `net start MongoDB`
- Default connection: `mongodb://localhost:27017/esports_arena`

**Option B: MongoDB Atlas (Cloud - Free tier)**
- Create account: https://cloud.mongodb.com/
- Create free cluster
- Get connection string
- Update `backend/.env` with your connection string

---

## 🔧 Manual Setup (If automatic fails)

### Terminal 1 - Backend Server
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 5000 in development mode
Connected to MongoDB
```

### Terminal 2 - Frontend Server
```bash
# From project root
npm install
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000
```

---

## 🧪 Testing All Features

### 1. Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] Logout
- [ ] Session persistence (refresh page)

### 2. Tournaments
- [ ] View tournament list
- [ ] Filter by game (Free Fire / PUBG)
- [ ] Search tournaments
- [ ] Join a tournament
- [ ] View tournament details

### 3. Dashboard
- [ ] View statistics
- [ ] See joined tournaments
- [ ] Check wallet balance
- [ ] View profile info

### 4. Real-time Features
- [ ] Socket.io connection (check browser console)
- [ ] Live tournament updates
- [ ] Notifications

---

## 🐛 Troubleshooting Guide

### Backend Won't Start

**Error: Cannot connect to MongoDB**
```bash
# Solution 1: Start MongoDB service (Windows)
net start MongoDB

# Solution 2: Use MongoDB Atlas cloud database
# Update backend/.env with your connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/esports_arena
```

**Error: Port 5000 already in use**
```bash
# Find and kill process using port 5000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or change port in backend/.env
PORT=5001
# Then update NEXT_PUBLIC_API_URL in .env.local
```

### Frontend Won't Start

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Error: Port 3000 already in use**
```bash
# Kill process or use different port
npm run dev -- -p 3001
```

### Can't Connect to API

**Symptoms:**
- Login doesn't work
- Tournaments don't load
- Dashboard shows empty data

**Solutions:**

1. **Check backend is running**
   ```bash
   # Visit in browser
   http://localhost:5000/api/health
   
   # Should return: {"status": "success", "message": "Esports Arena API is running"}
   ```

2. **Verify .env.local exists**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

3. **Check CORS settings in backend**
   - Open `backend/server.js`
   - Ensure CORS allows localhost:3000

### Database Errors

**Error: User already exists**
- Clear database or use different email
- MongoDB shell: `db.users.deleteMany({})`

**Error: Cannot read property of undefined**
- Check if database has data
- Insert sample tournaments via MongoDB Compass

---

## 📁 Project Structure

```
Esports Arena/
├── app/                    # Next.js pages
│   ├── dashboard/         # User dashboard
│   ├── tournaments/       # Tournament browser
│   ├── login/             # Auth pages
│   └── test-connection/   # API test page
├── backend/               # Express.js server
│   ├── routes/           # API endpoints
│   ├── models/           # MongoDB schemas
│   ├── middleware/       # Auth & validation
│   └── server.js         # Main server file
├── components/            # React components
├── contexts/             # React contexts (Auth)
├── lib/                  # Utilities (API, Socket)
├── .env.local            # Frontend env vars
├── next.config.js        # Next.js config
└── start-servers.bat     # Startup script
```

---

## 🎯 What's Working Now

### ✅ Fixed Features

1. **Authentication System**
   - JWT-based login/register
   - Token refresh
   - Protected routes
   - Session persistence

2. **Tournament System**
   - Fetch from MongoDB
   - Filter & search
   - Join tournaments
   - Real-time updates

3. **Dashboard**
   - User statistics
   - Joined tournaments
   - Wallet information
   - Profile management

4. **API Integration**
   - All mock data replaced
   - Real backend calls
   - Error handling
   - Loading states

5. **Socket.io**
   - Real-time connection
   - Tournament updates
   - Live notifications

---

## 🔐 Security Notes

**Development Mode:**
- Test Razorpay keys included
- Debug logging enabled
- CORS allows localhost only

**For Production:**
1. Replace all test keys with live keys
2. Update CORS origins
3. Enable HTTPS
4. Set NODE_ENV=production
5. Use strong JWT secrets

---

## 📞 Support Resources

### Documentation Files
- `QUICKSTART.md` - Fast setup guide
- `SETUP.md` - Detailed instructions
- `FIXES_SUMMARY.md` - What was fixed
- `README.md` - Project overview

### Diagnostic Tools
- `/test-connection` - Check API connectivity
- Browser Console - View errors
- Backend Logs - `backend/logs/`

### Useful Commands

```bash
# Check if ports are available
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Restart MongoDB (Windows)
net stop MongoDB
net start MongoDB

# View npm cache
npm cache verify

# Clear Next.js cache
rm -rf .next
```

---

## 🎉 Success Checklist

You know everything is working when:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Test connection page shows green checkmark
- [ ] Can login successfully
- [ ] Dashboard shows user data
- [ ] Tournaments load from database
- [ ] Can join tournaments
- [ ] No console errors

---

## 🚀 Next Steps After Setup

1. **Create Your Account**
   - Register with your email
   - Add game IDs (Free Fire / PUBG)
   - Complete profile

2. **Explore Features**
   - Browse available tournaments
   - Join upcoming events
   - Check leaderboard

3. **Customize (Optional)**
   - Update branding in `components/`
   - Change theme colors in `globals.css`
   - Add more games in tournament model

4. **Deploy (When Ready)**
   - Frontend: Vercel, Netlify, or your server
   - Backend: Railway, Heroku, or VPS
   - Database: MongoDB Atlas

---

## 💡 Pro Tips

1. **Keep both terminals open** to see logs from both servers
2. **Use test connection page** whenever you encounter issues
3. **Check browser console** for helpful error messages
4. **MongoDB Compass** is great for viewing/editing database
5. **Hot reload** is enabled - changes reflect instantly

---

**Ready to compete? Let's go! 🎮🏆**
