const express = require('express');
const { authenticateJWT } = require('../middleware/auth');
const profilesRouter = require('./profiles');
const campsitesRouter = require('./campsites');
const reviewsRouter = require('./reviews');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply JWT authentication to all routes except health check
router.use(authenticateJWT);

// Mount the individual route modules
router.use('/profiles', profilesRouter);
router.use('/campsites', campsitesRouter);
router.use('/reviews', reviewsRouter);

// 404 handler
router.use((req, res, next) => {
  res.status(404).json({ 
    error: {
      message: 'Not Found',
      path: req.path,
      method: req.method
    }
  });
});

module.exports = router;
