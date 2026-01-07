const express = require('express');
const router = express.Router();
const User = require('../database/User'); 

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// backend/routes/authRoutes.js
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; 

    // Find user by email OR phone
    const user = await User.findOne({
      $or: [
        { email: identifier }, 
        { phone: identifier }
      ]
    });

    // Check password (ensure it matches exactly what's in the cluster)
    if (user && user.password === password) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        locality: user.locality,
        state: user.state,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Invalid WhatsApp number/Email or Password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;