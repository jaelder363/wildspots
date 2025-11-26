const { BaseModel } = require('./index');

class Campsite extends BaseModel {
  static get tableName() {
    return 'campsites';
  }

  static async findByOwner(ownerId, options = {}) {
    return this.find({ owner_user_id: ownerId }, options);
  }

  static async findByFilters(filters = {}, options = {}) {
    const { terrain_type, price_range, ...rest } = filters;
    let query = { ...rest };
    
    if (terrain_type) {
      query.terrain_type = terrain_type;
    }
    
    if (price_range) {
      const [min, max] = price_range.split('-').map(Number);
      if (!isNaN(min)) {
        query = {
          ...query,
          price_per_night: supabase.gte(min)
        };
      }
      if (!isNaN(max)) {
        query = {
          ...query,
          price_per_night: supabase.lte(max)
        };
      }
    }
    
    return this.find(query, options);
  }
}

module.exports = Campsite;
