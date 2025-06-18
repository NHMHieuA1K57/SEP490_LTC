const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['payment', 'payout', 'withdrawal', 'refund'], required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['momo', 'vnpay', 'paypal', 'bank_transfer'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String, required: true },
  paymentLinkId: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  details: {
    commission: { type: Number, default: 0 },
    businessUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date }
  }
}, { timestamps: true });

// Indices
TransactionSchema.index({ bookingId: 1 });
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ 'details.businessUserId': 1 });
TransactionSchema.index({ type: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);