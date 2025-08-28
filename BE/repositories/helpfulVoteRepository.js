const { Types } = require('mongoose');
const HelpfulVote = require('../models/HelpfulVote');

const toId = v => (Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : v);

module.exports = {
  async createUnique({ reviewId, userId }) {
    return HelpfulVote.create({ reviewId: toId(reviewId), userId: toId(userId) });
  },
  async delete({ reviewId, userId }) {
    const res = await HelpfulVote.deleteOne({
      reviewId: toId(reviewId),
      userId: toId(userId)
    });
    return res.deletedCount > 0;
  }
};
