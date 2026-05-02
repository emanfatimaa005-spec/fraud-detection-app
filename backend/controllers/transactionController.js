// transactionController.js - handles transaction and fraud detection logic
const Transaction = require('../models/Transaction')
const FraudReport = require('../models/FraudReport')
const { validationResult } = require('express-validator')

// @route   POST /api/transactions
// @desc    Add a new transaction and analyze for fraud
const addTransaction = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { amount, transactionType, location, merchantName } = req.body

  try {
    // Create new transaction
    const transaction = new Transaction({
      user: req.user.id,
      amount,
      transactionType,
      location,
      merchantName
    })

    // Fraud detection logic - calculate fraud score
    let fraudScore = 0
    const reasons = []

    // Rule 1 - high amount
    if (amount > 10000) {
      fraudScore += 40
      reasons.push('Transaction amount exceeds $10,000')
    } else if (amount > 5000) {
      fraudScore += 20
      reasons.push('Transaction amount exceeds $5,000')
    }

    // Rule 2 - suspicious location
    const suspiciousLocations = ['unknown', 'foreign', 'offshore']
    if (suspiciousLocations.includes(location.toLowerCase())) {
      fraudScore += 30
      reasons.push('Transaction from suspicious location')
    }

    // Rule 3 - withdrawal type is riskier
    if (transactionType === 'withdrawal') {
      fraudScore += 20
      reasons.push('High risk transaction type: withdrawal')
    }

    // Set fraud flag
    if (fraudScore >= 50) {
      transaction.isFlagged = true
    }
    transaction.fraudScore = fraudScore

    // Save transaction
    await transaction.save()

    // Create fraud report if flagged
    if (transaction.isFlagged) {
      const riskLevel = fraudScore >= 70 ? 'high' : fraudScore >= 50 ? 'medium' : 'low'

      const fraudReport = new FraudReport({
        user: req.user.id,
        transaction: transaction._id,
        riskLevel,
        riskScore: fraudScore,
        reasons
      })

      await fraudReport.save()
    }

    res.status(201).json({
      transaction,
      message: transaction.isFlagged
        ? 'Transaction flagged for fraud!'
        : 'Transaction added successfully'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// @route   GET /api/transactions
// @desc    Get all transactions for logged in user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(transactions)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// @route   GET /api/transactions/fraud-reports
// @desc    Get all fraud reports with rankings
const getFraudReports = async (req, res) => {
  try {
    const reports = await FraudReport.find({ user: req.user.id })
      .populate('transaction')
      .sort({ riskScore: -1 })

    // Add ranking to each report
    const rankedReports = reports.map((report, index) => ({
      ...report.toObject(),
      rank: index + 1
    }))

    res.json(rankedReports)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { addTransaction, getTransactions, getFraudReports }