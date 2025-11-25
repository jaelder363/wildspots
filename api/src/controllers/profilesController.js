const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List profiles with pagination
 */
const listProfiles = async (req, res, next) => {
  try {
    const { limit = 20, offset = 0, visibility } = req.query;
    
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (visibility) {
      query = query.eq('profile_visibility', visibility);
    }
    
    const { data: profiles, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: profiles || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch profiles'));
  }
};

/**
 * Create or update a profile
 */
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const { user_id, ...profileData } = req.body;
    
    // Verify the requesting user can only update their own profile
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only update your own profile');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        { user_id, ...profileData, updated_at: new Date() },
        { onConflict: 'user_id' }
      )
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        throw createError(409, 'Profile already exists');
      }
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a profile by user ID
 */
const getProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Not found
        throw createError(404, 'Profile not found');
      }
      throw error;
    }
    
    // Check profile visibility
    if (profile.profile_visibility === 'private' && req.user.id !== user_id) {
      throw createError(403, 'This profile is private');
    }
    
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    
    // Verify the requesting user can only update their own profile
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only update your own profile');
    }
    
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        ...req.body,
        updated_at: new Date()
      })
      .eq('user_id', user_id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError(404, 'Profile not found');
      }
      throw error;
    }
    
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a profile
 */
const deleteProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    
    // Verify the requesting user can only delete their own profile
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only delete your own profile');
    }
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', user_id);
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError(404, 'Profile not found');
      }
      throw error;
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProfiles,
  createOrUpdateProfile,
  getProfile,
  updateProfile,
  deleteProfile
};
