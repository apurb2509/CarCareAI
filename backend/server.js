const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db'); // Points to your new connection file
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const app = express();

// 1. Initialize Database Connection
connectDB();

// 2. Essential Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows backend to read JSON data from signup
app.use('/api/auth', authRoutes);
// 3. Simple Test Route
app.get('/', (req, res) => {
  res.send('CarCareAI API is running...');
});

// 4. (Future) We will link your chatbot and signup routes here

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Main Server running on port ${PORT}`);
});