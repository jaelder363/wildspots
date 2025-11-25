const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listFollows, 
  followUser, 
  unfollowUser 
} = require('../controllers/followsController');

const router = express.Router();

// List follows with optional filters
router.get('/', [
  query('follower_user_id').optional().isUUID(),
  query('followed_user_id').optional().isUUID(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listFollows);

// Follow a user
router.post('/', [
  body('follower_user_id').isUUID(),
  body('followed_user_id').isUUID(),
  validate
], followUser);

// Unfollow a user
router.delete('/', [
  query('follower_user_id').isUUID(),
  query('followed_user_id').isUUID(),
  validate
], unfollowUser);

module.exports = router;
