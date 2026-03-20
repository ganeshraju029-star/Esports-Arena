const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player'
  },
  gameIDs: {
    freeFire: {
      type: String,
      trim: true,
      match: [/^\d{9,12}$/, 'Free Fire ID must be 9-12 digits'],
      default: null
    },
    pubg: {
      type: String,
      trim: true,
      match: [/^\d{9,12}$/, 'PUBG ID must be 9-12 digits'],
      default: null
    },
    freeFireLevel: {
      type: Number,
      min: 1,
      max: 100,
      default: null
    },
    pubgLevel: {
      type: Number,
      min: 1,
      max: 100,
      default: null
    }
  },
  wallet: {
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: [0, 'Total earnings cannot be negative']
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, 'Total spent cannot be negative']
    }
  },
  stats: {
    totalTournaments: {
      type: Number,
      default: 0
    },
    totalWins: {
      type: Number,
      default: 0
    },
    totalKills: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    globalRank: {
      type: Number,
      default: null
    }
  },
  profile: {
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
      default: ''
    }
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for match history
userSchema.virtual('matchHistory', {
  ref: 'MatchResult',
  localField: '_id',
  foreignField: 'userId'
});

// Virtual for transactions
userSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'userId'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to update last login
userSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if user has required game ID
userSchema.methods.hasGameID = function(game) {
  if (game === 'freefire') {
    return this.gameIDs.freeFire && this.gameIDs.freeFireLevel;
  } else if (game === 'pubg') {
    return this.gameIDs.pubg && this.gameIDs.pubgLevel;
  }
  return false;
};

// Instance method to get game level
userSchema.methods.getGameLevel = function(game) {
  if (game === 'freefire') {
    return this.gameIDs.freeFireLevel;
  } else if (game === 'pubg') {
    return this.gameIDs.pubgLevel;
  }
  return null;
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = async function(game = 'all', limit = 100) {
  const matchStage = game === 'all' ? {} : { 'stats.totalWins': { $gt: 0 } };
  
  return await this.aggregate([
    { $match: matchStage },
    {
      $addFields: {
        totalScore: {
          $add: [
            { $multiply: ['$stats.totalWins', 100] },
            { $multiply: ['$stats.totalKills', 10] },
            '$stats.totalPoints'
          ]
        }
      }
    },
    { $sort: { totalScore: -1, 'stats.totalWins': -1 } },
    { $limit: limit },
    {
      $project: {
        username: 1,
        'profile.displayName': 1,
        'profile.avatar': 1,
        'stats.totalWins': 1,
        'stats.totalKills': 1,
        'stats.totalPoints': 1,
        'stats.globalRank': 1,
        totalScore: 1,
        gameIDs: 1
      }
    }
  ]);
};

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.globalRank': 1 });
userSchema.index({ 'wallet.balance': 1 });
userSchema.index({ isBanned: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
