const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List verification requests with filtering (admin only)
 */
const listVerificationRequests = async (req, res, next) => {
  try {
    const { user_id, status, limit = 20, offset = 0 } = req.query;
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', req.user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      // Non-admin users can only see their own requests
      if (user_id && user_id !== req.user.id) {
        throw createError(403, 'You can only view your own verification requests');
      }
    }
    
    let query = supabase
      .from('verification_requests')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    // Non-admin users can only see their own requests
    if (profile?.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    } else if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: requests, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: requests || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch verification requests'));
  }
};

/**
 * Submit a verification request
 */
const submitVerificationRequest = async (req, res, next) => {
  try {
    const { user_id, ...requestData } = req.body;
    
    // Verify the requesting user is submitting for themselves
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only submit verification requests for yourself');
    }
    
    // Check if user already has a pending request
    const { data: existingRequest, error: existingError } = await supabase
      .from('verification_requests')
      .select('verification_request_id')
      .eq('user_id', user_id)
      .eq('status', 'pending')
      .maybeSingle();
    
    if (existingRequest) {
      throw createError(400, 'You already have a pending verification request');
    }
    
    // Create the verification request
    const { data, error } = await supabase
      .from('verification_requests')
      .insert([{ 
        user_id, 
        ...requestData,
        status: 'pending',
        submitted_at: new Date()
      }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23503') { // Foreign key violation
        throw createError(404, 'User not found');
      }
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update verification request status (admin only)
 */
const updateVerificationRequest = async (req, res, next) => {
  try {
    const { verification_request_id } = req.params;
    const { status, notes } = req.body;
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', req.user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      throw createError(403, 'Admin access required');
    }
    
    // Get the current request
    const { data: existingRequest, error: fetchError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('verification_request_id', verification_request_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Verification request not found');
      }
      throw fetchError;
    }
    
    // Update the verification request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('verification_requests')
      .update({
        status,
        notes,
        reviewed_at: new Date(),
        reviewer_user_id: req.user.id
      })
      .eq('verification_request_id', verification_request_id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // If approved, update the user's profile
    if (status === 'approved') {
      await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('user_id', existingRequest.user_id);
    }
    
    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listVerificationRequests,
  submitVerificationRequest,
  updateVerificationRequest
};
