const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protected Routes (require authentication)
router.post('/', authMiddleware(), cartController.addToCart);
router.get('/', authMiddleware(), cartController.getCart);
router.delete('/:itemId', authMiddleware(), cartController.removeFromCart);
router.put('/:itemId', authMiddleware(), cartController.updateCartItem);
router.delete('/', authMiddleware(), cartController.clearCart);

module.exports = router;