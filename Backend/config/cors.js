/*
This script configures the database connection.
It connects to MongoDB using Mongoose and loads database credentials
from .env for security.
*/

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Database connection function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,  // Prevents deprecated URL parsing
            useUnifiedTopology: true,  // Ensures stable connection handling
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of waiting forever
        });

        console.log("✅ MongoDB Connected!");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1); // Exit the process if the database connection fails
    }
};

// Export the connection function
module.exports = connectDB;
