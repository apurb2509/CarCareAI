const mongoose = require('mongoose');
require('dotenv').config(); // Ensure you have your MONGO_URI in a .env file

// Import Models
const CarModel = require('../models/CarModel');
const Part = require('../models/Part');
const ServiceStation = require('../models/ServiceStation');

// ==========================================
// 1. DATA DICTIONARIES
// ==========================================

const seedCars = [
  { make: 'Hyundai', modelName: 'Creta', startYear: 2020, endYear: null },
  { make: 'Maruti Suzuki', modelName: 'Swift', startYear: 2018, endYear: null },
  { make: 'Tata', modelName: 'Nexon', startYear: 2017, endYear: null },
  { make: 'Mahindra', modelName: 'XUV700', startYear: 2021, endYear: null },
  { make: 'Honda', modelName: 'City', startYear: 2020, endYear: null }
];

// 50 High-Quality 3D Parts Categorized
const seedParts = [
  // Powertrain (10)
  { name: 'Iridium Spark Plug Set', category: 'Powertrain', shortDescription: 'High-performance ignition.', detailedFunction: 'Ignites the air/fuel mixture in the combustion chamber with high efficiency.', modelUrl: 'https://cdn.example.com/3d/spark_plug.glb' },
  { name: 'Copper Spark Plug', category: 'Powertrain', shortDescription: 'Standard ignition plug.', detailedFunction: 'Reliable everyday spark plug for standard combustion engines.', modelUrl: 'https://cdn.example.com/3d/spark_plug_copper.glb' },
  { name: 'Ignition Coil', category: 'Powertrain', shortDescription: 'Converts low voltage to high.', detailedFunction: 'Transforms battery voltage to the thousands of volts needed to create an electric spark.', modelUrl: 'https://cdn.example.com/3d/ignition_coil.glb' },
  { name: 'Timing Belt', category: 'Powertrain', shortDescription: 'Synchronizes engine rotation.', detailedFunction: 'Controls the timing of the engine valves, ensuring they open and close accurately.', modelUrl: 'https://cdn.example.com/3d/timing_belt.glb' },
  { name: 'Drive Belt', category: 'Powertrain', shortDescription: 'Powers engine accessories.', detailedFunction: 'Drives the alternator, power steering pump, and water pump.', modelUrl: 'https://cdn.example.com/3d/drive_belt.glb' },
  { name: 'Premium Oil Filter', category: 'Powertrain', shortDescription: 'Removes engine oil contaminants.', detailedFunction: 'Filters out metallic particles and sludge to keep engine oil clean.', modelUrl: 'https://cdn.example.com/3d/oil_filter.glb' },
  { name: 'Fuel Filter', category: 'Powertrain', shortDescription: 'Cleans fuel before combustion.', detailedFunction: 'Screens out dirt and rust particles from the fuel.', modelUrl: 'https://cdn.example.com/3d/fuel_filter.glb' },
  { name: 'Air Filter', category: 'Powertrain', shortDescription: 'Prevents debris from entering engine.', detailedFunction: 'Ensures clean air reaches the engine for optimal combustion.', modelUrl: 'https://cdn.example.com/3d/air_filter.glb' },
  { name: 'Fuel Injector', category: 'Powertrain', shortDescription: 'Sprays fuel into the engine.', detailedFunction: 'Delivers a precise mist of fuel directly into the combustion chamber.', modelUrl: 'https://cdn.example.com/3d/fuel_injector.glb' },
  { name: 'Water Pump', category: 'Powertrain', shortDescription: 'Circulates engine coolant.', detailedFunction: 'Pushes coolant from the radiator through the engine to prevent overheating.', modelUrl: 'https://cdn.example.com/3d/water_pump.glb' },
  
  // Braking System (10)
  { name: 'Ceramic Front Brake Pads', category: 'Braking System', shortDescription: 'Low dust, high stopping power.', detailedFunction: 'Creates friction against the rotor to stop the vehicle, producing less noise and dust.', modelUrl: 'https://cdn.example.com/3d/brake_pad_ceramic.glb' },
  { name: 'Semi-Metallic Rear Pads', category: 'Braking System', shortDescription: 'Durable rear stopping power.', detailedFunction: 'Heavy-duty friction material for standard braking.', modelUrl: 'https://cdn.example.com/3d/brake_pad_semi.glb' },
  { name: 'Vented Front Rotor', category: 'Braking System', shortDescription: 'Heat-dissipating brake disc.', detailedFunction: 'The main contact surface for brake pads, vented to release extreme heat.', modelUrl: 'https://cdn.example.com/3d/rotor_vented.glb' },
  { name: 'Solid Rear Rotor', category: 'Braking System', shortDescription: 'Standard rear brake disc.', detailedFunction: 'Provides consistent stopping power for the rear axle.', modelUrl: 'https://cdn.example.com/3d/rotor_solid.glb' },
  { name: 'Slotted Performance Rotor', category: 'Braking System', shortDescription: 'Enhanced bite and cooling.', detailedFunction: 'Slots sweep away gas and dust to maintain maximum pad contact.', modelUrl: 'https://cdn.example.com/3d/rotor_slotted.glb' },
  { name: 'Brake Caliper (Left)', category: 'Braking System', shortDescription: 'Houses brake pads and pistons.', detailedFunction: 'Squeezes the brake pads against the rotor using hydraulic pressure.', modelUrl: 'https://cdn.example.com/3d/caliper_left.glb' },
  { name: 'Brake Caliper (Right)', category: 'Braking System', shortDescription: 'Houses brake pads and pistons.', detailedFunction: 'Squeezes the brake pads against the rotor using hydraulic pressure.', modelUrl: 'https://cdn.example.com/3d/caliper_right.glb' },
  { name: 'Brake Master Cylinder', category: 'Braking System', shortDescription: 'Generates hydraulic pressure.', detailedFunction: 'Converts the pressure of your foot on the brake pedal into hydraulic force.', modelUrl: 'https://cdn.example.com/3d/master_cylinder.glb' },
  { name: 'ABS Control Module', category: 'Braking System', shortDescription: 'Prevents wheel lockup.', detailedFunction: 'Rapidly pulses the brakes during emergency stops to maintain steering control.', modelUrl: 'https://cdn.example.com/3d/abs_module.glb' },
  { name: 'Stainless Brake Lines', category: 'Braking System', shortDescription: 'Durable hydraulic fluid transport.', detailedFunction: 'Carries brake fluid from the master cylinder to the calipers without expanding.', modelUrl: 'https://cdn.example.com/3d/brake_lines.glb' },

  // Suspension & Steering (10)
  { name: 'Front Strut Assembly', category: 'Suspension & Steering', shortDescription: 'Absorbs road impacts.', detailedFunction: 'Combines a shock absorber and coil spring into one structural unit.', modelUrl: 'https://cdn.example.com/3d/strut_front.glb' },
  { name: 'Rear Shock Absorber', category: 'Suspension & Steering', shortDescription: 'Dampens bounce.', detailedFunction: 'Controls the rebound of the suspension springs.', modelUrl: 'https://cdn.example.com/3d/shock_rear.glb' },
  { name: 'Heavy Duty Coil Spring', category: 'Suspension & Steering', shortDescription: 'Supports vehicle weight.', detailedFunction: 'Compresses to absorb dips and bumps in the road surface.', modelUrl: 'https://cdn.example.com/3d/coil_spring.glb' },
  { name: 'Lower Control Arm', category: 'Suspension & Steering', shortDescription: 'Connects chassis to wheel hub.', detailedFunction: 'Allows the wheel to move up and down while remaining attached to the car.', modelUrl: 'https://cdn.example.com/3d/control_arm_lower.glb' },
  { name: 'Upper Control Arm', category: 'Suspension & Steering', shortDescription: 'Maintains wheel alignment.', detailedFunction: 'Keeps the wheel vertically aligned during suspension travel.', modelUrl: 'https://cdn.example.com/3d/control_arm_upper.glb' },
  { name: 'Sway Bar Link', category: 'Suspension & Steering', shortDescription: 'Reduces body roll.', detailedFunction: 'Connects the anti-roll bar to the suspension components.', modelUrl: 'https://cdn.example.com/3d/sway_bar_link.glb' },
  { name: 'Outer Tie Rod End', category: 'Suspension & Steering', shortDescription: 'Pushes/pulls wheels to steer.', detailedFunction: 'Connects the steering rack to the steering knuckle.', modelUrl: 'https://cdn.example.com/3d/tie_rod.glb' },
  { name: 'Wheel Bearing Hub', category: 'Suspension & Steering', shortDescription: 'Allows wheel to spin freely.', detailedFunction: 'A set of steel balls held together by a metal ring to reduce friction.', modelUrl: 'https://cdn.example.com/3d/wheel_bearing.glb' },
  { name: 'Power Steering Pump', category: 'Suspension & Steering', shortDescription: 'Pressurizes steering fluid.', detailedFunction: 'Provides hydraulic assistance to make turning the steering wheel easier.', modelUrl: 'https://cdn.example.com/3d/ps_pump.glb' },
  { name: 'Steering Rack', category: 'Suspension & Steering', shortDescription: 'Translates rotation to linear motion.', detailedFunction: 'Turns the rotational movement of the steering wheel into the side-to-side motion of the wheels.', modelUrl: 'https://cdn.example.com/3d/steering_rack.glb' },

  // Cooling System & Exhaust (10)
  { name: 'Aluminum Radiator', category: 'Cooling System', shortDescription: 'Cools hot engine fluid.', detailedFunction: 'Passes hot coolant through thin metal fins to dissipate heat into the air.', modelUrl: 'https://cdn.example.com/3d/radiator.glb' },
  { name: 'Engine Thermostat', category: 'Cooling System', shortDescription: 'Regulates engine temperature.', detailedFunction: 'Opens and closes to control the flow of coolant based on engine heat.', modelUrl: 'https://cdn.example.com/3d/thermostat.glb' },
  { name: 'Coolant Reservoir', category: 'Cooling System', shortDescription: 'Stores excess coolant.', detailedFunction: 'Holds expanding coolant when the engine is hot and returns it when cold.', modelUrl: 'https://cdn.example.com/3d/coolant_tank.glb' },
  { name: 'Cooling Fan Motor', category: 'Cooling System', shortDescription: 'Pulls air through radiator.', detailedFunction: 'Forces airflow across the radiator when the vehicle is moving too slowly to cool naturally.', modelUrl: 'https://cdn.example.com/3d/cooling_fan.glb' },
  { name: 'Catalytic Converter', category: 'Exhaust & Emissions', shortDescription: 'Reduces toxic emissions.', detailedFunction: 'Uses rare metals to trigger a chemical reaction that cleans exhaust gases.', modelUrl: 'https://cdn.example.com/3d/catalytic_converter.glb' },
  { name: 'Stainless Muffler', category: 'Exhaust & Emissions', shortDescription: 'Silences engine noise.', detailedFunction: 'Uses internal baffles to cancel out the loud acoustic waves generated by combustion.', modelUrl: 'https://cdn.example.com/3d/muffler.glb' },
  { name: 'Exhaust Manifold', category: 'Exhaust & Emissions', shortDescription: 'Collects engine gases.', detailedFunction: 'Funnels exhaust from multiple cylinders into a single exhaust pipe.', modelUrl: 'https://cdn.example.com/3d/exhaust_manifold.glb' },
  { name: 'Upstream O2 Sensor', category: 'Electrical & Sensors', shortDescription: 'Measures exhaust oxygen.', detailedFunction: 'Tells the engine computer how much unburned oxygen is in the exhaust before the catalytic converter.', modelUrl: 'https://cdn.example.com/3d/o2_sensor_up.glb' },
  { name: 'Downstream O2 Sensor', category: 'Electrical & Sensors', shortDescription: 'Monitors catalyst health.', detailedFunction: 'Measures oxygen levels after the catalytic converter to ensure it is working.', modelUrl: 'https://cdn.example.com/3d/o2_sensor_down.glb' },
  { name: 'Mass Air Flow Sensor', category: 'Electrical & Sensors', shortDescription: 'Measures incoming air.', detailedFunction: 'Calculates the volume and density of air entering the engine to balance fuel injection.', modelUrl: 'https://cdn.example.com/3d/maf_sensor.glb' },

  // Electrical & Body (10)
  { name: 'High-Output Alternator', category: 'Electrical & Sensors', shortDescription: 'Charges the battery.', detailedFunction: 'Converts mechanical engine energy into electrical energy to run accessories.', modelUrl: 'https://cdn.example.com/3d/alternator.glb' },
  { name: 'Starter Motor', category: 'Electrical & Sensors', shortDescription: 'Cranks the engine.', detailedFunction: 'A powerful electric motor that turns the engine over to begin the combustion cycle.', modelUrl: 'https://cdn.example.com/3d/starter.glb' },
  { name: '12V Lead-Acid Battery', category: 'Electrical & Sensors', shortDescription: 'Stores electrical power.', detailedFunction: 'Provides the initial jolt of electricity needed to power the starter motor.', modelUrl: 'https://cdn.example.com/3d/battery.glb' },
  { name: 'LED Headlight Assembly', category: 'Body & Chassis', shortDescription: 'Illuminates the road.', detailedFunction: 'A complete unit housing ultra-bright LED bulbs and reflectors for night driving.', modelUrl: 'https://cdn.example.com/3d/headlight.glb' },
  { name: 'LED Tail Light', category: 'Body & Chassis', shortDescription: 'Rear signaling cluster.', detailedFunction: 'Houses brake lights, turn signals, and reverse lights.', modelUrl: 'https://cdn.example.com/3d/taillight.glb' },
  { name: 'Front Bumper Cover', category: 'Body & Chassis', shortDescription: 'Aerodynamic fascia.', detailedFunction: 'The plastic outer shell that covers the crash bar and absorbs minor impacts.', modelUrl: 'https://cdn.example.com/3d/bumper_front.glb' },
  { name: 'Side Mirror (Driver)', category: 'Body & Chassis', shortDescription: 'Rearward visibility.', detailedFunction: 'Power-adjustable mirror assembly with integrated turn signal indicator.', modelUrl: 'https://cdn.example.com/3d/mirror_driver.glb' },
  { name: 'Side Mirror (Passenger)', category: 'Body & Chassis', shortDescription: 'Rearward visibility.', detailedFunction: 'Power-adjustable mirror assembly with integrated turn signal indicator.', modelUrl: 'https://cdn.example.com/3d/mirror_passenger.glb' },
  { name: 'Wiper Motor Assembly', category: 'Body & Chassis', shortDescription: 'Drives windshield wipers.', detailedFunction: 'An electric motor and linkage that sweeps the wiper arms across the glass.', modelUrl: 'https://cdn.example.com/3d/wiper_motor.glb' },
  { name: 'Cabin Air Filter', category: 'Body & Chassis', shortDescription: 'Filters interior air.', detailedFunction: 'Removes dust, pollen, and smog from the air entering the passenger cabin.', modelUrl: 'https://cdn.example.com/3d/cabin_filter.glb' }
];

// 25 Realistic Indian Service Stations
const seedStations = [
  { name: 'Kalinga Motors & Diagnostics', address: { street: 'Janpath Road', city: 'Bhubaneswar', state: 'Odisha', pinCode: '751001' }, location: { type: 'Point', coordinates: [85.8315, 20.2706] }, specializations: ['Engine Specialists', 'General Maintenance'], isAuthorizedDealer: false, contactNumber: '+91 98765 43210' },
  { name: 'Rourkela Car Care', address: { street: 'Ring Road', city: 'Rourkela', state: 'Odisha', pinCode: '769001' }, location: { type: 'Point', coordinates: [84.8536, 22.2492] }, specializations: ['Brake & Suspension', 'Body & Paint'], isAuthorizedDealer: false, contactNumber: '+91 98765 43211' },
  { name: 'Cuttack Auto Works', address: { street: 'Link Road', city: 'Cuttack', state: 'Odisha', pinCode: '753012' }, location: { type: 'Point', coordinates: [85.8828, 20.4625] }, specializations: ['Electrical Diagnostics', 'General Maintenance'], isAuthorizedDealer: false, contactNumber: '+91 98765 43212' },
  { name: 'Apex Automotive', address: { street: 'Koramangala 80ft Rd', city: 'Bangalore', state: 'Karnataka', pinCode: '560034' }, location: { type: 'Point', coordinates: [77.6245, 12.9352] }, specializations: ['Engine Specialists', 'Exhaust & Emissions'], isAuthorizedDealer: true, contactNumber: '+91 98765 43213' },
  { name: 'Sharma Auto Works', address: { street: 'Karol Bagh', city: 'Delhi', state: 'Delhi', pinCode: '110005' }, location: { type: 'Point', coordinates: [77.1900, 28.6519] }, specializations: ['Body & Paint', 'General Maintenance'], isAuthorizedDealer: false, contactNumber: '+91 98765 43214' },
  { name: 'Royal Enfield Motors', address: { street: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', pinCode: '400050' }, location: { type: 'Point', coordinates: [72.8333, 19.0596] }, specializations: ['Brake & Suspension', 'Engine Specialists'], isAuthorizedDealer: true, contactNumber: '+91 98765 43215' },
  { name: 'TechTronic Cars', address: { street: 'Hitech City', city: 'Hyderabad', state: 'Telangana', pinCode: '500081' }, location: { type: 'Point', coordinates: [78.3812, 17.4435] }, specializations: ['Electrical Diagnostics', 'Exhaust & Emissions'], isAuthorizedDealer: false, contactNumber: '+91 98765 43216' },
  { name: 'Chennai Speed Shop', address: { street: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pinCode: '600040' }, location: { type: 'Point', coordinates: [80.2116, 13.0850] }, specializations: ['General Maintenance', 'Brake & Suspension'], isAuthorizedDealer: false, contactNumber: '+91 98765 43217' },
  { name: 'Pioneer Service Hub', address: { street: 'Salt Lake Sector V', city: 'Kolkata', state: 'West Bengal', pinCode: '700091' }, location: { type: 'Point', coordinates: [88.4310, 22.5726] }, specializations: ['Engine Specialists', 'Body & Paint'], isAuthorizedDealer: true, contactNumber: '+91 98765 43218' },
  { name: 'Ahmedabad Auto Pro', address: { street: 'SG Highway', city: 'Ahmedabad', state: 'Gujarat', pinCode: '380054' }, location: { type: 'Point', coordinates: [72.5293, 23.0338] }, specializations: ['Electrical Diagnostics', 'General Maintenance'], isAuthorizedDealer: false, contactNumber: '+91 98765 43219' },
  { name: 'Pune Performance', address: { street: 'Koregaon Park', city: 'Pune', state: 'Maharashtra', pinCode: '411001' }, location: { type: 'Point', coordinates: [73.8968, 18.5362] }, specializations: ['Brake & Suspension', 'Exhaust & Emissions'], isAuthorizedDealer: false, contactNumber: '+91 98765 43220' },
  { name: 'Jaipur Motors', address: { street: 'Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', pinCode: '302017' }, location: { type: 'Point', coordinates: [75.8189, 26.8530] }, specializations: ['Body & Paint', 'General Maintenance'], isAuthorizedDealer: true, contactNumber: '+91 98765 43221' },
  { name: 'Lucknow Garage', address: { street: 'Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', pinCode: '226010' }, location: { type: 'Point', coordinates: [80.9990, 26.8550] }, specializations: ['Engine Specialists', 'Electrical Diagnostics'], isAuthorizedDealer: false, contactNumber: '+91 98765 43222' },
  { name: 'Indore Auto Works', address: { street: 'Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', pinCode: '452010' }, location: { type: 'Point', coordinates: [75.8937, 22.7533] }, specializations: ['Brake & Suspension', 'General Maintenance'], isAuthorizedDealer: false, contactNumber: '+91 98765 43223' },
  { name: 'Chandigarh Mechanics', address: { street: 'Sector 17', city: 'Chandigarh', state: 'Chandigarh', pinCode: '160017' }, location: { type: 'Point', coordinates: [76.7794, 30.7333] }, specializations: ['Exhaust & Emissions', 'Engine Specialists'], isAuthorizedDealer: true, contactNumber: '+91 98765 43224' },
  { name: 'Patna Spares & Fix', address: { street: 'Fraser Road', city: 'Patna', state: 'Bihar', pinCode: '800001' }, location: { type: 'Point', coordinates: [85.1376, 25.6111] }, specializations: ['Electrical Diagnostics', 'Body & Paint'], isAuthorizedDealer: false, contactNumber: '+91 98765 43225' },
  { name: 'Bhopal Car Care', address: { street: 'MP Nagar', city: 'Bhopal', state: 'Madhya Pradesh', pinCode: '462011' }, location: { type: 'Point', coordinates: [77.4326, 23.2332] }, specializations: ['General Maintenance', 'Brake & Suspension'], isAuthorizedDealer: false, contactNumber: '+91 98765 43226' },
  { name: 'Surat Auto Hub', address: { street: 'Adajan', city: 'Surat', state: 'Gujarat', pinCode: '395009' }, location: { type: 'Point', coordinates: [72.7933, 21.1950] }, specializations: ['Engine Specialists', 'Electrical Diagnostics'], isAuthorizedDealer: true, contactNumber: '+91 98765 43227' },
  { name: 'Nagpur Diagnostics', address: { street: 'Dharampeth', city: 'Nagpur', state: 'Maharashtra', pinCode: '440010' }, location: { type: 'Point', coordinates: [79.0600, 21.1384] }, specializations: ['Body & Paint', 'Exhaust & Emissions'], isAuthorizedDealer: false, contactNumber: '+91 98765 43228' },
  { name: 'Guwahati Motors', address: { street: 'GS Road', city: 'Guwahati', state: 'Assam', pinCode: '781005' }, location: { type: 'Point', coordinates: [91.7745, 26.1552] }, specializations: ['General Maintenance', 'Brake & Suspension'], isAuthorizedDealer: false, contactNumber: '+91 98765 43229' },
  { name: 'Kochi Auto Fix', address: { street: 'MG Road', city: 'Kochi', state: 'Kerala', pinCode: '682016' }, location: { type: 'Point', coordinates: [76.2822, 9.9732] }, specializations: ['Electrical Diagnostics', 'Engine Specialists'], isAuthorizedDealer: true, contactNumber: '+91 98765 43230' },
  { name: 'Visakhapatnam Car Spa', address: { street: 'Dwaraka Nagar', city: 'Visakhapatnam', state: 'Andhra Pradesh', pinCode: '530016' }, location: { type: 'Point', coordinates: [83.3032, 17.7266] }, specializations: ['Body & Paint', 'General Maintenance'], isAuthorizedDealer: false, contactNumber: '+91 98765 43231' },
  { name: 'Agra Auto Solutions', address: { street: 'Sanjay Place', city: 'Agra', state: 'Uttar Pradesh', pinCode: '282002' }, location: { type: 'Point', coordinates: [78.0061, 27.2014] }, specializations: ['Exhaust & Emissions', 'Brake & Suspension'], isAuthorizedDealer: false, contactNumber: '+91 98765 43232' },
  { name: 'Varanasi Service Point', address: { street: 'Lanka', city: 'Varanasi', state: 'Uttar Pradesh', pinCode: '221005' }, location: { type: 'Point', coordinates: [82.9986, 25.2820] }, specializations: ['Engine Specialists', 'Electrical Diagnostics'], isAuthorizedDealer: true, contactNumber: '+91 98765 43233' },
  { name: 'Madurai Motors', address: { street: 'KK Nagar', city: 'Madurai', state: 'Tamil Nadu', pinCode: '625020' }, location: { type: 'Point', coordinates: [78.1453, 9.9329] }, specializations: ['General Maintenance', 'Body & Paint'], isAuthorizedDealer: false, contactNumber: '+91 98765 43234' }
];

// ==========================================
// 2. SEEDING LOGIC
// ==========================================

const seedDB = async () => {
  try {
    // 1. Connect to Database
await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected. Starting Seed Process...');

    // 2. Clear out the old data to prevent duplication errors
    await CarModel.deleteMany({});
    await Part.deleteMany({});
    await ServiceStation.deleteMany({});
    console.log('🗑️  Cleared existing DB collections.');

    // 3. Insert Cars
    const insertedCars = await CarModel.insertMany(seedCars);
    console.log(`🚗 Inserted ${insertedCars.length} Car Models.`);

    // 4. Insert Parts and map them to vehicles
    // We will randomly assign between 1 and 3 cars to each part to simulate real-world compatibility
    const partsWithVehicles = seedParts.map(part => {
      const numCars = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const shuffledCars = [...insertedCars].sort(() => 0.5 - Math.random());
      const selectedCars = shuffledCars.slice(0, numCars).map(car => car._id);
      
      return { ...part, compatibleVehicles: selectedCars };
    });

    const insertedParts = await Part.insertMany(partsWithVehicles);
    console.log(`⚙️  Inserted ${insertedParts.length} 3D Parts.`);

    // 5. Update the Car Models to back-reference the parts (Many-to-Many resolution)
    for (const part of insertedParts) {
      await CarModel.updateMany(
        { _id: { $in: part.compatibleVehicles } },
        { $push: { compatibleParts: part._id } }
      );
    }
    console.log('🔗 Mapped Parts to Vehicles successfully.');

    // 6. Map the Parts to Service Station Inventories based on Specialization Tags
    const stationsWithInventory = seedStations.map(station => {
      let stationInventory = [];

      station.specializations.forEach(spec => {
        // Map UI specializations to DB Categories
        let categoryMap = [];
        if (spec === 'Engine Specialists') categoryMap = ['Powertrain'];
        if (spec === 'Brake & Suspension') categoryMap = ['Braking System', 'Suspension & Steering'];
        if (spec === 'Electrical Diagnostics') categoryMap = ['Electrical & Sensors'];
        if (spec === 'Exhaust & Emissions') categoryMap = ['Exhaust & Emissions', 'Cooling System'];
        if (spec === 'Body & Paint') categoryMap = ['Body & Chassis'];
        if (spec === 'General Maintenance') categoryMap = ['Powertrain', 'Braking System', 'Cooling System']; // Shops doing basics

        // Find parts that match this station's allowed categories
        const matchingParts = insertedParts.filter(p => categoryMap.includes(p.category));

        // Generate the inventory sub-document
        matchingParts.forEach(part => {
          // Prevent duplicates if a part falls into multiple tags
          if (!stationInventory.some(item => item.part === part._id)) {
            stationInventory.push({
              part: part._id,
              installationPrice: Math.floor(Math.random() * 5000) + 500, // Random price between ₹500 - ₹5500
              inStock: Math.random() > 0.2 // 80% chance it is in stock
            });
          }
        });
      });

      return { ...station, inventory: stationInventory };
    });

    const insertedStations = await ServiceStation.insertMany(stationsWithInventory);
    console.log(`🏪 Inserted ${insertedStations.length} Service Stations with generated inventories.`);

    // 7. Update Parts to back-reference the Installers
    for (const station of insertedStations) {
      const partIds = station.inventory.map(item => item.part);
      await Part.updateMany(
        { _id: { $in: partIds } },
        { $push: { installers: station._id } }
      );
    }
    console.log('🔗 Mapped Installers back to Parts successfully.');

    console.log('🎉 Database seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Execute
seedDB();