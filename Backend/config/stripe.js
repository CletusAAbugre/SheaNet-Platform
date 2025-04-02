const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger'); // Optional

const createPaymentIntent = async (amount, metadata = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    } catch (err) {
        logger.error(`Stripe error: ${err.message}`);
        throw new Error('Payment processing failed');
    }
};

module.exports = {
    stripe,
    createPaymentIntent
};