/*
This script is to protect API Routes by verifying JWT tokens. It extracts token from
request header, verifies the token with JWT_SECRET and adds user information to
req.user if valid.
*/

const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

module.exports = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) throw new Error('Authorization denied');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Role-based access control
            if (roles.length && !roles.includes(decoded.role)) {
                throw new Error('Insufficient permissions');
            }

            req.user = {
                id: decoded.id,
                role: decoded.role
            };

            next();
        } catch (err) {
            res.status(401).json(errorResponse(err.message));
        }
    };
};