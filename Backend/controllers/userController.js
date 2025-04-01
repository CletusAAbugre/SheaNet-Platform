/*
This script handles user registration and login. It uses bcrypt
for password hashing and use JWT for authentication.
*/

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* User registration: - Check if email is already used
                      - Hashes the password before storing it
                      - Create a new user in MongoDB
*/
exports.registerUser = async (req, res) => {
    const {name, email, password, role} = req.body;

    try {
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({message: "User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({message:"User registred successfully", user});
    } catch (err) {
        res.status(500).json({message:"Server Error", error});
    }
};

/*
User login: - Finds user in database
            - Compares hashed password with input
            - Generates a JWT token for authentication
*/
exports.loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({id: user_id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "2h"});
        res.json({token, user});
    } catch (err) {
        res.status(500).json({message:"Server Error", error});
    }
};