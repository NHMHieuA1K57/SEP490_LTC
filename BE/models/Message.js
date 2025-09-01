const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId:       { type: Schema.Types.ObjectId, ref: 'User', required: true }, // customer hoặc provider
  text:           { type: String, trim: true },
  attachments:    [{ url: String, name: String, mime: String, size: Number }],
  readBy:         [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
