const { BaseModel } = require('./index');

class List extends BaseModel {
  static get tableName() {
    return 'lists';
  }

  static async findByUser(userId, options = {}) {
    return this.find({ user_id: userId }, options);
  }

  static async findByVisibility(visibility, options = {}) {
    return this.find({ visibility }, options);
  }

  static async addCampsite(listId, campsiteId) {
    const { data, error } = await supabase
      .from('list_items')
      .insert([{
        list_id: listId,
        campsite_id: campsiteId,
        added_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeCampsite(listId, campsiteId) {
    const { data, error } = await supabase
      .from('list_items')
      .delete()
      .eq('list_id', listId)
      .eq('campsite_id', campsiteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = List;
