const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listCampsites, 
  createCampsite, 
  getCampsite, 
  updateCampsite, 
  deleteCampsite 
} = require('../controllers/campsitesController');

const router = express.Router();

// List campsites with optional filters
router.get('/', [
  query('owner_user_id').optional().isUUID(),
  query('terrain_type').optional().isString(),
  query('price_range').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listCampsites);

// Create a new campsite
router.post('/', [
  body('owner_user_id').isUUID(),
  body('name').isString().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().isString(),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('terrain_type').optional().isString(),
  body('price_range').optional().isString(),
  body('water_available').optional().isBoolean(),
  body('restrooms_available').optional().isBoolean(),
  body('rules_notes').optional().isString(),
  validate
], createCampsite);

// Get a specific campsite
router.get('/:campsite_id', [
  param('campsite_id').isUUID(),
  validate
], getCampsite);

// Update a campsite
router.put('/:campsite_id', [
  param('campsite_id').isUUID(),
  body('name').optional().isString().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().isString(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('terrain_type').optional().isString(),
  body('price_range').optional().isString(),
  body('water_available').optional().isBoolean(),
  body('restrooms_available').optional().isBoolean(),
  body('rules_notes').optional().isString(),
  validate
], updateCampsite);

// Delete a campsite
router.delete('/:campsite_id', [
  param('campsite_id').isUUID(),
  validate
], deleteCampsite);

module.exports = router;
