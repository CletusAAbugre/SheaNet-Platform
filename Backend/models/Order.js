// const mongoose = require('mongoose');
//
// const orderItemSchema = new mongoose.Schema({
//     product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//     },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true }
// });
//
// const orderSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     items: [orderItemSchema],
//     total: { type: Number, required: true },
//     status: {
//         type: String,
//         enum: ['pending', 'processing', 'shipped', 'delivered'],
//         default: 'pending'
//     },
//     shippingAddress: {
//         name: String,
//         address: String,
//         city: String,
//         zip: String
//     },
//     paymentId: String // Stripe payment intent ID
// }, { timestamps: true });
//
// module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending'
    },
    shippingAddress: {
        name: String,
        address: String,
        city: String,
        zip: String
    },
    paymentId: String // Stripe payment intent ID
}, { timestamps: true });

// Check if model already exists before compiling
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;