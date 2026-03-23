const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Vehicle make is required (e.g., Hyundai, Maruti Suzuki)'],
    trim: true,
    index: true // Indexed for faster dropdown filtering
  },
  modelName: { 
    type: String,
    required: [true, 'Vehicle model name is required (e.g., Creta, Swift)'],
    trim: true,
    index: true
  },
  startYear: {
    type: Number,
    required: [true, 'Production start year is required'],
    min: [1990, 'Year must be valid'],
    max: [new Date().getFullYear() + 1, 'Year cannot be too far in the future']
  },
  endYear: {
    type: Number,
    default: null // If null, the car is currently still in production
  },
  
  // --- THE RELATIONAL MAPPING ---
  // This establishes the Many-to-Many relationship with the 3D Parts inventory
  compatibleParts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Part'
  }]
}, {
  timestamps: true // Automatically handles createdAt and updatedAt
});

// Compound Index: Ensures we don't accidentally seed duplicate vehicles 
// (e.g., creating two "Hyundai Creta 2020" entries)
carModelSchema.index({ make: 1, modelName: 1, startYear: 1 }, { unique: true });

module.exports = mongoose.model('CarModel', carModelSchema);