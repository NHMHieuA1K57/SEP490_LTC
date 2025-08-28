const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConversationSchema = new Schema({
  bookingId:   { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId:  { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  providerId:  { type: Schema.Types.ObjectId, ref: 'User',   required: true }, // owner hotel/tour
  isClosed:    { type: Boolean, default: false },            // auto true khi booking completed/cancelled
  lastMessageAt:{ type: Date }
}, { timestamps: true });

ConversationSchema.index({ bookingId: 1 }, { unique: true }); // 1 booking = 1 conversation
ConversationSchema.index({ providerId: 1, lastMessageAt: -1 });
ConversationSchema.index({ customerId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema);
