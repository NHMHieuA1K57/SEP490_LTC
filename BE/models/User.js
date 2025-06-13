const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, sparse: true },
  password: { type: String, required: function() { return !this.googleId; } },
  role: { 
    type: String, 
    enum: ['customer', 'hotel_owner', 'tour_provider', 'admin'], 
    default: 'customer', 
    required: true 
  },
  name: { type: String, required: true },
  profile: {
    avatar: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    updatedAt: { type: Date, default: Date.now }
  },
  googleId: { type: String, sparse: true },
  status: { type: String, enum: ['active', 'pending', 'banned'], default: 'pending' },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  businessType: { 
    type: String, 
    enum: ['hotel_owner', 'tour_provider'], 
    required: function() { return this.role === 'hotel_owner' || this.role === 'tour_provider'; } 
  },
  taxId: { type: String, sparse: true },
  businessLicenseImage: { type: String, sparse: true },
  isBusinessVerified: { 
    type: Boolean, 
    default: false, 
    required: function() { return this.role === 'hotel_owner' || this.role === 'tour_provider'; } 
  }
}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (this.role === 'hotel_owner' || this.role === 'tour_provider') {
    if (!this.taxId && !this.businessLicenseImage) {
      return next(new Error('Phải cung cấp ít nhất mã số thuế hoặc hình ảnh giấy phép kinh doanh'));
    }
  }
  next();
});

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ lastLogin: 1 });

module.exports = mongoose.model('User', UserSchema);