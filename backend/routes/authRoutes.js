const express = require('express');
const router = express.Router();
const User = require('../database/User');
const bcrypt = require('bcryptjs'); // Import bcrypt

// ==========================================
// 1. REGISTER ROUTE
// ==========================================
router.post('/register', async (req, res) => {
  try {
    let { name, phone, email, locality, pincode, state, password, role } = req.body;

    // Clean inputs
    if (email) email = email.trim().toLowerCase();
    if (phone) phone = phone.trim();
    if (password) password = password.trim(); 

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // NOTE: Your User model likely hashes the password automatically upon save.
    // So we just pass the plain password here.
    const user = await User.create({
      name, phone, email, locality, pincode, state, password, role
    });

    if (user) {
      console.log(`✅ Registered: ${user.name}`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'Registration successful'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ==========================================
// 2. LOGIN ROUTE (Fixed for Hashed Passwords)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    let { identifier, password } = req.body; 

    // Clean inputs
    identifier = identifier ? identifier.trim().toLowerCase() : "";
    password = password ? password.trim() : "";

    console.log(`🔍 Login Attempt: ${identifier}`);

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };

    const user = await User.findOne(query);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // --- CRITICAL FIX: Use bcrypt to compare ---
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch (Hash comparison failed)");
      return res.status(401).json({ message: "Invalid password." });
    }

    console.log(`✅ Logged in: ${user.name}`);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      locality: user.locality,
      pincode: user.pincode,
      state: user.state,
      role: user.role,
      message: 'Login successful'
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;