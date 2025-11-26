const { supabase } = require('../db/supabase');
const { validationResult } = require('express-validator');

/**
 * @route GET /profiles
 * @desc Get paginated list of profiles
 * @access Public
 */
const getProfiles = async (req, res) => {
  try {
    const { limit = 20, offset = 0, visibility } = req.query;
    
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    if (visibility) {
      query = query.eq('visibility', visibility);
    }
    
    const { data, error, count } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (error) throw error;
    
    res.json({
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
};

/**
 * @route POST /profiles
 * @desc Create or update a profile
 * @access Private
 */
const createOrUpdateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { user_id, username, bio, avatar_url, website, visibility = 'public' } = req.body;
    
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    let data, error;
    
    if (existingProfile) {
      // Update existing profile
      const { data: updatedData, error: updateError } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar_url,
          website,
          visibility,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .select()
        .single();
      
      data = updatedData;
      error = updateError;
    } else {
      // Create new profile
      const { data: createdData, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id,
            username,
            bio,
            avatar_url,
            website,
            visibility
          }
        ])
        .select()
        .single();
      
      data = createdData;
      error = createError;
    }

    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
};

/**
 * @route GET /profiles/:user_id
 * @desc Get profile by user ID
 * @access Public
 */
const getProfileById = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Profile not found' });
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * @route PUT /profiles/:user_id
 * @desc Update a profile
 * @access Private (owner or admin)
 */
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { user_id } = req.params;
    const { username, bio, avatar_url, website, visibility } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username,
        bio,
        avatar_url,
        website,
        visibility,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Profile not found' });
    
    res.json(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  getProfiles,
  createOrUpdateProfile,
  getProfileById,
  updateProfile
};
