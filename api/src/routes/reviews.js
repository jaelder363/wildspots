const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listReviews, 
  createReview, 
  getReview, 
  updateReview, 
  deleteReview 
} = require('../controllers/reviewsController');

const router = express.Router();

// List reviews with optional filters
router.get('/', [
  query('campsite_id').optional().isUUID(),
  query('user_id').optional().isUUID(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listReviews);

// Create a new review
router.post('/', [
  body('user_id').isUUID(),
  body('campsite_id').isUUID(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('text').optional().isString(),
  validate
], createReview);

// Get a specific review
router.get('/:review_id', [
  param('review_id').isUUID(),
  validate
], getReview);

// Update a review
router.put('/:review_id', [
  param('review_id').isUUID(),
  body('user_id').isUUID(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('text').optional().isString(),
  validate
], updateReview);

// Delete a review
router.delete('/:review_id', [
  param('review_id').isUUID(),
  validate
], deleteReview);

module.exports = router;
