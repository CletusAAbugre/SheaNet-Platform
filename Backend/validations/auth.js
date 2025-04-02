const { body } = require('express-validator');

const registerSchema = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role')
        .optional()
        .isIn(['buyer', 'seller']).withMessage('Invalid role')
];

const loginSchema = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
];

module.exports = {
    registerSchema,
    loginSchema
};