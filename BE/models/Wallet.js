const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  withdrawalRequests: [{
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    transactionId: { type: String },
  }],
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// WalletSchema.index({ userId: 1 });

module.exports = mongoose.model('Wallet', WalletSchema);