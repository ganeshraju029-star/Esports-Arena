# Esports Arena Backend

A comprehensive, secure, and scalable backend system for managing esports tournaments, built with Node.js and Express.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Tournament Management**: Create, manage, and track tournaments
- **Payment System**: Razorpay integration for secure payments
- **User Management**: Profile management, game IDs, and statistics
- **Real-time Updates**: Socket.io for live notifications
- **Admin Control Panel**: Complete admin dashboard for platform management
- **Match Results & Leaderboards**: Track performance and rankings
- **File Uploads**: Profile pictures and tournament thumbnails
- **Security**: Input validation, rate limiting, and anti-abuse measures

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi for input validation
- **Payments**: Razorpay
- **Real-time**: Socket.io
- **File Uploads**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## 📋 Requirements

- Node.js 16.0.0 or higher
- MongoDB 4.4 or higher
- Redis (optional, for caching)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd esports-arena-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/esports_arena
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   mkdir logs
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PATCH | `/api/users/profile` | Update user profile | Yes |
| GET | `/api/users/stats` | Get user statistics | Yes |
| GET | `/api/users/tournaments` | Get user's tournaments | Yes |
| GET | `/api/users/matches` | Get user's match history | Yes |
| GET | `/api/users/transactions` | Get user's transactions | Yes |
| GET | `/api/users/leaderboard` | Get global leaderboard | No |
| GET | `/api/users/search` | Search users | No |
| GET | `/api/users/:id` | Get public user profile | No |

### Tournament Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tournaments` | Get all tournaments | Optional |
| GET | `/api/tournaments/featured` | Get featured tournaments | Optional |
| GET | `/api/tournaments/:id` | Get single tournament | Optional |
| POST | `/api/tournaments` | Create tournament | Admin |
| PATCH | `/api/tournaments/:id` | Update tournament | Admin |
| POST | `/api/tournaments/:id/join` | Join tournament | Player |
| POST | `/api/tournaments/:id/leave` | Leave tournament | Player |
| GET | `/api/tournaments/:id/leaderboard` | Get tournament leaderboard | No |
| GET | `/api/tournaments/:id/stats` | Get tournament statistics | No |
| DELETE | `/api/tournaments/:id` | Delete tournament | Admin |

### Payment Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-order` | Create payment order | Yes |
| POST | `/api/payments/tournament-entry/:tournamentId` | Create tournament entry order | Yes |
| POST | `/api/payments/verify` | Verify payment | Yes |
| POST | `/api/payments/webhook` | Razorpay webhook | No |
| GET | `/api/payments/wallet` | Get wallet balance | Yes |
| POST | `/api/payments/withdraw` | Request withdrawal | Yes |
| GET | `/api/payments/methods` | Get payment methods | No |

### Admin Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Get dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PATCH | `/api/admin/users/:id/ban` | Ban/unban user | Admin |
| PATCH | `/api/admin/users/:id/role` | Update user role | Admin |
| GET | `/api/admin/tournaments` | Get all tournaments | Admin |
| POST | `/api/admin/tournaments/:id/results` | Add match results | Admin |
| GET | `/api/admin/transactions` | Get all transactions | Admin |
| PATCH | `/api/admin/withdrawal/:transactionId` | Process withdrawal | Admin |
| GET | `/api/admin/analytics` | Get analytics | Admin |
| GET | `/api/admin/health` | System health check | Admin |

### Upload Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/uploads/avatar` | Upload profile picture | Yes |
| POST | `/api/uploads/match-screenshot` | Upload match screenshots | Yes |
| POST | `/api/uploads/tournament-thumbnail` | Upload tournament thumbnail | Admin |
| GET | `/api/uploads/:filename` | Serve uploaded file | No |
| DELETE | `/api/uploads/:filename` | Delete uploaded file | Admin |

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Input Validation**: Comprehensive validation using Joi
- **Rate Limiting**: Prevent brute force attacks
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable CORS settings
- **Helmet.js**: HTTP security headers
- **Data Sanitization**: Prevent NoSQL injection
- **File Upload Security**: File type and size validation

## 📊 Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (player/admin),
  gameIDs: {
    freeFire: String,
    pubg: String,
    freeFireLevel: Number,
    pubgLevel: Number
  },
  wallet: {
    balance: Number,
    totalEarnings: Number,
    totalSpent: Number
  },
  stats: {
    totalTournaments: Number,
    totalWins: Number,
    totalKills: Number,
    totalPoints: Number,
    globalRank: Number
  },
  profile: {
    avatar: String,
    bio: String,
    displayName: String
  }
}
```

### Tournament Model
```javascript
{
  title: String,
  game: String (freefire/pubg),
  mode: String (solo/duo/squad),
  difficulty: String (easy/medium/hard),
  levelRequirements: {
    minLevel: Number,
    maxLevel: Number,
    basedOn: String (freefire/pubg/any)
  },
  entryFee: Number,
  prizePool: Number,
  maxPlayers: Number,
  joinedPlayers: [Object],
  status: String,
  schedule: {
    registrationStart: Date,
    registrationEnd: Date,
    tournamentStart: Date
  },
  roomDetails: {
    roomId: String,
    roomPassword: String,
    map: String,
    server: String
  }
}
```

## 🚀 Deployment

### Environment Variables
Make sure to set the following environment variables in production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
RAZORPAY_KEY_ID=your_production_razorpay_key_id
RAZORPAY_KEY_SECRET=your_production_razorpay_key_secret
EMAIL_HOST=your_email_host
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### PM2 Setup
```bash
npm install -g pm2
pm2 start server.js --name esports-arena-backend
pm2 startup
pm2 save
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Logging

The application uses Winston for logging. Logs are stored in the `logs` directory:
- `error.log`: Error messages
- `combined.log`: All log messages

## 🔄 Real-time Features

Socket.io is used for real-time updates:
- Tournament updates
- Player join/leave notifications
- Wallet updates
- Live leaderboard updates

## 📧 Email Service

The application includes an email service for:
- Welcome emails
- Tournament notifications
- Payment confirmations
- Password resets

## 🛡️ Error Handling

Comprehensive error handling with:
- Custom error classes
- Development vs production error responses
- Error logging
- Graceful error recovery

## 📈 Performance

- Database indexing for optimal query performance
- Pagination for large datasets
- Compression middleware
- Efficient query patterns
- Caching support (Redis optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
