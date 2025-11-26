const { supabase } = require('../db/supabase');

class BaseModel {
  static get tableName() {
    throw new Error('tableName must be implemented by subclasses');
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findOne(query = {}) {
    let queryBuilder = supabase.from(this.tableName).select('*');
    
    // Apply where conditions
    Object.entries(query).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });

    const { data, error } = await queryBuilder.single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data || null;
  }

  static async find(query = {}, options = {}) {
    const { limit = 20, offset = 0, orderBy, order = 'asc' } = options;
    
    let queryBuilder = supabase
      .from(this.tableName)
      .select('*', { count: 'exact' });

    // Apply where conditions
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        queryBuilder = queryBuilder.eq(key, value);
      }
    });

    // Apply pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    // Apply ordering
    if (orderBy) {
      queryBuilder = queryBuilder.order(orderBy, { ascending: order === 'asc' });
    }

    const { data, error, count } = await queryBuilder;
    if (error) throw error;

    return {
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count
      }
    };
  }

  static async create(data) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async update(id, data) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async delete(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = {
  BaseModel
};
