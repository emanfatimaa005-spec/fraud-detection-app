// transactions.js - transaction routes
const express = require('express')
const router = express.Router()
const { addTransaction, getTransactions, getFraudReports } = require('../controllers/transactionController')
const authMiddleware = require('../middleware/auth')
const { check } = require('express-validator')

// @route   POST /api/transactions
router.post('/', authMiddleware, [
  check('amount', 'Amount is required').isNumeric(),
  check('transactionType', 'Transaction type is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty(),
  check('merchantName', 'Merchant name is required').not().isEmpty()
], addTransaction)

// @route   GET /api/transactions
router.get('/', authMiddleware, getTransactions)

// @route   GET /api/transactions/fraud-reports
router.get('/fraud-reports', authMiddleware, getFraudReports)

module.exports = router