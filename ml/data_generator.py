import pandas as pd
import random

# 1. Indian Car Segments & Pricing Multipliers
car_segments = {
    "Budget (Hatchback/Small)": {
        "models": ["Maruti Alto", "Swift", "WagonR", "Hyundai i10", "Tata Tiago", "Kwid", "Santro", "Celerio", "Eon", "Ignis"],
        "multiplier": 1.0
    },
    "Mid-Range (Sedan/Compact SUV)": {
        "models": ["Honda City", "Verna", "Creta", "Brezza", "Nexon", "Kia Seltos", "Scorpio", "Thar", "Ciaz", "Venue", "XUV300"],
        "multiplier": 1.4
    },
    "Premium (SUV/Luxury Sedan)": {
        "models": ["Toyota Fortuner", "Innova Crysta", "XUV700", "Harrier", "Jeep Compass", "Octavia", "Tiguan", "Safari"],
        "multiplier": 2.2
    },
    "Luxury (High End)": {
        "models": ["BMW", "Audi", "Mercedes", "Jaguar", "Land Rover", "Volvo", "Porsche", "Lexus"],
        "multiplier": 4.5
    }
}

# 2. Detailed Service Menu (Base Price in INR)
services = {
    "General Service": 3500, "Standard Checkup": 800, "Oil Change (Synthetic)": 2800, "Oil Change (Mineral)": 1500,
    "Full Car Wash": 450, "Deep Interior Cleaning": 1200, "Teflon Coating": 4500, "Ceramic Coating": 12000,
    "AC Gas Refill": 1800, "AC Service & Cleaning": 2500, "Battery Replacement": 4500,
    "Headlight Bulb Change": 600, "Headlight Assembly Replacement": 3500, "Horn Repair": 400,
    "Wheel Alignment": 400, "Wheel Balancing": 500, "Tyre Replacement (Per Tyre)": 3500,
    "Brake Pad Replacement": 1800, "Disc Turning": 900,
    "Bumper Paint": 2500, "Door Dent Removal": 1500, "Full Body Paint": 25000, "Scratch Remover": 800,
    "Clutch Plate Replacement": 6000, "Suspension Overhaul": 8000, "Engine Tuning": 1500,
    "Gearbox Repair": 12000, "Coolant Top-up": 300, "Wiper Blades": 500, "Spark Plug Replacement": 400
}

# 3. Enhanced Templates
templates = [
    "I need a {service} for my {car}", "{service} cost for {car}", "My {car} needs {service}",
    "Price of {service} in {car}", "Do you do {service} for {car}?", "{car} {service}",
    "Urgent {service} required for {car}", "Estimate for {service} on {car}",
    "How much is {service} for {car}?", "Cost to fix {service} on {car}"
]

data = []

print("🚀 Generating 15,000 realistic data points...")

# Generate 15,000 examples
for _ in range(15000):
    segment_name = random.choice(list(car_segments.keys()))
    segment_data = car_segments[segment_name]
    car_model = random.choice(segment_data["models"])
    price_multiplier = segment_data["multiplier"]
    
    service_name, base_price = random.choice(list(services.items()))
    
    # Reduced Noise: Fluctuation is now only +/- 5% (0.95 to 1.05)
    # This makes the data cleaner and easier for the AI to learn perfectly
    fluctuation = random.uniform(0.95, 1.05) 
    final_price = base_price * price_multiplier * fluctuation
    
    final_price = round(final_price / 50) * 50
    
    template = random.choice(templates)
    text = template.format(service=service_name, car=car_model)
    
    # Add generic queries (no car model mentioned)
    if random.random() < 0.15: 
        text = f"How much for {service_name}?"
        final_price = base_price * 1.2 * fluctuation # Standard average price
        final_price = round(final_price / 50) * 50

    data.append([text, final_price])

df = pd.DataFrame(data, columns=["description", "estimated_price"])
df.to_csv("car_repair_dataset.csv", index=False)

print(f"✅ Success! Dataset with {len(df)} rows created.")