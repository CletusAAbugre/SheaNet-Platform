const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        const query = {};

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const sortOptions = {};
        if (sort === 'price_asc') sortOptions.price = 1;
        if (sort === 'price_desc') sortOptions.price = -1;

        const products = await Product.find(query)
            .sort(sortOptions)
            .populate('seller', 'name');

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};