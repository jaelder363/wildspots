const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listReports, 
  createReport, 
  updateReport 
} = require('../controllers/reportsController');

const router = express.Router();

// List reports (admin or owner)
router.get('/', [
  query('user_id').optional().isUUID(),
  query('status').optional().isIn(['opened', 'reviewing', 'resolved']),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listReports);

// Create a new report
router.post('/', [
  body('user_id').isUUID(),
  body('target_type').isIn(['campsite', 'review', 'comment', 'profile']),
  body('target_id').isUUID(),
  body('reason').isString().trim().isLength({ min: 1, max: 1000 }),
  validate
], createReport);

// Update report status (admin only)
router.put('/:report_id', [
  param('report_id').isUUID(),
  body('status').isIn(['opened', 'reviewing', 'resolved']),
  validate
], updateReport);

module.exports = router;
