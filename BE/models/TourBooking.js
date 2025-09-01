const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  method: {
    type: String,
    enum: ['paypal', 'momo', 'vnpay', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: { type: String }, // Mã giao dịch cổng thanh toán
  paidAt: { type: Date }
}, { _id: false });

const MetaSchema = new Schema({
  tourName: String,
  startDate: Date,
  endDate: Date,
  meetLocation: String,
  time: String,
  timeSlot: String,
  unitPriceAdult: Number,
  unitPriceChild: Number
}, { _id: false });

const TourBookingSchema = new Schema({
  tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  availabilityId: { type: Schema.Types.ObjectId, required: true },

  quantityAdult: { type: Number, default: 1, min: 0 },
  quantityChild: { type: Number, default: 0, min: 0 },
  totalPrice: { type: Number, required: true },

  isPrivateBooking: { type: Boolean, default: false },

  payment: { type: PaymentSchema, default: () => ({ method: 'cash' }) },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: "pending"
  },

  note: { type: String },
  bookedAt: { type: Date, default: Date.now },

  meta: MetaSchema
}, { timestamps: true });

/* Indexes */
TourBookingSchema.index({ customerId: 1, createdAt: -1 });
TourBookingSchema.index({ tourId: 1, createdAt: -1 });
TourBookingSchema.index({ status: 1, createdAt: -1 });
TourBookingSchema.index({ 'payment.status': 1 });

module.exports = mongoose.models.TourBooking || mongoose.model("TourBooking", TourBookingSchema);
