const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Import controllers
const { register, login } = require('../controllers/auth');
const { getProducts, getProduct } = require('../controllers/products');
const { getCart, addToCart } = require('../controllers/cart');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// Protected routes (require authentication)
router.get('/cart', authMiddleware, getCart);
router.post('/cart', authMiddleware, addToCart);

module.exports = router;