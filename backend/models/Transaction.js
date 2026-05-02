// Transaction model - stores financial transactions for fraud analysis
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['purchase', 'transfer', 'withdrawal', 'deposit'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  merchantName: {
    type: String,
    required: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  fraudScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)