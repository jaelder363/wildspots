const { BaseModel } = require('./index');

class Comment extends BaseModel {
  static get tableName() {
    return 'comments';
  }

  static async findByReview(reviewId, options = {}) {
    return this.find({ review_id: reviewId }, options);
  }

  static async findByUser(userId, options = {}) {
    return this.find({ user_id: userId }, options);
  }
}

module.exports = Comment;
