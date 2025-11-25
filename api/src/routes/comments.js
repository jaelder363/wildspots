const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listComments, 
  createComment, 
  getComment, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentsController');

const router = express.Router();

// List comments with optional filters
router.get('/', [
  query('review_id').optional().isUUID(),
  query('user_id').optional().isUUID(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listComments);

// Create a new comment
router.post('/', [
  body('user_id').isUUID(),
  body('review_id').isUUID(),
  body('text').isString().trim().isLength({ min: 1, max: 1000 }),
  validate
], createComment);

// Get a specific comment
router.get('/:comment_id', [
  param('comment_id').isUUID(),
  validate
], getComment);

// Update a comment
router.put('/:comment_id', [
  param('comment_id').isUUID(),
  body('text').isString().trim().isLength({ min: 1, max: 1000 }),
  validate
], updateComment);

// Delete a comment
router.delete('/:comment_id', [
  param('comment_id').isUUID(),
  validate
], deleteComment);

module.exports = router;
