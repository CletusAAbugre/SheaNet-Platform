// /*
// This script is to configurate the database we will be using.
// It will connect to MongoDB using Mongoose and loads database credentials
// from .env for security.
// */
//
// // const mongoose = require('mongoose');
// //
// // const connectDB = async () => {
// //
// //     console.log("Attempting to connect to MongoDB...");
// //
// //     if (!process.env.MONGODB_URI) {
// //         console.error("MONGODB_URI is not defined in .env");
// //         process.exit(1);
// //     }
// //
// //     try {
// //         await mongoose.connect(process.env.MONGODB_URI, {
// //             serverSelectionTimeoutMS: 5000,
// //             socketTimeoutMS: 45000,
// //         });
// //         console.log('MongoDB connected');
// //     } catch (err) {
// //         console.error('Database connection failed:', err);
// //         process.exit(1);
// //     }
// // };
// //
// // module.exports = connectDB;
//
// const mongoose = require('mongoose');
// require('dotenv').config();
//
// const connectDB = async () => {
//     try {
//         // Use the same URI you see in MongoDB Compass
//         const uri = process.env.MONGODB_URI;
//
//         console.log('MongoDB connected!');
//
//         await mongoose.connect(uri, {
//             serverSelectionTimeoutMS: 5000 // 5 second timeout
//         });
//
//         console.log('MongoDB connected via Compass');
//     } catch (err) {
//         console.error('Connection failed. Try this in Compass first!');
//         console.error('Error:', err.message);
//         process.exit(1);
//     }
// };
//
// module.exports = connectDB;

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn; // Return the connection
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;