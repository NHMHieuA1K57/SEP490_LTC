const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TourBookingSchema = new Schema({
  tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
availabilityId: { type: Schema.Types.ObjectId, required: true },            // Ngày tour cụ thể
  quantityAdult: { type: Number, required: true, min: 0 },
  quantityChild: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true },
  note: { type: String },
  isPrivateBooking: { type: Boolean, default: false },          // true nếu khách bao riêng
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'cancelled', 'completed'], 
    default: "pending" 
  },
  paymentMethod: { type: String, enum: ['payos', 'momo', 'vnpay'], default: 'payos' },
  transactionId: { type: String },
  bookedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("TourBooking", TourBookingSchema);
// Mô hình TourBooking với các trường và cấu trúc cần thiết cho việc quản lý đặt tour
// Bao gồm thông tin về tour, khách hàng, ngày đặt, số lượng người lớn và trẻ em, tổng giá tiền 