const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tours Model: Lưu thông tin tour du lịch
const TourSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itinerary: [{
    day: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String }
  }],
  duration: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  availability: [{
    date: { type: Date, required: true },
    slots: { type: Number, required: true }
  }],
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for provider and type queries
TourSchema.index({ providerId: 1 });
TourSchema.index({ type: 1 });

module.exports = mongoose.model('Tour', TourSchema);