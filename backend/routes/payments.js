const express = require('express');
const razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, paymentSchema, withdrawalSchema } = require('../middleware/validation');
const winston = require('winston');

const router = express.Router();

// Initialize Razorpay
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order for wallet deposit
router.post('/create-order', protect, validate(paymentSchema), async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId: req.user._id.toString(),
        type: 'wallet_deposit'
      }
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });

    winston.info(`Payment order created: ${order.id} for user ${req.user.username}`);

  } catch (error) {
    winston.error('Create payment order error:', error);
    next(error);
  }
});

// Create order for tournament entry fee
router.post('/tournament-entry/:tournamentId', protect, async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.tournamentId);

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

    // Check if already joined
    const alreadyJoined = tournament.joinedPlayers.some(
      player => player.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        status: 'fail',
        message: 'Already joined this tournament'
      });
    }

    const options = {
      amount: tournament.entryFee * 100, // Convert to paise
      currency: 'INR',
      receipt: `tournament_${tournament._id}_${req.user._id}`,
      payment_capture: 1,
      notes: {
        userId: req.user._id.toString(),
        tournamentId: tournament._id.toString(),
        type: 'tournament_entry'
      }
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        tournamentId: tournament._id,
        entryFee: tournament.entryFee,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });

    winston.info(`Tournament entry order created: ${order.id} for tournament ${tournament.title}`);

  } catch (error) {
    winston.error('Create tournament entry order error:', error);
    next(error);
  }
});

// Verify payment and handle webhook
router.post('/verify', protect, async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type = 'wallet_deposit',
      tournamentId = null
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing payment verification parameters'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSignature) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid payment signature'
      });
    }

    // Fetch payment details
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return res.status(400).json({
        status: 'fail',
        message: 'Payment not successful'
      });
    }

    // Create transaction record
    let transaction;
    const amount = payment.amount / 100; // Convert back to rupees

    if (type === 'wallet_deposit') {
      transaction = await Transaction.createDeposit(
        req.user._id,
        amount,
        razorpay_payment_id,
        razorpay_order_id,
        payment
      );

      // Emit real-time notification
      const io = req.app.get('io');
      io.emit('walletUpdated', {
        userId: req.user._id,
        balance: req.user.wallet.balance + amount,
        transaction: {
          type: 'deposit',
          amount: amount,
          createdAt: new Date()
        }
      });

      winston.info(`Wallet deposit successful: ₹${amount} for user ${req.user.username}`);

    } else if (type === 'tournament_entry' && tournamentId) {
      // Check if tournament still exists and user can join
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({
          status: 'fail',
          message: 'Tournament not found'
        });
      }

      if (!tournament.canUserJoin(req.user)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Cannot join tournament. Check requirements and availability.'
        });
      }

      transaction = await Transaction.createEntryFee(
        req.user._id,
        tournamentId,
        amount,
        razorpay_payment_id,
        razorpay_order_id
      );

      // Add player to tournament
      await tournament.addPlayer(req.user._id, razorpay_payment_id);

      // Emit real-time notifications
      const io = req.app.get('io');
      io.to(`tournament-${tournamentId}`).emit('playerJoined', {
        tournamentId,
        player: {
          id: req.user._id,
          username: req.user.username,
          displayName: req.user.profile.displayName
        },
        availableSlots: tournament.availableSlots
      });

      winston.info(`Tournament entry payment successful: ₹${amount} for ${tournament.title} by ${req.user.username}`);
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
      data: {
        transaction,
        payment: {
          id: payment.id,
          amount: payment.amount / 100,
          status: payment.status,
          method: payment.method
        }
      }
    });

  } catch (error) {
    winston.error('Payment verification error:', error);
    next(error);
  }
});

// Razorpay webhook handler
router.post('/webhook', async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing webhook signature'
      });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    // Find existing transaction
    const transaction = await Transaction.findOne({
      paymentId: paymentEntity.id
    });

    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found'
      });
    }

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        if (transaction.status === 'pending') {
          transaction.status = 'completed';
          transaction.webhookProcessed = true;
          await transaction.save();

          winston.info(`Payment captured via webhook: ${paymentEntity.id}`);
        }
        break;

      case 'payment.failed':
        transaction.status = 'failed';
        transaction.failureReason = paymentEntity.error?.description || 'Payment failed';
        transaction.webhookProcessed = true;
        await transaction.save();

        winston.error(`Payment failed via webhook: ${paymentEntity.id} - ${transaction.failureReason}`);
        break;

      default:
        winston.info(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    winston.error('Webhook processing error:', error);
    next(error);
  }
});

// Get wallet balance
router.get('/wallet', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('wallet');

    res.status(200).json({
      status: 'success',
      data: {
        balance: user.wallet.balance,
        totalEarnings: user.wallet.totalEarnings,
        totalSpent: user.wallet.totalSpent
      }
    });

  } catch (error) {
    winston.error('Get wallet balance error:', error);
    next(error);
  }
});

// Request withdrawal
router.post('/withdraw', protect, validate(withdrawalSchema), async (req, res, next) => {
  try {
    const { amount, method, details } = req.body;

    const user = await User.findById(req.user._id);

    // Check if user has sufficient balance
    if (user.wallet.balance < amount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Insufficient balance for withdrawal'
      });
    }

    // Create withdrawal transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'withdrawal',
      amount: amount,
      paymentMethod: method,
      paymentId: `withdrawal_${Date.now()}`,
      description: `Withdrawal via ${method}`,
      status: 'pending',
      metadata: { details }
    });

    // Deduct amount from wallet (will be refunded if rejected)
    user.wallet.balance -= amount;
    await user.save();

    winston.info(`Withdrawal request: ₹${amount} via ${method} by ${req.user.username}`);

    res.status(201).json({
      status: 'success',
      message: 'Withdrawal request submitted successfully',
      data: {
        transaction
      }
    });

  } catch (error) {
    winston.error('Withdrawal request error:', error);
    next(error);
  }
});

// Get payment methods
router.get('/methods', async (req, res, next) => {
  try {
    const methods = [
      {
        id: 'razorpay',
        name: 'Razorpay',
        type: 'online',
        currencies: ['INR'],
        supported: true
      },
      {
        id: 'wallet',
        name: 'Wallet Balance',
        type: 'internal',
        currencies: ['INR'],
        supported: true
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        methods
      }
    });

  } catch (error) {
    winston.error('Get payment methods error:', error);
    next(error);
  }
});

// Admin: Get all transactions
router.get('/admin/transactions', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate('user', 'username email')
      .populate('tournament', 'title game')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments(query);

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
    winston.error('Get admin transactions error:', error);
    next(error);
  }
});

// Admin: Approve/Reject withdrawal
router.patch('/admin/withdrawal/:transactionId', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { status, reason } = req.body;

    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid status'
      });
    }

    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('user', 'username wallet');

    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found'
      });
    }

    if (transaction.type !== 'withdrawal') {
      return res.status(400).json({
        status: 'fail',
        message: 'Not a withdrawal transaction'
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({
        status: 'fail',
        message: 'Transaction already processed'
      });
    }

    transaction.status = status;
    transaction.processedAt = new Date();
    if (reason) transaction.failureReason = reason;

    await transaction.save();

    // If cancelled, refund amount to user wallet
    if (status === 'cancelled') {
      const user = await User.findById(transaction.user._id);
      user.wallet.balance += transaction.amount;
      await user.save();

      // Emit real-time notification
      const io = req.app.get('io');
      io.emit('withdrawalCancelled', {
        userId: transaction.user._id,
        amount: transaction.amount,
        reason: reason || 'Withdrawal cancelled'
      });
    }

    winston.info(`Withdrawal ${status}: ₹${transaction.amount} for ${transaction.user.username}`);

    res.status(200).json({
      status: 'success',
      message: `Withdrawal ${status} successfully`,
      data: {
        transaction
      }
    });

  } catch (error) {
    winston.error('Process withdrawal error:', error);
    next(error);
  }
});

module.exports = router;
