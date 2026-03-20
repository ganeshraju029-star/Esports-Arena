# 🎮 Esports Arena - Setup Guide

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 2. Configure Environment Variables

**Backend (.env):**
- MongoDB connection string (default: `mongodb://localhost:27017/esports_arena`)
- JWT secrets (already configured in `.env.example`)
- Razorpay keys (test keys provided for development)

**Frontend (.env.local):**
- API URL: `http://localhost:5000/api`
- Socket URL: `http://localhost:5000`

### 3. Start the Servers

**Option A: Use the startup script (Recommended)**
```bash
start-servers.bat
```

**Option B: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api/health

## Requirements

- **Node.js** v16+ 
- **MongoDB** v4.4+ (local or cloud instance)
- **npm** or **yarn**

## MongoDB Setup

### Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### Cloud MongoDB (Alternative)
1. Create account at https://cloud.mongodb.com/
2. Create a new cluster (free tier available)
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## Default Admin Account

- **Email:** admin@esportsarena.com
- **Password:** admin123456

To access admin panel, go to: `/login?role=admin`

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify `.env` file exists in backend directory

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `.env.local` has correct API URL
- Check CORS settings in backend

### Database connection errors
- Verify MongoDB is running
- Check MongoDB connection string in `backend/.env`
- Ensure MongoDB user has proper permissions

## Development Mode

Both servers run in development mode with:
- Hot reload enabled
- Detailed error messages
- Debug logging

## Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## API Documentation

Available API endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments/:id/join` - Join tournament
- `GET /api/tournaments/featured` - Get featured tournaments

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/tournaments` - Get user tournaments

## Features

✅ User authentication (JWT)
✅ Tournament management
✅ Real-time updates (Socket.io)
✅ Wallet system (Razorpay integration)
✅ Leaderboard system
✅ Admin dashboard
✅ Responsive design
✅ Dark theme with orange accents

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Socket.io-client

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io
- JWT authentication
- Razorpay payment gateway

## Support

For issues or questions:
1. Check this guide first
2. Review error logs in `backend/logs/`
3. Check browser console for frontend errors
