const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  // phạm vi tạo (ghi nhận nguồn gốc)
  scope: { type: String, enum: ['all', 'role', 'user'], required: true },
  roles: [{ type: String, enum: ['customer','hotel_owner','tour_provider','admin'] }], // dùng khi scope='role'
  targetUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],                         // dùng khi scope='user'

  // nội dung
  type:  { type: String, enum: ['system','order','message','promotion'], required: true },
  title: { type: String, required: true, trim: true },
  body:  { type: String, required: true, trim: true },
  meta:  { type: Schema.Types.Mixed },   // { url, orderId, ... }
  expiresAt: { type: Date },

  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ scope: 1, 'roles.0': 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
