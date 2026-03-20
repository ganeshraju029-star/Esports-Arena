const express = require('express');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const MatchResult = require('../models/MatchResult');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');
const { validate, createTournamentSchema, updateTournamentSchema } = require('../middleware/validation');
const winston = require('winston');

const router = express.Router();

// Get all tournaments (public access)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      game,
      mode,
      status,
      difficulty,
      page = 1,
      limit = 10,
      sort = 'tournamentStart',
      order = 'asc',
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (game) query.game = game;
    if (mode) query.mode = mode;
    if (status) query.status = status;
    if (difficulty) query.difficulty = difficulty;
    
    // Only show tournaments that are not cancelled
    if (!status) {
      query.status = { $ne: 'cancelled' };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    const sortField = sort === 'tournamentStart' ? 'schedule.tournamentStart' : sort;
    sortOptions[sortField] = order === 'desc' ? -1 : 1;

    // Execute query
    const tournaments = await Tournament.find(query)
      .populate('createdBy', 'username profile.displayName')
      .populate('joinedPlayers.user', 'username profile.displayName profile.avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Tournament.countDocuments(query);

    // Add user-specific info if authenticated
    if (req.user) {
      tournaments.forEach(tournament => {
        tournament.isJoined = tournament.joinedPlayers.some(
          player => player.user._id.toString() === req.user._id.toString()
        );
        tournament.canJoin = tournament.canUserJoin(req.user);
      });
    }

    res.status(200).json({
      status: 'success',
      results: tournaments.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: {
        tournaments
      }
    });

  } catch (error) {
    winston.error('Get tournaments error:', error);
    next(error);
  }
});

// Get featured tournaments
router.get('/featured', optionalAuth, async (req, res, next) => {
  try {
    const tournaments = await Tournament.find({
      isFeatured: true,
      status: { $in: ['upcoming', 'registration', 'full'] },
      'schedule.registrationEnd': { $gt: new Date() }
    })
      .populate('createdBy', 'username profile.displayName')
      .populate('joinedPlayers.user', 'username profile.displayName profile.avatar')
      .sort({ 'schedule.tournamentStart': 1 })
      .limit(5);

    // Add user-specific info if authenticated
    if (req.user) {
      tournaments.forEach(tournament => {
        tournament.isJoined = tournament.joinedPlayers.some(
          player => player.user._id.toString() === req.user._id.toString()
        );
        tournament.canJoin = tournament.canUserJoin(req.user);
      });
    }

    res.status(200).json({
      status: 'success',
      results: tournaments.length,
      data: {
        tournaments
      }
    });

  } catch (error) {
    winston.error('Get featured tournaments error:', error);
    next(error);
  }
});

// Get single tournament
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'username profile.displayName')
      .populate('joinedPlayers.user', 'username profile.displayName profile.avatar gameIDs')
      .populate('waitlistedPlayers.user', 'username profile.displayName profile.avatar');

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    // Add user-specific info if authenticated
    if (req.user) {
      tournament.isJoined = tournament.joinedPlayers.some(
        player => player.user._id.toString() === req.user._id.toString()
      );
      tournament.canJoin = tournament.canUserJoin(req.user);
    }

    res.status(200).json({
      status: 'success',
      data: {
        tournament
      }
    });

  } catch (error) {
    winston.error('Get tournament error:', error);
    next(error);
  }
});

// Create tournament (admin only)
router.post('/', protect, restrictTo('admin'), validate(createTournamentSchema), async (req, res, next) => {
  try {
    const tournamentData = {
      ...req.body,
      createdBy: req.user._id
    };

    const tournament = await Tournament.create(tournamentData);

    // Populate creator info
    await tournament.populate('createdBy', 'username profile.displayName');

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('tournamentCreated', {
      tournament: {
        id: tournament._id,
        title: tournament.title,
        game: tournament.game,
        mode: tournament.mode,
        entryFee: tournament.entryFee,
        prizePool: tournament.prizePool,
        maxPlayers: tournament.maxPlayers,
        schedule: tournament.schedule
      }
    });

    winston.info(`Tournament created: ${tournament.title} by ${req.user.username}`);

    res.status(201).json({
      status: 'success',
      data: {
        tournament
      }
    });

  } catch (error) {
    winston.error('Create tournament error:', error);
    next(error);
  }
});

// Update tournament (admin only)
router.patch('/:id', protect, restrictTo('admin'), validate(updateTournamentSchema), async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    // Check if admin created this tournament or is super admin
    if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update tournaments you created'
      });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username profile.displayName');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`tournament-${req.params.id}`).emit('tournamentUpdated', {
      tournament: updatedTournament
    });

    winston.info(`Tournament updated: ${updatedTournament.title} by ${req.user.username}`);

    res.status(200).json({
      status: 'success',
      data: {
        tournament: updatedTournament
      }
    });

  } catch (error) {
    winston.error('Update tournament error:', error);
    next(error);
  }
});

// Join tournament (player only)
router.post('/:id/join', protect, restrictTo('player'), async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    // Check if user can join
    if (!tournament.canUserJoin(req.user)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot join tournament. Check requirements and availability.'
      });
    }

    // Check if user has sufficient balance for entry fee
    if (tournament.entryFee > 0 && req.user.wallet.balance < tournament.entryFee) {
      return res.status(400).json({
        status: 'fail',
        message: 'Insufficient wallet balance to join tournament'
      });
    }

    // Add player to tournament
    await tournament.addPlayer(req.user._id);

    // Populate updated tournament
    const updatedTournament = await Tournament.findById(req.params.id)
      .populate('joinedPlayers.user', 'username profile.displayName profile.avatar');

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`tournament-${req.params.id}`).emit('playerJoined', {
      tournamentId: req.params.id,
      player: {
        id: req.user._id,
        username: req.user.username,
        displayName: req.user.profile.displayName
      },
      availableSlots: tournament.availableSlots
    });

    winston.info(`User ${req.user.username} joined tournament ${tournament.title}`);

    res.status(200).json({
      status: 'success',
      message: 'Successfully joined tournament',
      data: {
        tournament: updatedTournament
      }
    });

  } catch (error) {
    winston.error('Join tournament error:', error);
    next(error);
  }
});

// Leave tournament (player only)
router.post('/:id/leave', protect, restrictTo('player'), async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    // Check if user is joined
    const playerIndex = tournament.joinedPlayers.findIndex(
      player => player.user.toString() === req.user._id.toString()
    );

    if (playerIndex === -1) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are not joined in this tournament'
      });
    }

    // Remove player from joined players
    tournament.joinedPlayers.splice(playerIndex, 1);

    // Move waitlisted player to joined if available
    if (tournament.waitlistedPlayers.length > 0) {
      const waitlistedPlayer = tournament.waitlistedPlayers.shift();
      tournament.joinedPlayers.push({
        user: waitlistedPlayer.user,
        joinedAt: new Date(),
        paymentStatus: 'pending'
      });

      // Notify waitlisted player
      const io = req.app.get('io');
      io.emit('movedFromWaitlist', {
        tournamentId: tournament._id,
        userId: waitlistedPlayer.user
      });
    }

    await tournament.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`tournament-${req.params.id}`).emit('playerLeft', {
      tournamentId: req.params.id,
      player: {
        id: req.user._id,
        username: req.user.username
      },
      availableSlots: tournament.availableSlots
    });

    winston.info(`User ${req.user.username} left tournament ${tournament.title}`);

    res.status(200).json({
      status: 'success',
      message: 'Successfully left tournament'
    });

  } catch (error) {
    winston.error('Leave tournament error:', error);
    next(error);
  }
});

// Get tournament leaderboard
router.get('/:id/leaderboard', async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    // Get match results for this tournament
    const leaderboard = await MatchResult.getTournamentLeaderboard(req.params.id);

    res.status(200).json({
      status: 'success',
      results: leaderboard.length,
      data: {
        leaderboard
      }
    });

  } catch (error) {
    winston.error('Get tournament leaderboard error:', error);
    next(error);
  }
});

// Get tournament statistics
router.get('/:id/stats', async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    const stats = await MatchResult.getTournamentStats(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tournament: {
          title: tournament.title,
          game: tournament.game,
          mode: tournament.mode,
          maxPlayers: tournament.maxPlayers,
          joinedPlayers: tournament.joinedPlayers.length,
          status: tournament.status,
          prizePool: tournament.prizePool
        },
        stats: stats[0] || {
          totalPlayers: 0,
          totalKills: 0,
          totalDamage: 0,
          avgKills: 0,
          avgPosition: 0,
          totalPrize: 0,
          maxKills: 0,
          minPosition: 0
        }
      }
    });

  } catch (error) {
    winston.error('Get tournament stats error:', error);
    next(error);
  }
});

// Delete tournament (admin only)
router.delete('/:id', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    // Check if admin created this tournament
    if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete tournaments you created'
      });
    }

    // Check if tournament has started
    if (tournament.status === 'live' || tournament.status === 'completed') {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot delete tournament that has started or completed'
      });
    }

    await Tournament.findByIdAndDelete(req.params.id);

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('tournamentDeleted', {
      tournamentId: req.params.id
    });

    winston.info(`Tournament deleted: ${tournament.title} by ${req.user.username}`);

    res.status(204).json({
      status: 'success',
      data: null
    });

  } catch (error) {
    winston.error('Delete tournament error:', error);
    next(error);
  }
});

module.exports = router;
