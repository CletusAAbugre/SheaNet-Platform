/*
This script defines how products are stored in MongoDB and links
each product to a seller.
*/

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: String,
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [String],
    category: String,
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 }
    }]
}, { timestamps: true });

// Prevent deletion if referenced in carts
productSchema.pre('remove', async function(next) {
    const cartCount = await mongoose.model('Cart').countDocuments({
        'items.product': this._id
    });

    if (cartCount > 0) {
        throw new Error('Cannot delete - product exists in carts');
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);