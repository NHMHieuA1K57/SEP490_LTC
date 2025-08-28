const mongoose = require('mongoose');
const { Schema } = mongoose;

const HelpfulVoteSchema = new Schema({
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

HelpfulVoteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('HelpfulVote', HelpfulVoteSchema);
