const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Hotels Model: Lưu thông tin khách sạn/nhà nghỉ
const HotelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  rooms: [{
    roomType: { type: String, required: true },
    price: { type: Number, required: true },
    availability: [{
      date: { type: Date, required: true },
      quantity: { type: Number, required: true }
    }],
    description: { type: String }
  }],
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for geospatial and owner queries
HotelSchema.index({ location: '2dsphere' });
HotelSchema.index({ ownerId: 1 });

module.exports = mongoose.model('Hotel', HotelSchema);