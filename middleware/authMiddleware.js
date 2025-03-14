/*
This script is to protect API routes by verifying JWT tokens. It extracts token from
request header, verifies the token with JWT_SECRET and adds user information to
req.user if valid.
*/

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({message:"No token, authorized denied"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({message:"Invalid token"});
    }
};