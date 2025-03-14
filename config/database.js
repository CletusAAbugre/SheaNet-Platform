/*
This script is to configurate the database we will be using.
It will connect to MongoDB using Mongoose and loads database credentials
from .env for security.
*/

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("Database Connection Error: ", error);
        process.exit(1);
    }
};

module.exports = connectDB;

