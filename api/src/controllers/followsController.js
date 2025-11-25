const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List follows with filtering
 */
const listFollows = async (req, res, next) => {
  try {
    const { follower_user_id, followed_user_id, limit = 20, offset = 0 } = req.query;
    
    if (!follower_user_id && !followed_user_id) {
      throw createError(400, 'Must provide either follower_user_id or followed_user_id');
    }
    
    // Check if the user has permission to view these follows
    if (follower_user_id && follower_user_id !== req.user.id) {
      // Check if the profile is private
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('profile_visibility')
        .eq('user_id', follower_user_id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profile.profile_visibility === 'private') {
        throw createError(403, 'You do not have permission to view these follows');
      }
    }
    
    let query = supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (follower_user_id) query = query.eq('follower_user_id', follower_user_id);
    if (followed_user_id) query = query.eq('followed_user_id', followed_user_id);
    
    const { data: follows, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: follows || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch follows'));
  }
};

/**
 * Follow a user
 */
const followUser = async (req, res, next) => {
  try {
    const { follower_user_id, followed_user_id } = req.body;
    
    // Verify the requesting user is the follower
    if (req.user.id !== follower_user_id) {
      throw createError(403, 'You can only follow users as yourself');
    }
    
    // Prevent self-follow
    if (follower_user_id === followed_user_id) {
      throw createError(400, 'You cannot follow yourself');
    }
    
    // Check if the followed user exists
    const { error: userError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', followed_user_id)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        throw createError(404, 'User to follow not found');
      }
      throw userError;
    }
    
    // Check if already following
    const { data: existingFollow, error: existingError } = await supabase
      .from('follows')
      .select('follow_id')
      .eq('follower_user_id', follower_user_id)
      .eq('followed_user_id', followed_user_id)
      .maybeSingle();
    
    if (existingFollow) {
      throw createError(400, 'You are already following this user');
    }
    
    // Create the follow relationship
    const { data, error } = await supabase
      .from('follows')
      .insert([{ 
        follower_user_id, 
        followed_user_id,
        created_at: new Date()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Unfollow a user
 */
const unfollowUser = async (req, res, next) => {
  try {
    const { follower_user_id, followed_user_id } = req.query;
    
    // Verify the requesting user is the follower
    if (req.user.id !== follower_user_id) {
      throw createError(403, 'You can only unfollow users for yourself');
    }
    
    // Check if the follow relationship exists
    const { data: existingFollow, error: fetchError } = await supabase
      .from('follows')
      .select('follow_id')
      .eq('follower_user_id', follower_user_id)
      .eq('followed_user_id', followed_user_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Follow relationship not found');
      }
      throw fetchError;
    }
    
    // Delete the follow relationship
    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_user_id', follower_user_id)
      .eq('followed_user_id', followed_user_id);
    
    if (deleteError) throw deleteError;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listFollows,
  followUser,
  unfollowUser
};
