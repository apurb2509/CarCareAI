const express = require('express');
const router = express.Router();
const Service = require('../database/Service');
const Booking = require('../database/Booking');
const User = require('../database/User'); // Required to populate partner details

// ==========================================
// 1. ADD SERVICE or PART (Partner Side)
// ==========================================
router.post('/add-service', async (req, res) => {
  try {
    const { partnerId, serviceName, price, type, stock, description } = req.body;

    if (!partnerId || !serviceName || !price || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newService = await Service.create({
      partnerId,
      serviceName,
      price,
      type,
      stock: stock || 0,
      description
    });

    res.status(201).json({ 
      message: `${type} added successfully`, 
      service: newService 
    });

  } catch (error) {
    console.error("❌ Add Service Error:", error);
    res.status(500).json({ message: "Server error while adding service" });
  }
});

// ==========================================
// 2. FIND SERVICES (User Side - Search)
// ==========================================
router.get('/find-services', async (req, res) => {
  try {
    const { search, type } = req.query;

    // Build Query
    let query = {};

    // Filter by Type (Service/Part) if selected
    if (type && type !== "All") {
      query.type = type;
    }

    // Search Logic (Regex for name or description)
    if (search) {
      query.$or = [
        { serviceName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch services and Populate Partner Details (Station Name, Location)
    const services = await Service.find(query)
      .populate('partnerId', 'name locality state phone') // Get specific fields from User model
      .sort({ createdAt: -1 });

    // Format data for Frontend
    const formattedServices = services.map(svc => ({
      id: svc._id,
      stationName: svc.partnerId ? svc.partnerId.name : "Unknown Station",
      location: svc.partnerId ? `${svc.partnerId.locality}, ${svc.partnerId.state}` : "Unknown Location",
      type: svc.type,
      name: svc.serviceName,
      price: svc.price,
      rating: "4.8", // Hardcoded for now, dynamic later
      available: svc.type === 'Service' ? true : (svc.stock > 0)
    }));

    res.status(200).json(formattedServices);

  } catch (error) {
    console.error("❌ Find Services Error:", error);
    res.status(500).json({ message: "Server error while searching" });
  }
});

// ==========================================
// 3. MY BOOKINGS (Partner Side - Incoming)
// ==========================================
router.get('/my-bookings', async (req, res) => {
  try {
    const { partnerId } = req.query;

    if (!partnerId) {
      return res.status(400).json({ message: "Partner ID required" });
    }

    // Find bookings for this partner & populate User details
    const bookings = await Booking.find({ partnerId })
      .populate('userId', 'name phone email') // Get Customer Details
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (error) {
    console.error("❌ Fetch Bookings Error:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
});

// ==========================================
// 4. CREATE BOOKING (User Side)
// ==========================================
// Added this so the "Book Now" button actually works
router.post('/create-booking', async (req, res) => {
  try {
    const { userId, partnerId, date, time, serviceDetails, vehicleDetails } = req.body;

    const newBooking = await Booking.create({
      userId,
      partnerId,
      date,
      time,
      status: 'Pending',
      serviceDetails,
      vehicleDetails
    });

    res.status(201).json({ message: "Booking Request Sent!", booking: newBooking });

  } catch (error) {
    console.error("❌ Create Booking Error:", error);
    res.status(500).json({ message: "Server error creating booking" });
  }
});

module.exports = router;