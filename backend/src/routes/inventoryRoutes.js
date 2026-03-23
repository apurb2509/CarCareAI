const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  getAvailableCars,
  getPartsForCar,
  getInstallersForPart
} = require('../controllers/inventoryController');

/**
 * @route   GET /api/inventory/cars
 * @desc    Fetch all available car makes and models for the dropdown selector
 * @access  Public
 */
router.get('/cars', getAvailableCars);

/**
 * @route   GET /api/inventory/parts/:carId
 * @desc    Fetch all 3D parts compatible with a specific vehicle ID
 * @access  Public
 */
router.get('/parts/:carId', getPartsForCar);

/**
 * @route   GET /api/inventory/installers/:partId
 * @desc    Fetch service stations carrying a specific part (supports ?lat & ?lng queries)
 * @access  Public
 */
router.get('/installers/:partId', getInstallersForPart);

module.exports = router;