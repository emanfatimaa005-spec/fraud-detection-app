// auth.js - authentication routes
const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/authController')
const { check } = require('express-validator')

// @route   POST /api/auth/register
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], registerUser)

// @route   POST /api/auth/login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], loginUser)

module.exports = router