// const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { createPaymentIntent } = require('../config/stripe');
const logger = require('../utils/logger');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        // 1. Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // 2. Verify product availability
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `${product.name} only has ${product.stock} items in stock`
                });
            }
        }

        // 3. Calculate total
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // 4. Create payment intent
        const paymentIntent = await createPaymentIntent(total, {
            userId: req.user.id.toString(),
            cartId: cart._id.toString()
        });

        // 5. Create order record
        const order = await Order.create({
            user: req.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total,
            shippingAddress,
            paymentId: paymentIntent.id
        });

        // 6. Reserve inventory
        await Promise.all(cart.items.map(async (item) => {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }));

        // 7. Clear cart
        await Cart.findByIdAndDelete(cart._id);

        res.status(201).json({
            order,
            clientSecret: paymentIntent.client_secret
        });

    } catch (err) {
        logger.error(`Order creation failed: ${err.message}`);
        res.status(500).json({ error: 'Order processing failed' });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt')
            .populate('items.product', 'name imageUrl price');

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get order details
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name imageUrl price');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Verify ownership (unless admin)
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // If cancelled, restock items
        if (status === 'cancelled') {
            await Promise.all(order.items.map(async (item) => {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }));
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        const query = {};

        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort('-createdAt');

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};