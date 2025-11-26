const { BaseModel } = require('./index');

class Review extends BaseModel {
  static get tableName() {
    return 'reviews';
  }

  static async findByCampsite(campsiteId, options = {}) {
    return this.find({ campsite_id: campsiteId }, options);
  }

  static async findByUser(userId, options = {}) {
    return this.find({ user_id: userId }, options);
  }
}

module.exports = Review;
