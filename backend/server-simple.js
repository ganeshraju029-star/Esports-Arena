const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Esports Arena API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Basic auth endpoint for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: '123',
          username: 'testuser',
          email: email,
          role: 'player',
          wallet: { balance: 1000, totalEarnings: 1000, totalSpent: 0 },
          stats: { totalTournaments: 0, totalWins: 0, totalKills: 0, totalPoints: 0 },
          gameIDs: { freeFire: 'FF123456789', pubg: 'PUBG987654', freeFireLevel: 45, pubgLevel: 62 },
          profile: { displayName: 'Test User', avatar: null, bio: '' }
        },
        token: 'mock_jwt_token',
        refreshToken: 'mock_refresh_token'
      }
    });
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'Email and password are required'
    });
  }
});

// Mock tournaments endpoint
app.get('/api/tournaments', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tournaments: [
        {
          _id: '1',
          title: 'Free Fire Championship',
          game: 'freefire',
          mode: 'squad',
          entryFee: 0,
          prizePool: 5000,
          maxPlayers: 100,
          joinedPlayers: [],
          status: 'upcoming',
          schedule: {
            tournamentStart: new Date(Date.now() + 86400000).toISOString()
          },
          isJoined: false,
          canJoin: true
        },
        {
          _id: '2',
          title: 'PUBG Elite Showdown',
          game: 'pubg',
          mode: 'solo',
          entryFee: 100,
          prizePool: 10000,
          maxPlayers: 50,
          joinedPlayers: [],
          status: 'upcoming',
          schedule: {
            tournamentStart: new Date(Date.now() + 172800000).toISOString()
          },
          isJoined: false,
          canJoin: true
        }
      ]
    }
  });
});

// Mock user stats endpoint
app.get('/api/users/stats', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      stats: { totalTournaments: 0, totalWins: 0, totalKills: 0, totalPoints: 0 },
      wallet: { balance: 1000, totalEarnings: 1000, totalSpent: 0 },
      recentMatches: [],
      tournamentStats: { total: 0, upcoming: 0, completed: 0 },
      transactionStats: []
    }
  });
});

// Mock user tournaments endpoint
app.get('/api/users/tournaments', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tournaments: []
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Esports Arena API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
