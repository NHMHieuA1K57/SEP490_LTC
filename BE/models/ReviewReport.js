const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewReportSchema = new Schema({
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, enum: ['spam', 'abuse', 'fake', 'other'], required: true },
  note: { type: String },
  status: { type: String, enum: ['open', 'reviewed', 'dismissed'], default: 'open' }
}, { timestamps: true });

ReviewReportSchema.index({ reviewId: 1, reporterId: 1 }, { unique: true });

module.exports = mongoose.model('ReviewReport', ReviewReportSchema);
