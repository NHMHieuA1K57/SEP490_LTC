const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  balance: { type: Number, default: 0 }, 
  type: { type: String, enum: ['website', 'partner'], required: true }, 
  transactions: [{
    amount: Number,
    type: { type: String, enum: ['credit', 'debit'] },
    description: String,
    createdAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wallet', walletSchema);