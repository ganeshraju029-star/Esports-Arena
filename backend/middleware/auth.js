const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');

// Sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Sign refresh token
const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

// Create and send token
const createSendToken = (user, statusCode, res, refreshToken = null) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
};

// Protect middleware - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4) Check if user is banned
    if (currentUser.isBanned) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been banned. Contact support for assistance.',
      });
    }

    // 5) Check if user changed password after the token was issued
    // (This would require adding passwordChangedAt field to User schema)

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.',
      });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired! Please log in again.',
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong with authentication.',
    });
  }
};

// Refresh token middleware
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'fail',
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = await promisify(jwt.verify)(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // Check if refresh token is stored in user's refresh tokens
    const tokenExists = currentUser.refreshTokens.some(
      (token) => token.token === refreshToken
    );

    if (!tokenExists) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const newAccessToken = signToken(currentUser._id);
    const newRefreshToken = signRefreshToken(currentUser._id);

    // Update refresh tokens in database
    currentUser.refreshTokens = currentUser.refreshTokens.filter(
      (token) => token.token !== refreshToken
    );
    currentUser.refreshTokens.push({ token: newRefreshToken });
    await currentUser.save();

    res.status(200).json({
      status: 'success',
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid refresh token',
    });
  }
};

// Role-based access control
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (token) {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser && !currentUser.isBanned) {
        req.user = currentUser;
      }
    }
    next();
  } catch (err) {
    // Continue without authentication
    next();
  }
};

// Logout middleware
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

module.exports = {
  signToken,
  signRefreshToken,
  createSendToken,
  protect,
  restrictTo,
  optionalAuth,
  logout,
  refresh,
};
