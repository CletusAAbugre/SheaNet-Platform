/*
This script is for user schema (name, email, password, role) and use to interact
with MongoDB.
*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    role: {type:String, enum: ["seller", "buyer", "admin"], default: "seller"}, },{timestamps: true});

module.exports = mongoose.model("User", userSchema);
