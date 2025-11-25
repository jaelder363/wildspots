const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * Middleware to authenticate JWT token
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      throw createError(401, 'Invalid or expired token');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user has admin role
 */
const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate the user
    await authenticateJWT(req, res, () => {});
    
    // Then check if user has admin role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', req.user.id)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      throw createError(403, 'Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateJWT,
  requireAdmin
};
