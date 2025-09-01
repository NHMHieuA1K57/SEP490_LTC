const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  // Giao dịch có thể gắn với booking khách sạn…
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: function () {
      return ['payment', 'payout', 'refund'].includes(this.type);
    }
  },
  // …hoặc tour booking
  tourBookingId: {
    type: Schema.Types.ObjectId,
    ref: 'TourBooking',
    required: function () {
      return ['payment', 'refund'].includes(this.type) && !this.bookingId;
    }
  },

  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  type: {
    type: String,
    enum: ['payment', 'payout', 'withdrawal', 'refund'],
    required: true
  },

  direction: { type: String, enum: ['in', 'out'], required: true },

  amount: { type: Number, required: true }, // payout/withdrawal sẽ là số âm

  method: {
    type: String,
    enum: ['momo', 'vnpay', 'paypal', 'bank_transfer', 'manual'],
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },

  transactionId: { type: String, required: true }, // mã giao dịch hiển thị/đối soát

  paymentLinkId: { type: String },

  details: {
    commission: { type: Number, default: 0 },                              // phí/hoa hồng
    businessUserId: { type: Schema.Types.ObjectId, ref: 'User' },          // đối tác (hotel_owner/tour_provider)
    payoutPolicy: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },// lịch trả (nếu là payout)
    completedAt: { type: Date }
  }

}, { timestamps: true });

/* Indexes */
TransactionSchema.index({ bookingId: 1 });
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ direction: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ 'details.businessUserId': 1, createdAt: -1 });
TransactionSchema.index({ transactionId: 1 }, { unique: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
