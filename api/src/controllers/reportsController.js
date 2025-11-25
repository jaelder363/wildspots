const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List reports with filtering (admin or owner)
 */
const listReports = async (req, res, next) => {
  try {
    const { user_id, status, limit = 20, offset = 0 } = req.query;
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', req.user.id)
      .single();
    
    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    // Non-admin users can only see their own reports
    if (profile?.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    } else if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: reports, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: reports || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch reports'));
  }
};

/**
 * Create a new report
 */
const createReport = async (req, res, next) => {
  try {
    const { user_id, target_type, target_id, reason } = req.body;
    
    // Verify the requesting user is the reporter
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only submit reports as yourself');
    }
    
    // Validate target type
    const validTargetTypes = ['campsite', 'review', 'comment', 'profile'];
    if (!validTargetTypes.includes(target_type)) {
      throw createError(400, `Invalid target_type. Must be one of: ${validTargetTypes.join(', ')}`);
    }
    
    // Check if the target exists
    let tableName;
    switch (target_type) {
      case 'campsite':
        tableName = 'campsites';
        break;
      case 'review':
        tableName = 'reviews';
        break;
      case 'comment':
        tableName = 'comments';
        break;
      case 'profile':
        tableName = 'profiles';
        break;
    }
    
    const { error: targetError } = await supabase
      .from(tableName)
      .select('*')
      .eq(`${target_type === 'profile' ? 'user_id' : `${target_type}_id`}`, target_id)
      .single();
    
    if (targetError) {
      if (targetError.code === 'PGRST116') {
        throw createError(404, `${target_type} not found`);
      }
      throw targetError;
    }
    
    // Create the report
    const { data, error } = await supabase
      .from('reports')
      .insert([{ 
        user_id,
        target_type,
        target_id,
        reason,
        status: 'opened',
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
 * Update report status (admin only)
 */
const updateReport = async (req, res, next) => {
  try {
    const { report_id } = req.params;
    const { status } = req.body;
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', req.user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      throw createError(403, 'Admin access required');
    }
    
    // Validate status
    const validStatuses = ['opened', 'reviewing', 'resolved'];
    if (!validStatuses.includes(status)) {
      throw createError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    // Update the report
    const { data: updatedReport, error: updateError } = await supabase
      .from('reports')
      .update({
        status,
        updated_at: new Date()
      })
      .eq('report_id', report_id)
      .select()
      .single();
    
    if (updateError) {
      if (updateError.code === 'PGRST116') {
        throw createError(404, 'Report not found');
      }
      throw updateError;
    }
    
    res.json(updatedReport);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listReports,
  createReport,
  updateReport
};
