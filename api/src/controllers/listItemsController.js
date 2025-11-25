const createError = require('http-errors');
const supabase = require('../db/supabase');

/**
 * List list items with filtering
 */
const listListItems = async (req, res, next) => {
  try {
    const { list_id, campsite_id, limit = 20, offset = 0 } = req.query;
    
    if (!list_id && !campsite_id) {
      throw createError(400, 'Must provide either list_id or campsite_id');
    }
    
    let query = supabase
      .from('list_items')
      .select(`
        *,
        lists!inner(*)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (list_id) query = query.eq('list_id', list_id);
    if (campsite_id) query = query.eq('campsite_id', campsite_id);
    
    const { data: items, count, error } = await query;
    
    if (error) throw error;
    
    // Filter out items from private lists that the user doesn't own
    const filteredItems = items.filter(item => {
      const list = item.lists;
      return list.visibility === 'public' || 
             list.user_id === req.user.id ||
             req.user.role === 'admin';
    });
    
    res.json({
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count || 0,
      items: filteredItems
    });
  } catch (error) {
    next(createError(500, 'Failed to fetch list items'));
  }
};

/**
 * Add an item to a list
 */
const addListItem = async (req, res, next) => {
  try {
    const { list_id, campsite_id } = req.body;
    
    // First check if the list exists and user has permission
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('user_id')
      .eq('list_id', list_id)
      .single();
    
    if (listError) {
      if (listError.code === 'PGRST116') {
        throw createError(404, 'List not found');
      }
      throw listError;
    }
    
    // Verify the requesting user is the owner of the list
    if (req.user.id !== list.user_id) {
      throw createError(403, 'You can only add items to your own lists');
    }
    
    // Check if the campsite exists
    const { error: campsiteError } = await supabase
      .from('campsites')
      .select('campsite_id')
      .eq('campsite_id', campsite_id)
      .single();
    
    if (campsiteError) {
      if (campsiteError.code === 'PGRST116') {
        throw createError(404, 'Campsite not found');
      }
      throw campsiteError;
    }
    
    // Check if the item is already in the list
    const { data: existingItem, error: existingError } = await supabase
      .from('list_items')
      .select('list_item_id')
      .eq('list_id', list_id)
      .eq('campsite_id', campsite_id)
      .maybeSingle();
    
    if (existingItem) {
      throw createError(400, 'This campsite is already in the list');
    }
    
    // Add the item to the list
    const { data, error } = await supabase
      .from('list_items')
      .insert([{ 
        list_id, 
        campsite_id,
        added_at: new Date() 
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
 * Remove an item from a list
 */
const removeListItem = async (req, res, next) => {
  try {
    const { list_item_id } = req.params;
    
    // First get the list item with list details
    const { data: listItem, error: fetchError } = await supabase
      .from('list_items')
      .select('*, lists!inner(*)')
      .eq('list_item_id', list_item_id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw createError(404, 'List item not found');
      }
      throw fetchError;
    }
    
    const list = listItem.lists;
    
    // Verify the requesting user is the owner of the list or an admin
    if (req.user.id !== list.user_id) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', req.user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        throw createError(403, 'You can only remove items from your own lists');
      }
    }
    
    // Remove the item from the list
    const { error: deleteError } = await supabase
      .from('list_items')
      .delete()
      .eq('list_item_id', list_item_id);
    
    if (deleteError) throw deleteError;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listListItems,
  addListItem,
  removeListItem
};
