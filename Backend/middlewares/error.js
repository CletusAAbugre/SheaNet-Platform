const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error(err.stack);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            error: `${field} already exists`
        });
    }

    // Default to 500 server error
    res.status(500).json({
        error: process.env.NODE_ENV === 'development' ?
            err.message : 'Server error'
    });
};

module.exports = {
    errorHandler
};