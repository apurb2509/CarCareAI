const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The customer who booked
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The service station/garage receiving the booking
    required: true
  },
  date: {
    type: String, // Storing as String for simple format (YYYY-MM-DD)
    required: true
  },
  time: {
    type: String, // e.g., "10:00 AM"
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  serviceDetails: {
    serviceName: { type: String, required: true }, // e.g., "General Service"
    price: { type: String }, // e.g., "₹499"
    type: { type: String, enum: ['Service', 'Part'] } // To distinguish bookings
  },
  vehicleDetails: {
    carModel: { type: String, default: "Unknown Car" }, // e.g., "Hyundai Creta"
    carNumber: { type: String, default: "" } // e.g., "KA 05 AB 1234"
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);