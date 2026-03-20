const express = require('express');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Transaction = require('../models/Transaction');
const MatchResult = require('../models/MatchResult');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, matchResultSchema } = require('../middleware/validation');
const winston = require('winston');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    // Get various statistics
    const [
      totalUsers,
      activeUsers,
      totalTournaments,
      activeTournaments,
      totalTransactions,
      totalRevenue,
      pendingWithdrawals
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Tournament.countDocuments(),
      Tournament.countDocuments({ status: { $in: ['upcoming', 'registration', 'live'] } }),
      Transaction.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'completed', type: 'deposit' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.countDocuments({ type: 'withdrawal', status: 'pending' })
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    const recentTournaments = await Tournament.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'username')
      .select('title game mode status maxPlayers joinedPlayers createdAt');

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username')
      .select('type amount status createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalTournaments,
          activeTournaments,
          totalTransactions,
          totalRevenue: totalRevenue[0]?.total || 0,
          pendingWithdrawals
        },
        recentActivity: {
          users: recentUsers,
          tournaments: recentTournaments,
          transactions: recentTransactions
        }
      }
    });

  } catch (error) {
    winston.error('Admin dashboard error:', error);
    next(error);
  }
});

// User management
router.get('/users', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isBanned,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (role) query.role = role;
    if (isBanned !== undefined) query.isBanned = isBanned === 'true';
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-refreshTokens')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: {
        users
      }
    });

  } catch (error) {
    winston.error('Get users error:', error);
    next(error);
  }
});

// Ban/Unban user
router.patch('/users/:id/ban', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { isBanned, banReason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Prevent banning other admins (unless super admin)
    if (user.role === 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Cannot ban other admins'
      });
    }

    user.isBanned = isBanned;
    if (isBanned && banReason) {
      user.banReason = banReason;
    } else if (!isBanned) {
      user.banReason = null;
    }

    await user.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('userBanned', {
      userId: user._id,
      isBanned,
      reason: banReason
    });

    winston.info(`User ${user.username} ${isBanned ? 'banned' : 'unbanned'} by ${req.user.username}`);

    res.status(200).json({
      status: 'success',
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      data: {
        user
      }
    });

  } catch (error) {
    winston.error('Ban user error:', error);
    next(error);
  }
});

// Update user role
router.patch('/users/:id/role', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['player', 'admin'].includes(role)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Only super admin can change roles
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only super admin can change user roles'
      });
    }

    user.role = role;
    await user.save();

    winston.info(`User ${user.username} role changed to ${role} by ${req.user.username}`);

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      data: {
        user
      }
    });

  } catch (error) {
    winston.error('Update user role error:', error);
    next(error);
  }
});

// Tournament management
router.get('/tournaments', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      game,
      createdBy,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (game) query.game = game;
    if (createdBy) query.createdBy = createdBy;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tournaments = await Tournament.find(query)
      .populate('createdBy', 'username email')
      .populate('joinedPlayers.user', 'username')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Tournament.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: tournaments.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: {
        tournaments
      }
    });

  } catch (error) {
    winston.error('Get admin tournaments error:', error);
    next(error);
  }
});

// Add match results
router.post('/tournaments/:id/results', protect, restrictTo('admin'), validate(matchResultSchema), async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    if (tournament.status !== 'completed') {
      return res.status(400).json({
        status: 'fail',
        message: 'Tournament must be completed to add results'
      });
    }

    const { user, stats, rank, notes } = req.body;

    // Check if result already exists
    const existingResult = await MatchResult.findOne({
      tournament: req.params.id,
      user: user
    });

    if (existingResult) {
      return res.status(400).json({
        status: 'fail',
        message: 'Match result already exists for this user'
      });
    }

    // Calculate prize based on rank
    const prize = req.body.prize || 0;
    if (prize > 0) {
      // Create prize transaction
      const Transaction = require('../models/Transaction');
      await Transaction.createPrize(user, req.params.id, prize, rank);
    }

    // Create match result
    const matchResult = await MatchResult.create({
      tournament: req.params.id,
      user,
      stats,
      rank,
      prize,
      notes,
      reportedBy: req.user._id,
      isVerified: true
    });

    // Update tournament winners
    if (prize > 0) {
      tournament.winners.push({
        rank,
        user,
        prize,
        matchResults: stats
      });
      await tournament.save();
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`tournament-${req.params.id}`).emit('matchResultAdded', {
      tournamentId: req.params.id,
      result: matchResult
    });

    winston.info(`Match result added for tournament ${tournament.title}: Rank ${rank}`);

    res.status(201).json({
      status: 'success',
      message: 'Match result added successfully',
      data: {
        matchResult
      }
    });

  } catch (error) {
    winston.error('Add match result error:', error);
    next(error);
  }
});

// Get system logs (placeholder)
router.get('/logs', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    // TODO: Implement actual log reading
    res.status(200).json({
      status: 'success',
      message: 'Log viewing feature coming soon',
      data: {
        logs: []
      }
    });

  } catch (error) {
    winston.error('Get logs error:', error);
    next(error);
  }
});

// System health check
router.get('/health', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const health = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      },
      database: {
        status: 'connected', // Would need actual DB health check
        collections: {
          users: await User.countDocuments(),
          tournaments: await Tournament.countDocuments(),
          transactions: await Transaction.countDocuments(),
          matchResults: await MatchResult.countDocuments()
        }
      },
      payment: {
        razorpay: process.env.RAZORPAY_KEY_ID ? 'configured' : 'not configured'
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: {
        health
      }
    });

  } catch (error) {
    winston.error('System health check error:', error);
    next(error);
  }
});

// Get reports (anti-cheat placeholder)
router.get('/reports', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    // TODO: Implement actual reporting system
    res.status(200).json({
      status: 'success',
      message: 'Report system coming soon',
      data: {
        reports: []
      }
    });

  } catch (error) {
    winston.error('Get reports error:', error);
    next(error);
  }
});

// Analytics and insights
router.get('/analytics', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;
    
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User growth
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Tournament statistics
    const tournamentStats = await Tournament.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          totalRevenue: { $sum: "$prizePool" },
          totalPlayers: { $sum: { $size: "$joinedPlayers" } }
        }
      }
    ]);

    // Revenue breakdown
    const revenueBreakdown = await Transaction.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
      {
        $group: {
          _id: "$type",
          amount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        userGrowth,
        tournamentStats: tournamentStats[0] || { total: 0, completed: 0, totalRevenue: 0, totalPlayers: 0 },
        revenueBreakdown
      }
    });

  } catch (error) {
    winston.error('Get analytics error:', error);
    next(error);
  }
});

module.exports = router;
