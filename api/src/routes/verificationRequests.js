const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listVerificationRequests, 
  submitVerificationRequest,
  updateVerificationRequest
} = require('../controllers/verificationRequestsController');

const router = express.Router();

// List verification requests (admin or owner)
router.get('/', [
  query('user_id').optional().isUUID(),
  query('status').optional().isIn(['pending', 'approved', 'denied']),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listVerificationRequests);

// Submit a verification request
router.post('/', [
  body('user_id').isUUID(),
  body('notes').optional().isString().trim(),
  // Add any additional fields required for verification
  validate
], submitVerificationRequest);

// Update verification request status (admin only)
router.put('/:verification_request_id', [
  param('verification_request_id').isUUID(),
  body('status').isIn(['pending', 'approved', 'denied']),
  body('notes').optional().isString().trim(),
  validate
], updateVerificationRequest);

module.exports = router;
