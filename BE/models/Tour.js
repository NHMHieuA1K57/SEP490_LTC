const mongoose = require('mongoose');
const { Schema } = mongoose;

/* --- Sub-schemas (no _id) --- */

// Khách sạn đưa vào tour (inline metadata)
const InlineHotelSchema = new Schema({
  name: { type: String },
  address: { type: String },
  stars: { type: Number },
  link: { type: String }
}, { _id: false });

// Phương tiện
const TransportSchema = new Schema({
  type: { type: String },         // 'Xe 29 chỗ', 'Limousine', ...
  brand: { type: String },
  licensePlate: { type: String },
  provider: { type: String }
}, { _id: false });

// Bữa ăn theo ngày
const MealSchema = new Schema({
  day: { type: Number, required: true },
  breakfast: { type: String },
  lunch: { type: String },
  dinner: { type: String }
}, { _id: false });

// Lịch khởi hành (để nguyên _id mặc định cho từng phần tử)
const AvailabilitySchema = new Schema({
  date: { type: Date, required: true },                     // ngày đi
  endDate: { type: Date },                                  // ngày về (optional)
  time: { type: String },                                   // giờ khởi hành
  timeSlot: { type: String },                               // dùng cho half-day
  meetLocation: { type: String },                           // điểm tập trung
  slots: { type: Number, required: true },                  // số chỗ tối đa
  status: { type: String, enum: ['available', 'full', 'cancelled'], default: 'available' },
  guideId: { type: Schema.Types.ObjectId, ref: 'User' },    // hướng dẫn viên (nếu có)
  isPrivate: { type: Boolean, default: false }              // nếu đã được đặt riêng
});

// Additional info
const PoliciesSchema = new Schema({
  cancellation: { type: String },
  depositRequired: { type: Boolean, default: false }
}, { _id: false });

const ContactSchema = new Schema({
  phone: { type: String },
  email: { type: String }
}, { _id: false });

const AdditionalInfoSchema = new Schema({
  policies: PoliciesSchema,
  contact: ContactSchema,
  payoutPolicy: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    default: 'monthly'
  }
}, { _id: false });

/* --- Main schema --- */

const TourSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },

  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  itinerary: [{
    day: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String }
  }],

  // Bổ sung chi tiết từ phiên bản mới
  meals: [MealSchema],
  hotels: [InlineHotelSchema],
  transport: TransportSchema,

  duration: { type: String, required: true },                      // '3N2Đ' | 'half-day'...
  type: { type: String, enum: ['multi-day', 'half-day'], required: true },

  serviceType: {
    type: String,
    enum: ['guided_tour', 'transport_only', 'ticket', 'combo'],
    default: 'guided_tour'
  },
  hasGuide: { type: Boolean, default: true },
  allowPrivateBooking: { type: Boolean, default: false },

  // Giá
  price: { type: Number, required: true },
  priceAdult: { type: Number },
  priceChild: { type: Number },

  availability: [AvailabilitySchema],

  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },

  // Giữ lại block additionalInfo từ bản cũ
  additionalInfo: AdditionalInfoSchema

}, { timestamps: true });

/* --- Indexes --- */
TourSchema.index({ providerId: 1 });
TourSchema.index({ type: 1 });
TourSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 5, description: 1 } }
);

module.exports = mongoose.models.Tour || mongoose.model('Tour', TourSchema);
