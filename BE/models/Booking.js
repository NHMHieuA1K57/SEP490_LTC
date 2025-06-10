const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['hotel', 'tour'], required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: function() { return this.type === 'hotel'; } },
  tourId: { type: Schema.Types.ObjectId, ref: 'Tour', required: function() { return this.type === 'tour'; } },
  details: {
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    tourDate: { type: Date },
    numberOfPeople: { type: Number, required: true },
    roomType: { type: String },
    specialRequests: { type: String }
  },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  paymentInfo: {
    bookingCode: { type: String, unique: true, required: true },
    payoutStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
  }
}, { timestamps: true });

// Indices
BookingSchema.index({ userId: 1 });
BookingSchema.index({ hotelId: 1 });
BookingSchema.index({ tourId: 1 });
BookingSchema.index({ 'details.tourDate': 1 });
// BookingSchema.index({ 'paymentInfo.bookingCode': 1 });

module.exports = mongoose.model('Booking', BookingSchema);