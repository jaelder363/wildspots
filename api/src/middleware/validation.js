const { validationResult } = require('express-validator');
const createError = require('http-errors');

/**
 * Middleware to validate request against defined validation rules
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      param: err.param,
      message: err.msg,
      value: err.value
    }));
    
    return next(createError(400, 'Validation error', { errors: errorMessages }));
  }
  
  next();
};

module.exports = {
  validate
};
