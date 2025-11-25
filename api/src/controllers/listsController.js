const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List user lists with filtering
 */
const listLists = async (req, res, next) => {
  try {
    const { user_id, visibility, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('lists')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (visibility) {
      query = query.eq('visibility', visibility);
    } else if (!user_id) {
      // Default to only public lists if no user_id is provided
      query = query.eq('visibility', 'public');
    }
    
    const { data: lists, count, error } = await query;
    
    if (error) throw error;
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: lists || []
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch lists'));
  }
};

/**
 * Create a new list
 */
const createList = async (req, res, next) => {
  try {
    const { user_id, ...listData } = req.body;
    
    // Verify the requesting user is the owner
    if (req.user.id !== user_id) {
      throw createError(403, 'You can only create lists for yourself');
    }
    
    const { data, error } = await supabase
      .from('lists')
      .insert([{ user_id, ...listData }])
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
 * Get a list by ID
 */
const getList = async (req, res, next) => {
  try {
    const { list_id } = req.params;
    
    const { data: list, error } = await supabase
      .from('lists')
      .select('*')
      .eq('list_id', list_id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError(404, 'List not found');
      }
      throw error;
    }
    
    // Check list visibility
    if (list.visibility !== 'public' && req.user.id !== list.user_id) {
      throw createError(403, 'You do not have permission to view this list');
    }
    
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a list
 */
const updateList = async (req, res, next) => {
  try {
    const { list_id } = req.params;
    const { user_id, ...updateData } = req.body;
    
    // First get the list to check ownership
    const { data: existingList, error: fetchError } = await supabase
      .from('lists')
      .select('user_id')
      .eq('list_id', list_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'List not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the owner
    if (req.user.id !== existingList.user_id) {
      throw createError(403, 'You can only update your own lists');
    }
    
    // Update the list
    const { data: updatedList, error: updateError } = await supabase
      .from('lists')
      .update({
        ...updateData,
        updated_at: new Date()
      })
      .eq('list_id', list_id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    res.json(updatedList);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a list
 */
const deleteList = async (req, res, next) => {
  try {
    const { list_id } = req.params;
    
    // First get the list to check ownership
    const { data: existingList, error: fetchError } = await supabase
      .from('lists')
      .select('user_id')
      .eq('list_id', list_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'List not found');
      }
      throw fetchError;
    }
    
    // Verify the requesting user is the owner or an admin
    if (req.user.id !== existingList.user_id) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', req.user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        throw createError(403, 'You can only delete your own lists');
      }
    }
    
    // Delete the list (cascading delete will handle list items)
    const { error: deleteError } = await supabase
      .from('lists')
      .delete()
      .eq('list_id', list_id);
    
    if (deleteError) throw deleteError;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listLists,
  createList,
  getList,
  updateList,
  deleteList
};
