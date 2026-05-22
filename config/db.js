const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Naye Mongoose version mein sirf MONGO_URI dena kafi hai
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to database: ${error.message}`);
        process.exit(1); // Agar error aaye toh server rok do
    }
};

module.exports = connectDB;