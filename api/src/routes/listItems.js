const express = require('express');
const { query, param, body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { 
  listListItems, 
  addListItem, 
  removeListItem 
} = require('../controllers/listItemsController');

const router = express.Router();

// List list items with optional filters
router.get('/', [
  query('list_id').optional().isUUID(),
  query('campsite_id').optional().isUUID(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  validate
], listListItems);

// Add an item to a list
router.post('/', [
  body('list_id').isUUID(),
  body('campsite_id').isUUID(),
  validate
], addListItem);

// Remove an item from a list
router.delete('/:list_item_id', [
  param('list_item_id').isUUID(),
  validate
], removeListItem);

module.exports = router;
