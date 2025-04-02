const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product');
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });

        const existingItem = cart.items.find(item =>
            item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(await cart.populate('items.product'));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};