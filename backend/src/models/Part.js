const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Part name is required (e.g., Ceramic Brake Pads)'],
    trim: true,
    index: true // Indexed for quick text searches in the Garage
  },
  
  // --- THE 3D ASSET PIPELINE ---
  // We only store URLs here, never the actual binary files, to keep the DB blazing fast.
  modelUrl: {
    type: String,
    required: [true, 'CDN URL for the 3D model (.gltf or .glb) is required'],
    match: [/^https?:\/\/.+\.(gltf|glb)$/i, 'Must be a valid GLTF/GLB URL']
  },
  // Fallback 2D image while the 3D model is lazy-loading in the browser
  thumbnailUrl: {
    type: String,
    required: false 
  },

  // --- INTERACTION DATA (Frontend Hover States) ---
  shortDescription: {
    type: String,
    required: [true, 'A short description is required for the 3D hover UI'],
    maxLength: [150, 'Keep descriptions concise for the hover tooltip'],
    trim: true
  },
  detailedFunction: {
    type: String,
    required: [true, 'Detailed explanation of what the part does'],
    trim: true
  },

  // --- CATEGORIZATION LOGIC ---
  // Used to dynamically assign parts to Service Stations based on their specialization
  category: {
    type: String,
    required: true,
    enum: [
      'Powertrain', 
      'Suspension & Steering', 
      'Braking System', 
      'Exhaust & Emissions', 
      'Cooling System', 
      'Electrical & Sensors',
      'Body & Chassis'
    ],
    index: true
  },

  // --- RELATIONAL MAPPING ---
  // 1. Which cars can use this part?
  compatibleVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarModel'
  }],
  
  // 2. Which stations currently have this in stock? (For the "Find Installers" button)
  installers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceStation'
  }],

  // Optional: Technical specs to make the UI feel incredibly realistic
  metadata: {
    material: String,
    weightKg: Number,
    estimatedLifespanKm: Number
  }
}, {
  timestamps: true 
});

// Create a compound index to quickly find parts by category for specific cars
partSchema.index({ category: 1, compatibleVehicles: 1 });

module.exports = mongoose.model('Part', partSchema);