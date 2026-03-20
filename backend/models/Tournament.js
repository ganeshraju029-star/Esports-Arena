const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tournament title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  game: {
    type: String,
    required: [true, 'Game is required'],
    enum: {
      values: ['freefire', 'pubg'],
      message: 'Game must be either freefire or pubg'
    }
  },
  mode: {
    type: String,
    required: [true, 'Game mode is required'],
    enum: {
      values: ['solo', 'duo', 'squad'],
      message: 'Mode must be solo, duo, or squad'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Difficulty must be easy, medium, or hard'
    },
    default: 'medium'
  },
  levelRequirements: {
    minLevel: {
      type: Number,
      min: 1,
      max: 100,
      default: null
    },
    maxLevel: {
      type: Number,
      min: 1,
      max: 100,
      default: null
    },
    basedOn: {
      type: String,
      enum: ['freefire', 'pubg', 'any'],
      default: 'any'
    }
  },
  entryFee: {
    type: Number,
    required: [true, 'Entry fee is required'],
    min: [0, 'Entry fee cannot be negative']
  },
  prizePool: {
    type: Number,
    required: [true, 'Prize pool is required'],
    min: [0, 'Prize pool cannot be negative']
  },
  prizeDistribution: [{
    rank: {
      type: Number,
      required: true,
      min: 1
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  maxPlayers: {
    type: Number,
    required: [true, 'Maximum players is required'],
    min: [2, 'Minimum 2 players required'],
    max: [1000, 'Maximum 1000 players allowed']
  },
  joinedPlayers: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentId: {
      type: String,
      default: null
    }
  }],
  waitlistedPlayers: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'registration', 'full', 'live', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  schedule: {
    registrationStart: {
      type: Date,
      required: true
    },
    registrationEnd: {
      type: Date,
      required: true
    },
    tournamentStart: {
      type: Date,
      required: true
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 120
    }
  },
  roomDetails: {
    roomId: {
      type: String,
      trim: true,
      default: null
    },
    roomPassword: {
      type: String,
      trim: true,
      default: null
    },
    map: {
      type: String,
      enum: ['bermuda', 'purgatory', 'kalahari', 'alpine', 'neon', 'erangel', 'miramar', 'sanhok', 'vikendi'],
      default: null
    },
    server: {
      type: String,
      trim: true,
      default: null
    }
  },
  rules: {
    type: String,
    maxlength: [2000, 'Rules cannot exceed 2000 characters'],
    default: ''
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  thumbnail: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  winners: [{
    rank: {
      type: Number,
      required: true,
      min: 1
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    prize: {
      type: Number,
      required: true,
      min: 0
    },
    matchResults: {
      kills: {
        type: Number,
        default: 0,
        min: 0
      },
      position: {
        type: Number,
        required: true,
        min: 1
      },
      points: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  }],
  streamUrl: {
    type: String,
    default: null
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for available slots
tournamentSchema.virtual('availableSlots').get(function() {
  return this.maxPlayers - this.joinedPlayers.length;
});

// Virtual for total prize distributed
tournamentSchema.virtual('totalPrizeDistributed').get(function() {
  return this.winners.reduce((total, winner) => total + winner.prize, 0);
});

// Virtual for registration status
tournamentSchema.virtual('registrationStatus').get(function() {
  const now = new Date();
  if (now < this.schedule.registrationStart) return 'not_started';
  if (now > this.schedule.registrationEnd) return 'ended';
  if (this.joinedPlayers.length >= this.maxPlayers) return 'full';
  return 'open';
});

// Virtual for match results
tournamentSchema.virtual('matchResults', {
  ref: 'MatchResult',
  localField: '_id',
  foreignField: 'tournamentId'
});

// Pre-save middleware to validate dates
tournamentSchema.pre('save', function(next) {
  if (this.schedule.registrationEnd <= this.schedule.registrationStart) {
    return next(new Error('Registration end must be after registration start'));
  }
  if (this.schedule.tournamentStart <= this.schedule.registrationEnd) {
    return next(new Error('Tournament start must be after registration end'));
  }
  next();
});

// Pre-save middleware to set default prize distribution
tournamentSchema.pre('save', function(next) {
  if (this.isModified('prizePool') && (!this.prizeDistribution || this.prizeDistribution.length === 0)) {
    // Default prize distribution: 60% for 1st, 30% for 2nd, 10% for 3rd
    this.prizeDistribution = [
      { rank: 1, amount: Math.floor(this.prizePool * 0.6), percentage: 60 },
      { rank: 2, amount: Math.floor(this.prizePool * 0.3), percentage: 30 },
      { rank: 3, amount: Math.floor(this.prizePool * 0.1), percentage: 10 }
    ];
  }
  next();
});

// Instance method to check if user can join
tournamentSchema.methods.canUserJoin = function(user) {
  // Check if tournament is full
  if (this.joinedPlayers.length >= this.maxPlayers) return false;
  
  // Check if user is already joined
  const alreadyJoined = this.joinedPlayers.some(player => 
    player.user.toString() === user._id.toString()
  );
  if (alreadyJoined) return false;
  
  // Check if user is waitlisted
  const isWaitlisted = this.waitlistedPlayers.some(player => 
    player.user.toString() === user._id.toString()
  );
  if (isWaitlisted) return false;
  
  // Check level requirements
  if (this.levelRequirements.minLevel || this.levelRequirements.maxLevel) {
    const userLevel = user.getGameLevel(this.levelRequirements.basedOn);
    if (!userLevel) return false;
    
    if (this.levelRequirements.minLevel && userLevel < this.levelRequirements.minLevel) return false;
    if (this.levelRequirements.maxLevel && userLevel > this.levelRequirements.maxLevel) return false;
  }
  
  // Check if user has required game ID
  if (!user.hasGameID(this.game)) return false;
  
  return true;
};

// Instance method to add player
tournamentSchema.methods.addPlayer = function(userId, paymentId = null) {
  if (this.joinedPlayers.length < this.maxPlayers) {
    this.joinedPlayers.push({
      user: userId,
      paymentStatus: paymentId ? 'paid' : 'pending',
      paymentId: paymentId
    });
    
    // Update status if full
    if (this.joinedPlayers.length >= this.maxPlayers) {
      this.status = 'full';
    }
  } else {
    // Add to waitlist
    this.waitlistedPlayers.push({
      user: userId
    });
  }
  
  return this.save();
};

// Static method to get active tournaments
tournamentSchema.statics.getActiveTournaments = function(game = null) {
  const query = { 
    status: { $in: ['upcoming', 'registration', 'full'] },
    'schedule.registrationEnd': { $gt: new Date() }
  };
  
  if (game) {
    query.game = game;
  }
  
  return this.find(query).sort({ 'schedule.tournamentStart': 1 });
};

// Static method to get user tournaments
tournamentSchema.statics.getUserTournaments = function(userId, status = null) {
  const query = {
    $or: [
      { 'joinedPlayers.user': userId },
      { 'waitlistedPlayers.user': userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Index for performance
tournamentSchema.index({ game: 1, status: 1 });
tournamentSchema.index({ 'schedule.tournamentStart': 1 });
tournamentSchema.index({ 'schedule.registrationEnd': 1 });
tournamentSchema.index({ createdBy: 1 });
tournamentSchema.index({ 'joinedPlayers.user': 1 });
tournamentSchema.index({ isFeatured: 1, status: 1 });

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
