const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reports Model: Lưu dữ liệu báo cáo cho admin và nhà cung cấp
const ReportSchema = new Schema({
  type: { type: String, enum: ['hotel_bookings', 'tour_bookings', 'revenue', 'system_overview'], required: true },
  data: {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    tourId: { type: Schema.Types.ObjectId, ref: 'Tour' },
    period: { type: String, required: true },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for creator, hotel, and tour queries
ReportSchema.index({ createdBy: 1 });
ReportSchema.index({ 'data.hotelId': 1 });
ReportSchema.index({ 'data.tourId': 1 });

module.exports = mongoose.model('Report', ReportSchema);