const mongoose = require('mongoose');

const serviceStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required (e.g., Sharma Auto Diagnostics)'],
    trim: true,
    index: true
  },
  
  // --- LOCATION & MAPPING (For "Find Installers Near Me") ---
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true, index: true }, // e.g., Mumbai, Bangalore, Bhubaneswar
    state: { type: String, required: true },
    pinCode: { type: String, required: true }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  // --- SPECIALIZATION & BRANDING ---
  // This is how the seeding algorithm will know which 3D parts to assign to this shop
  specializations: [{
    type: String,
    enum: [
      'General Maintenance',
      'Engine Specialists',
      'Brake & Suspension',
      'Electrical Diagnostics',
      'Body & Paint',
      'Exhaust & Emissions'
    ]
  }],
  
  isAuthorizedDealer: {
    type: Boolean,
    default: false // True for brand-specific centers, false for independent local shops
  },

  // --- THE INVENTORY RELATIONAL MAPPING ---
  // Instead of just an array of IDs, we use a sub-document to track price and stock
  // for the specific 3D parts this station carries.
  inventory: [{
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      required: true
    },
    installationPrice: {
      type: Number,
      required: true // e.g., ₹1500 for brake pad installation
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],

  // --- METADATA ---
  contactNumber: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// --- CRITICAL DATABASE INDEXES ---
// 1. 2dsphere index for Geospatial queries (e.g., "Find shops within 10km of user")
serviceStationSchema.index({ location: '2dsphere' });

// 2. Compound index to quickly find shops in a specific city with a specific specialization
serviceStationSchema.index({ 'address.city': 1, specializations: 1 });

module.exports = mongoose.model('ServiceStation', serviceStationSchema);