const Cart = require('../models/cart');
const Product = require('../models/products');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json(errorResponse('Product not found'));
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json(errorResponse('Insufficient stock'));
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product._id.toString() === productId
        );

        if (existingItemIndex >= 0) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity });
        }

        // Recalculate totals
        cart.markModified('items');
        await cart.save();

        res.json(successResponse(cart, 'Item added to cart'));

    } catch (err) {
        console.error('Cart Error:', err);
        res.status(500).json(errorResponse('Server error', err.message));
    }
};

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name price images stock')
            .lean();

        if (!cart) {
            return res.json(successResponse({ items: [], total: 0 }));
        }

        // Calculate totals
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json(successResponse({
            ...cart,
            total: total.toFixed(2)
        }));

    } catch (err) {
        res.status(500).json(errorResponse('Failed to fetch cart'));
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        ).populate('items.product');

        if (!cart) {
            return res.status(404).json(errorResponse('Cart not found'));
        }

        res.json(successResponse(cart, 'Item removed from cart'));

    } catch (err) {
        res.status(500).json(errorResponse('Failed to remove item'));
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json(errorResponse('Quantity must be at least 1'));
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json(errorResponse('Cart not found'));
        }

        // Find and update item
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json(errorResponse('Item not found in cart'));
        }

        // Check product stock
        const product = await Product.findById(item.product);
        if (product.stock < quantity) {
            return res.status(400).json(errorResponse('Insufficient stock'));
        }

        item.quantity = quantity;
        await cart.save();

        res.json(successResponse(cart, 'Cart updated'));

    } catch (err) {
        res.status(500).json(errorResponse('Failed to update cart'));
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $set: { items: [] } }
        );

        res.json(successResponse(null, 'Cart cleared'));

    } catch (err) {
        res.status(500).json(errorResponse('Failed to clear cart'));
    }
};