const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ['raw', 'bulk', 'skincare', 'scented'],
        required: true
    },
    size: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);