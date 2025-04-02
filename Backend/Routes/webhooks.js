const express = require('express');
const router = express.Router();
const { stripe } = require('../config/stripe');
const Order = require('../models/Order');
const logger = require('../utils/logger');

// Stripe requires raw body for webhook verification
router.post('/stripe', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        logger.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle events
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;

        case 'payment_intent.payment_failed':
            await handlePaymentFailure(event.data.object);
            break;

        case 'charge.refunded':
            await handleRefund(event.data.object);
            break;

        default:
            logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

// Helper functions
async function handlePaymentSuccess(paymentIntent) {
    const order = await Order.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        { status: 'paid' },
        { new: true }
    );

    if (order) {
        logger.info(`Order ${order._id} marked as paid`);
        // Send confirmation email here
    }
}

async function handlePaymentFailure(paymentIntent) {
    await Order.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        { status: 'failed' }
    );
}

async function handleRefund(charge) {
    await Order.findOneAndUpdate(
        { paymentId: charge.payment_intent },
        { status: 'refunded' }
    );
}

module.exports = router;