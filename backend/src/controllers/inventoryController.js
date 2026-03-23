const CarModel = require('../models/CarModel');
const Part = require('../models/Part');
const ServiceStation = require('../models/ServiceStation');

/**
 * @desc    Get all unique car makes and models for the Garage selector
 * @route   GET /api/inventory/cars
 * @access  Public
 */
const getAvailableCars = async (req, res) => {
  try {
    // Fetch all cars, sorted alphabetically by Make and then Model
    const cars = await CarModel.find()
      .select('make modelName startYear endYear')
      .sort({ make: 1, modelName: 1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching vehicles.' });
  }
};

/**
 * @desc    Get all 3D parts compatible with a specific CarModel ID
 * @route   GET /api/inventory/parts/:carId
 * @access  Public
 */
const getPartsForCar = async (req, res) => {
  try {
    const { carId } = req.params;

    // Find all parts where the 'compatibleVehicles' array includes this carId.
    // We sort by category so the frontend can easily group them (e.g., Engine, Brakes).
    const parts = await Part.find({ compatibleVehicles: carId })
      .select('-compatibleVehicles -installers') // Exclude heavy relation arrays to keep payload light
      .sort({ category: 1, name: 1 });

    if (!parts || parts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No parts found for this vehicle.' 
      });
    }

    res.status(200).json({
      success: true,
      count: parts.length,
      data: parts
    });
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching compatible parts.' });
  }
};

/**
 * @desc    Find Service Stations that have a specific part, sorted by distance
 * @route   GET /api/inventory/installers/:partId
 * @access  Public
 * @query   ?lat=20.2961&lng=85.8245 (e.g., Bhubaneswar coordinates)
 */
const getInstallersForPart = async (req, res) => {
  try {
    const { partId } = req.params;
    const { lat, lng } = req.query;

    let query = { 'inventory.part': partId };

    // If the frontend passes the user's latitude and longitude, use Geospatial sorting
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // GeoJSON is strictly [longitude, latitude]
          },
          // Optional: Restrict search to 50km radius (50,000 meters)
          $maxDistance: 50000 
        }
      };
    }

    // Fetch the stations
    const stations = await ServiceStation.find(query)
      .select('name address location contactNumber rating inventory');

    if (!stations || stations.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No service stations found carrying this part.' 
      });
    }

    // Data formatting: The frontend only cares about the price/stock of THIS specific part, 
    // not the station's entire inventory of 50+ items. Let's filter it down before sending.
    const formattedStations = stations.map(station => {
      // Isolate the specific part in the inventory array
      const specificPartData = station.inventory.find(
        item => item.part.toString() === partId
      );

      return {
        _id: station._id,
        name: station.name,
        address: station.address,
        contactNumber: station.contactNumber,
        rating: station.rating,
        location: station.location,
        pricing: specificPartData ? specificPartData.installationPrice : null,
        inStock: specificPartData ? specificPartData.inStock : false
      };
    });

    res.status(200).json({
      success: true,
      count: formattedStations.length,
      data: formattedStations
    });
  } catch (error) {
    console.error('Error fetching installers:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching service stations.' });
  }
};

module.exports = {
  getAvailableCars,
  getPartsForCar,
  getInstallersForPart
};