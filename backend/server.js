const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const authRoutes = require('./routes/auth')
const transactionRoutes = require('./routes/transactions')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(logger)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected to frauddb'))
  .catch((err) => console.log('❌ MongoDB Error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Fraud Detection API is running!' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ message: 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`))