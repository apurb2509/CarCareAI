const express = require('express');
const router = express.Router();
const User = require('../database/User'); // Import the model you just created

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, locality, pincode, state, password, role } = req.body;

    // 1. Check if user already exists (by phone)
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // 2. Create the user in the database
    const user = await User.create({
      name,
      phone,
      email,
      locality,
      pincode,
      state,
      password, // Note: In the next step we will add security (hashing)
      role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        role: user.role,
        message: 'Registration successful'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;