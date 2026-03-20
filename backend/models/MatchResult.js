const mongoose = require('mongoose');

const matchResultSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament is required']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  team: {
    type: String,
    trim: true,
    default: null
  },
  stats: {
    kills: {
      type: Number,
      required: [true, 'Kills is required'],
      min: [0, 'Kills cannot be negative'],
      default: 0
    },
    position: {
      type: Number,
      required: [true, 'Position is required'],
      min: [1, 'Position must be at least 1']
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative']
    },
    damage: {
      type: Number,
      default: 0,
      min: [0, 'Damage cannot be negative']
    },
    survivalTime: {
      type: Number, // in seconds
      default: 0,
      min: [0, 'Survival time cannot be negative']
    },
    headshots: {
      type: Number,
      default: 0,
      min: [0, 'Headshots cannot be negative']
    },
    longestKill: {
      type: Number, // in meters
      default: 0,
      min: [0, 'Longest kill cannot be negative']
    },
    assists: {
      type: Number,
      default: 0,
      min: [0, 'Assists cannot be negative']
    },
    revives: {
      type: Number,
      default: 0,
      min: [0, 'Revives cannot be negative']
    }
  },
  rank: {
    type: Number,
    required: [true, 'Rank is required'],
    min: [1, 'Rank must be at least 1']
  },
  prize: {
    type: Number,
    default: 0,
    min: [0, 'Prize cannot be negative']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationScreenshot: {
    type: String, // URL to screenshot
    default: null
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Additional match data
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for score calculation
matchResultSchema.virtual('score').get(function() {
  // Scoring formula: position points + kills * 10 + other bonuses
  let score = 0;
  
  // Position points (higher for better position)
  if (this.position === 1) score += 100;
  else if (this.position === 2) score += 80;
  else if (this.position === 3) score += 60;
  else if (this.position <= 5) score += 40;
  else if (this.position <= 10) score += 20;
  else if (this.position <= 20) score += 10;
  
  // Kill points
  score += this.stats.kills * 10;
  
  // Bonus points
  score += this.stats.headshots * 5;
  score += this.stats.damage / 100; // 1 point per 100 damage
  
  return Math.round(score);
});

// Pre-save middleware to calculate points based on position and kills
matchResultSchema.pre('save', function(next) {
  if (this.isModified('stats.position') || this.isModified('stats.kills')) {
    // Calculate points based on position and kills
    this.stats.points = this.score;
  }
  next();
});

// Post-save middleware to update user stats
matchResultSchema.post('save', async function() {
  if (this.isVerified) {
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    
    if (!user) return;
    
    // Update user stats
    user.stats.totalKills += this.stats.kills;
    user.stats.totalPoints += this.stats.points;
    user.stats.totalTournaments += 1;
    
    if (this.rank === 1) {
      user.stats.totalWins += 1;
    }
    
    await user.save();
  }
});

// Static method to get tournament leaderboard
matchResultSchema.statics.getTournamentLeaderboard = function(tournamentId, limit = 100) {
  return this.find({ 
    tournament: tournamentId, 
    isVerified: true 
  })
  .populate('user', 'username profile.displayName profile.avatar gameIDs')
  .sort({ rank: 1, 'stats.kills': -1, 'stats.points': -1 })
  .limit(limit);
};

// Static method to get user match history
matchResultSchema.statics.getUserMatchHistory = function(userId, options = {}) {
  const {
    game = null,
    limit = 20,
    page = 1,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;
  
  const query = { user: userId, isVerified: true };
  
  if (game) {
    // Need to populate tournament to filter by game
    return this.find(query)
      .populate({
        path: 'tournament',
        match: { game: game },
        select: 'title game mode status schedule.tournamentStart'
      })
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
  }
  
  return this.find(query)
    .populate('tournament', 'title game mode status schedule.tournamentStart')
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get tournament statistics
matchResultSchema.statics.getTournamentStats = function(tournamentId) {
  return this.aggregate([
    { $match: { tournament: mongoose.Types.ObjectId(tournamentId), isVerified: true } },
    {
      $group: {
        _id: null,
        totalPlayers: { $sum: 1 },
        totalKills: { $sum: '$stats.kills' },
        totalDamage: { $sum: '$stats.damage' },
        avgKills: { $avg: '$stats.kills' },
        avgPosition: { $avg: '$stats.position' },
        totalPrize: { $sum: '$prize' },
        maxKills: { $max: '$stats.kills' },
        minPosition: { $min: '$stats.position' }
      }
    }
  ]);
};

// Instance method to verify result
matchResultSchema.methods.verify = async function(adminId) {
  this.isVerified = true;
  this.reportedBy = adminId;
  return await this.save();
};

// Instance method to calculate prize
matchResultSchema.methods.calculatePrize = function(prizeDistribution) {
  const prizeTier = prizeDistribution.find(tier => tier.rank === this.rank);
  if (prizeTier) {
    this.prize = prizeTier.amount;
  } else {
    this.prize = 0;
  }
  return this.prize;
};

// Index for performance
matchResultSchema.index({ tournament: 1, rank: 1 });
matchResultSchema.index({ user: 1, createdAt: -1 });
matchResultSchema.index({ tournament: 1, isVerified: 1 });
matchResultSchema.index({ 'stats.kills': -1 });
matchResultSchema.index({ 'stats.points': -1 });

const MatchResult = mongoose.model('MatchResult', matchResultSchema);

module.exports = MatchResult;
