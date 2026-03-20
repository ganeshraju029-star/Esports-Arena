const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  tournament: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tournament',
    default: null
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['deposit', 'withdrawal', 'entry_fee', 'prize', 'refund'],
      message: 'Transaction type must be deposit, withdrawal, entry_fee, prize, or refund'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'processing'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'wallet', 'bank_transfer'],
    required: true
  },
  paymentId: {
    type: String, // Razorpay payment ID, Stripe charge ID, etc.
    required: true,
    unique: true,
    sparse: true
  },
  orderId: {
    type: String, // Razorpay order ID
    default: null
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed, // Store full response from payment gateway
    default: null
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Additional metadata
    default: {}
  },
  processedAt: {
    type: Date,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  },
  refundId: {
    type: String, // For refund transactions
    default: null
  },
  webhookProcessed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for transaction duration
transactionSchema.virtual('duration').get(function() {
  if (this.processedAt) {
    return this.processedAt.getTime() - this.createdAt.getTime();
  }
  return Date.now() - this.createdAt.getTime();
});

// Pre-save middleware to validate transaction logic
transactionSchema.pre('save', async function(next) {
  // Validate that withdrawal amounts don't exceed user balance
  if (this.type === 'withdrawal' && this.status === 'completed') {
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    if (!user) {
      return next(new Error('User not found'));
    }
    if (user.wallet.balance < this.amount) {
      return next(new Error('Insufficient balance for withdrawal'));
    }
  }
  
  // Set processedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  
  next();
});

// Post-save middleware to update user wallet
transactionSchema.post('save', async function() {
  if (this.isModified('status') && this.status === 'completed') {
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    
    if (!user) return;
    
    switch (this.type) {
      case 'deposit':
        user.wallet.balance += this.amount;
        user.wallet.totalEarnings += this.amount;
        break;
      case 'withdrawal':
        user.wallet.balance -= this.amount;
        user.wallet.totalSpent += this.amount;
        break;
      case 'entry_fee':
        user.wallet.balance -= this.amount;
        user.wallet.totalSpent += this.amount;
        break;
      case 'prize':
        user.wallet.balance += this.amount;
        user.wallet.totalEarnings += this.amount;
        break;
      case 'refund':
        user.wallet.balance += this.amount;
        break;
    }
    
    await user.save();
  }
});

// Static method to create deposit transaction
transactionSchema.statics.createDeposit = async function(userId, amount, paymentId, orderId, gatewayResponse) {
  return await this.create({
    user: userId,
    type: 'deposit',
    amount: amount,
    paymentMethod: 'razorpay',
    paymentId: paymentId,
    orderId: orderId,
    gatewayResponse: gatewayResponse,
    description: `Wallet deposit of ₹${amount}`,
    status: 'completed'
  });
};

// Static method to create entry fee transaction
transactionSchema.statics.createEntryFee = async function(userId, tournamentId, amount, paymentId, orderId) {
  return await this.create({
    user: userId,
    tournament: tournamentId,
    type: 'entry_fee',
    amount: amount,
    paymentMethod: 'razorpay',
    paymentId: paymentId,
    orderId: orderId,
    description: `Entry fee for tournament`,
    status: 'pending'
  });
};

// Static method to create prize transaction
transactionSchema.statics.createPrize = async function(userId, tournamentId, amount, rank) {
  return await this.create({
    user: userId,
    tournament: tournamentId,
    type: 'prize',
    amount: amount,
    paymentMethod: 'wallet',
    paymentId: `prize_${tournamentId}_${userId}_${Date.now()}`,
    description: `Prize for rank ${rank} in tournament`,
    status: 'completed',
    metadata: { rank: rank }
  });
};

// Static method to get user transactions
transactionSchema.statics.getUserTransactions = function(userId, options = {}) {
  const {
    type = null,
    status = null,
    limit = 50,
    page = 1,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;
  
  const query = { user: userId };
  
  if (type) query.type = type;
  if (status) query.status = status;
  
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  return this.find(query)
    .populate('tournament', 'title game mode')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get transaction statistics
transactionSchema.statics.getStatistics = function(userId, startDate = null, endDate = null) {
  const matchStage = { user: userId };
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Index for performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ paymentId: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ tournament: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
