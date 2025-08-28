const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  bookingId:   { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true, unique: true }, // 1 booking = 1 payment
  userId:      { type: Schema.Types.ObjectId, ref: 'User' }, // optional (truy vấn theo user nếu cần)
  amount:      { type: Number, required: true },

  method:      { type: String, enum: ['momo', 'vnpay', 'paypal', 'payos', 'cash'], default: 'payos' },
  status:      { type: String, enum: ['pending', 'completed', 'cancelled', 'failed'], default: 'pending' },

  transactionId: { type: String },       // mã từ cổng thanh toán
  paymentDate:   { type: Date },         // thời điểm thực trả
  attempts:      { type: Number, default: 0 } // cho retry

}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
