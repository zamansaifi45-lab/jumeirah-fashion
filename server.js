const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Environment variables load karein
dotenv.config();

// Database connect karein
connectDB();

const app = express();

// --- SECURE CORS CONFIGURATION ---
// Hum yahan 'origin: "*"' use kar rahe hain taaki koi bhi request block na ho
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// JSON Data parse karne ke liye (Profile pic ke liye 10mb limit set ki hai)
app.use(express.json({ limit: '10mb' }));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Test Route
app.get('/', (req, res) => {
    res.send('✅ Jumeirha Fashion Backend Server is live and secure!');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running securely on port ${PORT}`);
    console.log(`🔒 End-to-End Environment ready for connections.`);
});