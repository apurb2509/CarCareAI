const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this service to the specific Service Partner
    required: true
  },
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String, // Using String to verify currency symbols (e.g., "₹1,499")
    required: true
  },
  type: {
    type: String,
    enum: ['Service', 'Part'], // specific types allowed
    required: true
  },
  stock: {
    type: Number,
    default: 0 // Only relevant for 'Part' type, defaults to 0
  },
  description: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);