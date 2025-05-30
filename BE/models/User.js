const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Users Model: Lưu thông tin người dùng (khách hàng, chủ cơ sở lưu trú, nhà cung cấp tour, admin)
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, sparse: true },
  password: { type: String, required: function() { return !this.googleId && !this.facebookId; } },
  role: { type: String, enum: ['customer', 'hotel_owner', 'tour_provider', 'admin'], required: true },
  name: { type: String, required: true },
  profile: {
    avatar: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    updatedAt: { type: Date, default: Date.now }
  },
  googleId: { type: String, sparse: true },
  facebookId: { type: String, sparse: true },
  status: { type: String, enum: ['active', 'pending', 'banned'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}, { timestamps: true });

UserSchema.index({ role: 1 });

module.exports = mongoose.model('User', UserSchema);