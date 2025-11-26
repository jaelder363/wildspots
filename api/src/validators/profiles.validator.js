const { body, param, query } = require('express-validator');

const createProfileValidation = [
  body('user_id').isUUID().withMessage('User ID must be a valid UUID'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, dots, and hyphens'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be longer than 500 characters'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('visibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Visibility must be either public or private')
];

const updateProfileValidation = [
  param('user_id').isUUID().withMessage('User ID must be a valid UUID'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, dots, and hyphens'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be longer than 500 characters'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('visibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Visibility must be either public or private')
];

const getProfilesValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer')
    .toInt(),
  query('visibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Visibility must be either public or private')
];

const getProfileByIdValidation = [
  param('user_id').isUUID().withMessage('User ID must be a valid UUID')
];

module.exports = {
  createProfileValidation,
  updateProfileValidation,
  getProfilesValidation,
  getProfileByIdValidation
};
