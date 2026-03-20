const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    }),
  role: Joi.string()
    .valid('player', 'admin')
    .default('player'),
  gameIDs: Joi.object({
    freeFire: Joi.string()
      .pattern(/^\d{9,12}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Free Fire ID must be 9-12 digits'
      }),
    pubg: Joi.string()
      .pattern(/^\d{9,12}$/)
      .optional()
      .messages({
        'string.pattern.base': 'PUBG ID must be 9-12 digits'
      }),
    freeFireLevel: Joi.number()
      .min(1)
      .max(100)
      .optional(),
    pubgLevel: Joi.number()
      .min(1)
      .max(100)
      .optional()
  }).optional()
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Tournament creation validation
const createTournamentSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Tournament title is required'
    }),
  game: Joi.string()
    .valid('freefire', 'pubg')
    .required()
    .messages({
      'any.only': 'Game must be either freefire or pubg',
      'any.required': 'Game is required'
    }),
  mode: Joi.string()
    .valid('solo', 'duo', 'squad')
    .required()
    .messages({
      'any.only': 'Mode must be solo, duo, or squad',
      'any.required': 'Game mode is required'
    }),
  difficulty: Joi.string()
    .valid('easy', 'medium', 'hard')
    .default('medium'),
  levelRequirements: Joi.object({
    minLevel: Joi.number()
      .min(1)
      .max(100)
      .optional(),
    maxLevel: Joi.number()
      .min(1)
      .max(100)
      .optional(),
    basedOn: Joi.string()
      .valid('freefire', 'pubg', 'any')
      .default('any')
  }).optional(),
  entryFee: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Entry fee cannot be negative',
      'any.required': 'Entry fee is required'
    }),
  prizePool: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Prize pool cannot be negative',
      'any.required': 'Prize pool is required'
    }),
  maxPlayers: Joi.number()
    .min(2)
    .max(1000)
    .required()
    .messages({
      'number.min': 'Minimum 2 players required',
      'number.max': 'Maximum 1000 players allowed',
      'any.required': 'Maximum players is required'
    }),
  schedule: Joi.object({
    registrationStart: Joi.date()
      .required()
      .messages({
        'any.required': 'Registration start date is required'
      }),
    registrationEnd: Joi.date()
      .required()
      .messages({
        'any.required': 'Registration end date is required'
      }),
    tournamentStart: Joi.date()
      .required()
      .messages({
        'any.required': 'Tournament start date is required'
      }),
    estimatedDuration: Joi.number()
      .min(30)
      .max(480)
      .default(120)
  }).required(),
  roomDetails: Joi.object({
    roomId: Joi.string().optional(),
    roomPassword: Joi.string().optional(),
    map: Joi.string()
      .valid('bermuda', 'purgatory', 'kalahari', 'alpine', 'neon', 'erangel', 'miramar', 'sanhok', 'vikendi')
      .optional(),
    server: Joi.string().optional()
  }).optional(),
  rules: Joi.string()
    .max(2000)
    .optional(),
  description: Joi.string()
    .max(1000)
    .optional(),
  tags: Joi.array()
    .items(Joi.string().max(20))
    .max(10)
    .optional()
});

// Tournament update validation
const updateTournamentSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  roomDetails: Joi.object({
    roomId: Joi.string().optional(),
    roomPassword: Joi.string().optional(),
    map: Joi.string()
      .valid('bermuda', 'purgatory', 'kalahari', 'alpine', 'neon', 'erangel', 'miramar', 'sanhok', 'vikendi')
      .optional(),
    server: Joi.string().optional()
  }).optional(),
  status: Joi.string()
    .valid('upcoming', 'registration', 'full', 'live', 'completed', 'cancelled')
    .optional(),
  rules: Joi.string()
    .max(2000)
    .optional(),
  description: Joi.string()
    .max(1000)
    .optional()
});

// User profile update validation
const updateProfileSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .optional(),
  gameIDs: Joi.object({
    freeFire: Joi.string()
      .pattern(/^\d{9,12}$/)
      .optional(),
    pubg: Joi.string()
      .pattern(/^\d{9,12}$/)
      .optional(),
    freeFireLevel: Joi.number()
      .min(1)
      .max(100)
      .optional(),
    pubgLevel: Joi.number()
      .min(1)
      .max(100)
      .optional()
  }).optional(),
  profile: Joi.object({
    displayName: Joi.string()
      .max(50)
      .optional(),
    bio: Joi.string()
      .max(500)
      .optional()
  }).optional()
});

// Payment validation
const paymentSchema = Joi.object({
  amount: Joi.number()
    .min(1)
    .max(100000)
    .required()
    .messages({
      'number.min': 'Amount must be at least 1',
      'number.max': 'Amount cannot exceed 100000',
      'any.required': 'Amount is required'
    }),
  currency: Joi.string()
    .valid('INR', 'USD')
    .default('INR'),
  receipt: Joi.string()
    .max(40)
    .optional()
});

// Withdrawal validation
const withdrawalSchema = Joi.object({
  amount: Joi.number()
    .min(100)
    .max(50000)
    .required()
    .messages({
      'number.min': 'Minimum withdrawal amount is 100',
      'number.max': 'Maximum withdrawal amount is 50000',
      'any.required': 'Amount is required'
    }),
  method: Joi.string()
    .valid('bank_transfer', 'upi', 'paypal')
    .required()
    .messages({
      'any.only': 'Invalid withdrawal method',
      'any.required': 'Withdrawal method is required'
    }),
  details: Joi.object({
    accountNumber: Joi.string().when('method', {
      is: 'bank_transfer',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    ifscCode: Joi.string().when('method', {
      is: 'bank_transfer',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    upiId: Joi.string().when('method', {
      is: 'upi',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    paypalEmail: Joi.string().email().when('method', {
      is: 'paypal',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }).required()
});

// Match result validation
const matchResultSchema = Joi.object({
  tournament: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid tournament ID',
      'any.required': 'Tournament ID is required'
    }),
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID',
      'any.required': 'User ID is required'
    }),
  stats: Joi.object({
    kills: Joi.number()
      .min(0)
      .max(50)
      .required()
      .messages({
        'number.min': 'Kills cannot be negative',
        'number.max': 'Kills cannot exceed 50',
        'any.required': 'Kills is required'
      }),
    position: Joi.number()
      .min(1)
      .max(100)
      .required()
      .messages({
        'number.min': 'Position must be at least 1',
        'number.max': 'Position cannot exceed 100',
        'any.required': 'Position is required'
      }),
    damage: Joi.number()
      .min(0)
      .max(10000)
      .optional(),
    survivalTime: Joi.number()
      .min(0)
      .max(3600)
      .optional(),
    headshots: Joi.number()
      .min(0)
      .max(50)
      .optional(),
    longestKill: Joi.number()
      .min(0)
      .max(1000)
      .optional(),
    assists: Joi.number()
      .min(0)
      .max(50)
      .optional(),
    revives: Joi.number()
      .min(0)
      .max(20)
      .optional()
  }).required(),
  rank: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Rank must be at least 1',
      'any.required': 'Rank is required'
    }),
  notes: Joi.string()
    .max(1000)
    .optional()
});

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  createTournamentSchema,
  updateTournamentSchema,
  updateProfileSchema,
  paymentSchema,
  withdrawalSchema,
  matchResultSchema,
  validate
};
