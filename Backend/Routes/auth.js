const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, resetPassword } = require('../controllers/auth');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validations/auth');
const authMiddleware = require('../middlewares/auth'); // Make sure this is imported

// Public routes (NO authMiddleware)
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes (WITH authMiddleware)
router.post('/logout', authMiddleware, logout);
router.post('/forgot-password', authMiddleware, forgotPassword);
router.post('/reset-password/:token', authMiddleware, resetPassword);

module.exports = router;