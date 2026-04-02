const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Mock data for development
const mockUsers = [
  { id: 1, email: 'admin@esportsarena.com', role: 'admin', username: 'admin', wallet: { balance: 5000 } },
  { id: 2, email: 'player@test.com', role: 'player', username: 'player', wallet: { balance: 1000 } }
];

const mockTournaments = [
  {
    _id: '1',
    title: 'Free Fire Championship',
    game: 'freefire',
    status: 'active',
    participants: 85,
    prizePool: 5000,
    entryFee: 100,
    maxPlayers: 100
  },
  {
    _id: '2',
    title: 'PUBG Elite Showdown',
    game: 'pubg',
    status: 'upcoming',
    participants: 50,
    prizePool: 10000,
    entryFee: 200,
    maxPlayers: 50
  }
];

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user) {
    res.json({
      status: 'success',
      token: 'mock_jwt_token_' + Date.now(),
      data: { user }
    });
  } else {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, username, password } = req.body;
  
  const newUser = {
    id: mockUsers.length + 1,
    email,
    username,
    role: 'player',
    wallet: { balance: 1000 }
  };
  
  mockUsers.push(newUser);
  
  res.json({
    status: 'success',
    token: 'mock_jwt_token_' + Date.now(),
    data: { user: newUser }
  });
});

app.get('/api/tournaments', (req, res) => {
  res.json({
    status: 'success',
    data: { tournaments: mockTournaments }
  });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    status: 'success',
    data: {
      totalTournaments: mockTournaments.length,
      totalUsers: mockUsers.length,
      activeTournaments: 1,
      totalRevenue: 25000
    }
  });
});

app.post('/api/payments/create-order', (req, res) => {
  res.json({
    status: 'success',
    data: {
      id: 'order_' + Date.now(),
      amount: req.body.amount,
      currency: 'INR'
    }
  });
});

app.post('/api/payments/verify', (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'Payment verified successfully',
      walletBalance: 2000
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Esports Arena API is running (Mock Mode)',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Mock API ready for development`);
  console.log(`🌐 Frontend should connect to: http://localhost:3000`);
});

module.exports = app;
