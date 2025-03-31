const { errorResponse } = require('../utils/apiResponse');

module.exports = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json(errorResponse('Validation failed', errors));
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(errorResponse('Invalid token'));
    }

    // Default server error
    res.status(500).json(errorResponse('Server error'));
};