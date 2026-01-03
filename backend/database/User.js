const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true, // Prevents two users from using the same WhatsApp number
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please add a email'],
  },
  locality: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],

  },
  role: {
    type: String,
    enum: ['user', 'service'], // Matches your UI options
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
