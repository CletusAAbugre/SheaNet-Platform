/*
This script defines how products are stored in MongoDB and links
each product to a seller.
*/

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema ({
    name: {type: String, required:true},
    description: {type: String},
    price: {type: Number, required:true},
    seller: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    category: {type: String}, },{timestamps: true});

module.exports = mongoose.model ("Product", productSchema);