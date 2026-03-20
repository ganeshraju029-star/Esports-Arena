const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 3 // Maximum 3 files
  }
});

// Upload profile picture
router.post('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No file uploaded'
      });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    // Delete old avatar if exists
    if (user.profile.avatar && user.profile.avatar !== 'default-avatar.jpg') {
      const oldAvatarPath = path.join(__dirname, '../uploads', path.basename(user.profile.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user profile with new avatar URL
    user.profile.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl: user.profile.avatar
      }
    });

    winston.info(`Avatar uploaded for user ${user.username}: ${req.file.filename}`);

  } catch (error) {
    winston.error('Upload avatar error:', error);
    next(error);
  }
});

// Upload match result screenshot
router.post('/match-screenshot', protect, upload.array('screenshots', 3), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'No files uploaded'
      });
    }

    const { tournamentId, userId } = req.body;

    if (!tournamentId || !userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tournament ID and User ID are required'
      });
    }

    // Create URLs for uploaded files
    const screenshotUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      status: 'success',
      message: 'Screenshots uploaded successfully',
      data: {
        screenshotUrls,
        tournamentId,
        userId
      }
    });

    winston.info(`Match screenshots uploaded: ${screenshotUrls.length} files`);

  } catch (error) {
    winston.error('Upload match screenshots error:', error);
    next(error);
  }
});

// Upload tournament thumbnail
router.post('/tournament-thumbnail', protect, upload.single('thumbnail'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No file uploaded'
      });
    }

    const { tournamentId } = req.body;

    if (!tournamentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tournament ID is required'
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only admins can upload tournament thumbnails'
      });
    }

    const Tournament = require('../models/Tournament');
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tournament not found'
      });
    }

    // Delete old thumbnail if exists
    if (tournament.thumbnail) {
      const oldThumbnailPath = path.join(__dirname, '../uploads', path.basename(tournament.thumbnail));
      if (fs.existsSync(oldThumbnailPath)) {
        fs.unlinkSync(oldThumbnailPath);
      }
    }

    // Update tournament with new thumbnail URL
    tournament.thumbnail = `/uploads/${req.file.filename}`;
    await tournament.save();

    res.status(200).json({
      status: 'success',
      message: 'Tournament thumbnail uploaded successfully',
      data: {
        thumbnailUrl: tournament.thumbnail
      }
    });

    winston.info(`Tournament thumbnail uploaded: ${req.file.filename}`);

  } catch (error) {
    winston.error('Upload tournament thumbnail error:', error);
    next(error);
  }
});

// Serve uploaded files
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'File not found'
    });
  }
});

// Delete uploaded file
router.delete('/:filename', protect, async (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'fail',
        message: 'File not found'
      });
    }

    // Check if user owns this file or is admin
    // This is a simple check - in production, you'd track file ownership in database
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only admins can delete files'
      });
    }

    fs.unlinkSync(filePath);

    res.status(200).json({
      status: 'success',
      message: 'File deleted successfully'
    });

    winston.info(`File deleted: ${filename}`);

  } catch (error) {
    winston.error('Delete file error:', error);
    next(error);
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        message: 'File size too large. Maximum size is 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'fail',
        message: 'Too many files. Maximum 3 files allowed'
      });
    }
  }

  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      status: 'fail',
      message: 'Only image files are allowed'
    });
  }

  next(error);
});

module.exports = router;
