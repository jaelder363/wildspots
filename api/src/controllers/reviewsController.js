const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List reviews with filtering
 */
const listReviews = async (req, res, next) => {
  try {
    const { 
      campsite_id, 
      user_id, 
      limit = 20, 
      offset = 0 
    } = req.query;
    
    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    // Apply filters if provided
    if (campsite_id) query = query.eq('campsite_id', campsite_id);
    if (user_id) query = query.eq('user_id', user_id);
    
    const { data: reviews, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: reviews || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch reviews'));
  }
};

/**
 * Create a new review
 */
const createReview = async (req, res, next) => {
  try {
    const { user_id, ...reviewData } = req.body;
    
    // Verify the requesting user is the author
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only create reviews as yourself');
    }
    
    // Check if user has already reviewed this campsite
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('review_id')
      .eq('user_id', user_id)
      .eq('campsite_id', reviewData.campsite_id)
      .maybeSingle();
    
    if (existingReview) {
      throw createError(400, 'You have already reviewed this campsite');
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ user_id, ...reviewData }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23503') { // Foreign key violation
        throw createError(404, 'Campsite or user not found');
      }
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a review by ID
 */
const getReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    
    const { data: review, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('review_id', review_id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError(404, 'Review not found');
      }
      throw error;
    }
    
    res.json(review);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a review
 */
const updateReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { user_id, ...updateData } = req.body;
    
    // First get the review to check ownership
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('review_id', review_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Review not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the author
    if (req.user.id !== existingReview.user_id) {
      throw createError(403, 'You can only update your own reviews');
    }
    
    // Update the review
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('review_id', review_id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a review
 */
const deleteReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    
    // First get the review to check ownership
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('review_id', review_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Review not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the author or an admin
    if (req.user.id !== existingReview.user_id) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', req.user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        throw createError(403, 'You can only delete your own reviews');
      }
    }
    
    // Delete the review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('review_id', review_id);
    
    if (deleteError) throw deleteError;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview
};
