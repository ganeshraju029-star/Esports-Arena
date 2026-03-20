const express = require('express');
const User = require('../models/User');
const { createSendToken, signRefreshToken } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const winston = require('winston');

const router = express.Router();

// Register new user
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, role, gameIDs } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'player',
      gameIDs: gameIDs || {}
    });

    // Generate refresh token
    const refreshToken = signRefreshToken(newUser._id);
    newUser.refreshTokens.push({ token: refreshToken });
    await newUser.save();

    // Send response with tokens
    createSendToken(newUser, 201, res, refreshToken);

    // Log registration
    winston.info(`New user registered: ${email} (${username})`);

  } catch (error) {
    winston.error('Registration error:', error);
    next(error);
  }
});

// Login user
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(401).json({
        status: 'fail',
        message: `Your account has been banned. Reason: ${user.banReason || 'Contact support for assistance.'}`
      });
    }

    // Generate refresh token
    const refreshToken = signRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send response with tokens
    createSendToken(user, 200, res, refreshToken);

    // Log login
    winston.info(`User logged in: ${email}`);

  } catch (error) {
    winston.error('Login error:', error);
    next(error);
  }
});

// Refresh token
router.post('/refresh', require('../middleware/auth').refresh);

// Logout
router.post('/logout', require('../middleware/auth').logout);

// Forgot password (placeholder - would need email service)
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email address'
      });
    }

    // TODO: Generate reset token and send email
    // For now, just return success message
    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    winston.error('Forgot password error:', error);
    next(error);
  }
});

// Reset password (placeholder)
router.patch('/reset-password/:token', async (req, res, next) => {
  try {
    // TODO: Implement password reset logic
    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    });

  } catch (error) {
    winston.error('Reset password error:', error);
    next(error);
  }
});

// Verify email (placeholder)
router.patch('/verify-email/:token', async (req, res, next) => {
  try {
    // TODO: Implement email verification logic
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });

  } catch (error) {
    winston.error('Email verification error:', error);
    next(error);
  }
});

module.exports = router;
