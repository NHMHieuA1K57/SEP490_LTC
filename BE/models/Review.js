const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReplySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
  tourId: { type: Schema.Types.ObjectId, ref: 'Tour' },

  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' }, // verify completed booking

  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  images: [{ type: String }],

  criteria: {
    cleanliness: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },

  helpfulCount: { type: Number, default: 0 },
  replies: [ReplySchema],

  status: { type: String, enum: ['pending', 'published', 'hidden'], default: 'published' }
}, { timestamps: true });

// Một user chỉ review 1 lần / target
ReviewSchema.index(
  { userId: 1, hotelId: 1 },
  { unique: true, partialFilterExpression: { hotelId: { $exists: true } } }
);
ReviewSchema.index(
  { userId: 1, tourId: 1 },
  { unique: true, partialFilterExpression: { tourId: { $exists: true } } }
);

module.exports = mongoose.model('Review', ReviewSchema);
