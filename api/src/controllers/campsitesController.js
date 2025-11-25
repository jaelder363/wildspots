const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List campsites with filtering and pagination
 */
const listCampsites = async (req, res, next) => {
  try {
    const { 
      owner_user_id, 
      terrain_type, 
      price_range, 
      limit = 20, 
      offset = 0 
    } = req.query;
    
    let query = supabase
      .from('campsites')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    // Apply filters if provided
    if (owner_user_id) query = query.eq('owner_user_id', owner_user_id);
    if (terrain_type) query = query.eq('terrain_type', terrain_type);
    if (price_range) query = query.eq('price_range', price_range);
    
    const { data: campsites, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: campsites || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch campsites'));
  }
};

/**
 * Create a new campsite
 */
const createCampsite = async (req, res, next) => {
  try {
    const { owner_user_id, ...campsiteData } = req.body;
    
    // Verify the requesting user is the owner
    if (req.user.id !== owner_user_id) {
      throw createError(403, 'You can only create campsites for yourself');
    }
    
    const { data, error } = await supabase
      .from('campsites')
      .insert([{ owner_user_id, ...campsiteData }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        throw createError(409, 'Campsite with these details already exists');
      }
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a campsite by ID
 */
const getCampsite = async (req, res, next) => {
  try {
    const { campsite_id } = req.params;
    
    const { data: campsite, error } = await supabase
      .from('campsites')
      .select('*')
      .eq('campsite_id', campsite_id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError(404, 'Campsite not found');
      }
      throw error;
    }
    
    res.json(campsite);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a campsite
 */
const updateCampsite = async (req, res, next) => {
  try {
    const { campsite_id } = req.params;
    
    // First get the campsite to check ownership
    const { data: existingCampsite, error: fetchError } = await supabase
      .from('campsites')
      .select('owner_user_id')
      .eq('campsite_id', campsite_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Campsite not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the owner
    if (req.user.id !== existingCampsite.owner_user_id) {
      throw createError(403, 'You can only update your own campsites');
    }
    
    // Update the campsite
    const { data: updatedCampsite, error: updateError } = await supabase
      .from('campsites')
      .update({
        ...req.body,
        updated_at: new Date()
      })
      .eq('campsite_id', campsite_id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    res.json(updatedCampsite);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a campsite
 */
const deleteCampsite = async (req, res, next) => {
  try {
    const { campsite_id } = req.params;
    
    // First get the campsite to check ownership
    const { data: existingCampsite, error: fetchError } = await supabase
      .from('campsites')
      .select('owner_user_id')
      .eq('campsite_id', campsite_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'Campsite not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the owner
    if (req.user.id !== existingCampsite.owner_user_id) {
      throw createError(403, 'You can only delete your own campsites');
    }
    
    // Delete the campsite
    const { error: deleteError } = await supabase
      .from('campsites')
      .delete()
      .eq('campsite_id', campsite_id);
    
    if (deleteError) throw deleteError;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCampsites,
  createCampsite,
  getCampsite,
  updateCampsite,
  deleteCampsite
};
