# 🚀 Quick Start Guide - Esports Arena

## ⚡ Start Using in 3 Steps

### 1️⃣ Install Dependencies (First Time Only)
```bash
# Run the setup script
start-servers.bat
```

This will automatically:
- Install backend dependencies
- Install frontend dependencies  
- Start both servers

### 2️⃣ Access the Application
- **Frontend:** http://localhost:3000
- **Test Connection:** http://localhost:3000/test-connection
- **Backend API:** http://localhost:5000/api/health

### 3️⃣ Login or Register
- Go to http://localhost:3000/login
- Create an account or use test admin:
  - Email: `admin@esportsarena.com`
  - Password: `admin123456`

---

## 🛠️ If You Encounter Issues

### Backend Not Starting?
```bash
cd backend
npm install
npm run dev
```

### Frontend Not Starting?
```bash
npm install
npm run dev
```

### Can't Connect to API?
1. Check if backend is running (port 5000)
2. Visit http://localhost:3000/test-connection
3. Check `.env.local` has correct URL

### MongoDB Errors?
- Ensure MongoDB is running locally OR
- Use MongoDB Atlas (cloud) - update connection string in `backend/.env`

---

## 📋 What Was Fixed

✅ **API Integration** - Replaced mock data with real API calls
✅ **Authentication** - JWT-based login/register working
✅ **Tournament System** - Fetch and join tournaments from database
✅ **Dashboard** - Real user data from backend
✅ **Socket.io** - Real-time updates configured
✅ **Environment Setup** - Proper .env configuration
✅ **Proxy Setup** - Next.js rewrites to backend API

---

## 🎮 Test Features

1. **Login/Register** - Create account, login
2. **Browse Tournaments** - View available tournaments
3. **Join Tournament** - Click "Join Now" button
4. **Dashboard** - View your stats and tournaments
5. **Wallet** - Check balance and transactions

---

## 📞 Need Help?

Check these files:
- `SETUP.md` - Detailed setup instructions
- `README.md` - Project documentation
- `backend/logs/` - Backend error logs

Visit `/test-connection` page to diagnose API issues!
