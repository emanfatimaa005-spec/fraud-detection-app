// FraudReport model - stores fraud analysis results and rankings
const mongoose = require('mongoose')

const fraudReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  riskScore: {
    type: Number,
    required: true
  },
  reasons: {
    type: [String],
    default: []
  },
  rank: {
    type: Number,
    default: 0
  },
  resolvedStatus: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('FraudReport', fraudReportSchema)