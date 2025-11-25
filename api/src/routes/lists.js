const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listLists, 
  createList, 
  getList, 
  updateList, 
  deleteList 
} = require('../controllers/listsController');

const router = express.Router();

// List lists with optional filters
router.get('/', [
  query('user_id').optional().isUUID(),
  query('visibility').optional().isIn(['personal', 'shared', 'public']),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listLists);

// Create a new list
router.post('/', [
  body('user_id').isUUID(),
  body('name').isString().trim().isLength({ min: 1, max: 100 }),
  body('visibility').isIn(['personal', 'shared', 'public']),
  validate
], createList);

// Get a specific list
router.get('/:list_id', [
  param('list_id').isUUID(),
  validate
], getList);

// Update a list
router.put('/:list_id', [
  param('list_id').isUUID(),
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('visibility').optional().isIn(['personal', 'shared', 'public']),
  validate
], updateList);

// Delete a list
router.delete('/:list_id', [
  param('list_id').isUUID(),
  validate
], deleteList);

module.exports = router;
