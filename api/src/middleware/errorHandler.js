const { ValidationError } = require('express-openapi-validator');
const createError = require('http-errors');

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err);

  // Handle validation errors from express-openapi-validator
  if (err instanceof ValidationError) {
    return res.status(err.status || 400).json({
      error: {
        message: err.message,
        errors: err.errors,
      },
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: 'Invalid or expired token',
      },
    });
  }

  // Handle HTTP errors
  if (err.status) {
    return res.status(err.status).json({
      error: {
        message: err.message,
      },
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
