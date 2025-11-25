const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listProfiles, 
  createOrUpdateProfile, 
  getProfile, 
  updateProfile, 
  deleteProfile 
} = require('../controllers/profilesController');

const router = express.Router();

// List profiles
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  query('visibility').optional().isIn(['public', 'private'])
], validate, listProfiles);

// Create or update profile
router.post('/', [
  body('user_id').isUUID(),
  body('display_name').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('role').optional().isString().isIn(['Camper', 'Host', 'Admin']),
  body('is_verified').optional().isBoolean(),
  body('profile_visibility').optional().isIn(['public', 'private'])
], validate, createOrUpdateProfile);

// Get profile by ID
router.get('/:user_id', [
  param('user_id').isUUID()
], validate, getProfile);

// Update profile
router.put('/:user_id', [
  param('user_id').isUUID(),
  body('display_name').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('role').optional().isString().isIn(['Camper', 'Host', 'Admin']),
  body('is_verified').optional().isBoolean(),
  body('profile_visibility').optional().isIn(['public', 'private'])
], validate, updateProfile);

// Delete profile
router.delete('/:user_id', [
  param('user_id').isUUID()
], validate, deleteProfile);

module.exports = router;
