const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        validate: {
            validator: async function(productId) {
                const product = await mongoose.model('Product').findById(productId);
                return product !== null;
            },
            message: props => `Product ${props.value} does not exist`
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1'],
        validate: {
            validator: async function(quantity) {
                const product = await mongoose.model('Product').findById(this.product);
                return product.stock >= quantity;
            },
            message: 'Insufficient product stock'
        }
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Auto-update timestamp
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate total price virtually
cartSchema.virtual('total').get(function() {
    return this.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);