const { StatusCodes } = require('http-status-codes');
const { logger } = require('../utils/logger');

/**
 * Error handler middleware for Express
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Default error structure
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.message = 'Validation Error';
    errorResponse.errors = err.errors;
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (err.name === 'UnauthorizedError') {
    errorResponse.message = 'Unauthorized';
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }

  if (err.name === 'ForbiddenError') {
    errorResponse.message = 'Forbidden';
    return res.status(StatusCodes.FORBIDDEN).json(errorResponse);
  }

  if (err.name === 'NotFoundError') {
    errorResponse.message = 'Resource not found';
    return res.status(StatusCodes.NOT_FOUND).json(errorResponse);
  }

  if (err.name === 'ConflictError') {
    errorResponse.message = 'Resource already exists';
    return res.status(StatusCodes.CONFLICT).json(errorResponse);
  }

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ...(req.user && { userId: req.user.id })
  });

  // Default to 500 Internal Server Error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
};

module.exports = errorHandler;
