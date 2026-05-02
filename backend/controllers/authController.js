// authController.js - handles user registration and login
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

// @route   POST /api/auth/register
// @desc    Register a new user
const registerUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create new user
    user = new User({ name, email, password })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save user to database
    await user.save()

    // Create JWT token
    const payload = { user: { id: user.id } }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.status(201).json({ token, message: 'User registered successfully' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// @route   POST /api/auth/login
// @desc    Login user and return token
const loginUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    // Check if user exists
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Create JWT token
    const payload = { user: { id: user.id } }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.json({ token, message: 'Login successful' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { registerUser, loginUser }