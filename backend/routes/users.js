const express = require('express');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const MatchResult = require('../models/MatchResult');
const Transaction = require('../models/Transaction');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, updateProfileSchema } = require('../middleware/validation');
const winston = require('winston');

const router = express.Router();

// Get current user profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-refreshTokens')
      .populate('matchHistory', 'tournament stats.rank stats.kills stats.points createdAt')
      .populate('transactions', 'type amount status createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });

  } catch (error) {
    winston.error('Get profile error:', error);
    next(error);
  }
});

// Update user profile
router.patch('/profile', protect, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const { username, gameIDs, profile } = req.body;

    // Check if username is being changed and if it's already taken
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: 'Username already taken'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, gameIDs, profile },
      { new: true, runValidators: true }
    ).select('-refreshTokens');

    winston.info(`User profile updated: ${updatedUser.username}`);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    winston.error('Update profile error:', error);
    next(error);
  }
});

// Get user statistics
router.get('/stats', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('stats wallet');

    // Get recent match performance
    const recentMatches = await MatchResult.find({ user: req.user._id, isVerified: true })
      .populate('tournament', 'title game mode')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get tournament participation
    const tournamentStats = await Tournament.getUserTournaments(req.user._id);

    // Get transaction statistics
    const transactionStats = await Transaction.getStatistics(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        stats: user.stats,
        wallet: user.wallet,
        recentMatches,
        tournamentStats: {
          total: tournamentStats.length,
          upcoming: tournamentStats.filter(t => t.status === 'upcoming').length,
          completed: tournamentStats.filter(t => t.status === 'completed').length
        },
        transactionStats: transactionStats || []
      }
    });

  } catch (error) {
    winston.error('Get user stats error:', error);
    next(error);
  }
});

// Get user's tournaments
router.get('/tournaments', protect, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const tournaments = await Tournament.getUserTournaments(req.user._id, status)
      .populate('createdBy', 'username profile.displayName')
      .populate('joinedPlayers.user', 'username profile.displayName profile.avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: tournaments.length,
      data: {
        tournaments
      }
    });

  } catch (error) {
    winston.error('Get user tournaments error:', error);
    next(error);
  }
});

// Get user's match history
router.get('/matches', protect, async (req, res, next) => {
  try {
    const { game, page = 1, limit = 20 } = req.query;

    const matches = await MatchResult.getUserMatchHistory(req.user._id, {
      game,
      limit: parseInt(limit),
      page: parseInt(page)
    });

    const total = await MatchResult.countDocuments({ 
      user: req.user._id, 
      isVerified: true 
    });

    res.status(200).json({
      status: 'success',
      results: matches.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: {
        matches
      }
    });

  } catch (error) {
    winston.error('Get user matches error:', error);
    next(error);
  }
});

// Get user's transactions
router.get('/transactions', protect, async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 50 } = req.query;

    const transactions = await Transaction.getUserTransactions(req.user._id, {
      type,
      status,
      limit: parseInt(limit),
      page: parseInt(page)
    });

    const total = await Transaction.countDocuments({ user: req.user._id });

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: {
        transactions
      }
    });

  } catch (error) {
    winston.error('Get user transactions error:', error);
    next(error);
  }
});

// Get global leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { game, limit = 100 } = req.query;

    const leaderboard = await User.getLeaderboard(game, parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: leaderboard.length,
      data: {
        leaderboard
      }
    });

  } catch (error) {
    winston.error('Get leaderboard error:', error);
    next(error);
  }
});

// Search users (public)
router.get('/search', async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        status: 'fail',
        message: 'Search query is required'
      });
    }

    const users = await User.find({
      $and: [
        { isBanned: false },
        { $or: [
          { username: { $regex: q, $options: 'i' } },
          { 'profile.displayName': { $regex: q, $options: 'i' } }
        ]}
      ]
    })
      .select('username profile.displayName profile.avatar stats')
      .sort({ 'stats.globalRank': 1, 'stats.totalWins': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });

  } catch (error) {
    winston.error('Search users error:', error);
    next(error);
  }
});

// Get public user profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username profile.displayName profile.avatar stats gameIDs createdAt')
      .populate('matchHistory', 'tournament stats.rank stats.kills stats.points createdAt', null, { 
        sort: { createdAt: -1 }, 
        limit: 10 
      });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    if (user.isBanned) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });

  } catch (error) {
    winston.error('Get public user profile error:', error);
    next(error);
  }
});

// Report user (anti-cheat placeholder)
router.post('/:id/report', protect, async (req, res, next) => {
  try {
    const { reason, description } = req.body;

    if (!reason) {
      return res.status(400).json({
        status: 'fail',
        message: 'Reason is required'
      });
    }

    const reportedUser = await User.findById(req.params.id);

    if (!reportedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // TODO: Implement actual reporting system
    // For now, just log the report
    winston.warn(`User ${req.user.username} reported ${reportedUser.username} for: ${reason}`);

    res.status(200).json({
      status: 'success',
      message: 'Report submitted successfully'
    });

  } catch (error) {
    winston.error('Report user error:', error);
    next(error);
  }
});

// Upload profile picture (placeholder - would need file upload middleware)
router.post('/upload-avatar', protect, async (req, res, next) => {
  try {
    // TODO: Implement file upload logic
    res.status(200).json({
      status: 'success',
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl: 'https://example.com/avatar.jpg'
      }
    });

  } catch (error) {
    winston.error('Upload avatar error:', error);
    next(error);
  }
});

module.exports = router;
