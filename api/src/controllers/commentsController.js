const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List comments with filtering
 */
const listComments = async (req, res, next) => {
  try {
    const { review_id, user_id, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (review_id) query = query.eq('review_id', review_id);
    if (user_id) query = query.eq('user_id', user_id);
    
    const { data: comments, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: comments || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch comments'));
  }
};

/**
 * Create a new comment
 */
const createComment = async (req, res, next) => {
  try {
    const { user_id, ...commentData } = req.body;
    
    // Verify the requesting user is the author
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only create comments as yourself');
    }
    
    const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id, ...commentData }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23503') { // Foreign key violation
        throw createError(404, 'Review or user not found');
      }
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a comment by ID
 */
const getComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    
    const { data: comment, error } = await supabase
      .from('comments')
      .select('*')
      .eq('comment_id', comment_id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError(404, 'Comment not found');
      }
      throw error;
    }
    
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a comment
 */
const updateComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { user_id, ...updateData } = req.body;
    
    // First get the comment to check ownership
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('comment_id', comment_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Comment not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the author
    if (req.user.id !== existingComment.user_id) {
      throw createError(403, 'You can only update your own comments');
    }
    
    // Update the comment
    const { data: updatedComment, error: updateError } = await supabase
      .from('comments')
      .update(updateData)
      .eq('comment_id', comment_id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a comment
 */
const deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    
    // First get the comment to check ownership
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('comment_id', comment_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Comment not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the author or an admin
    if (req.user.id !== existingComment.user_id) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', req.user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        throw createError(403, 'You can only delete your own comments');
      }
    }
    
    // Delete the comment
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('comment_id', comment_id);
    
    if (deleteError) throw deleteError;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listComments,
  createComment,
  getComment,
  updateComment,
  deleteComment
};
