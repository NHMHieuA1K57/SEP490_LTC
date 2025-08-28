const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeliverySchema = new Schema({
  notificationId: { type: Schema.Types.ObjectId, ref: 'Notification', required: true },
  userId:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status:         { type: String, enum: ['unread','read','archived'], default: 'unread' },
  readAt:         { type: Date }
}, { timestamps: true });

DeliverySchema.index({ userId: 1, createdAt: -1 });                   // paginate theo user
DeliverySchema.index({ notificationId: 1, userId: 1 }, { unique: true }); // 1 user nhận 1 bản

module.exports = mongoose.model('NotificationDelivery', DeliverySchema);
