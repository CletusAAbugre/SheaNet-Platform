const request = require('supertest');
const app = require('../server');
const { connectDB, disconnectDB } = require('../config/database');
const Cart = require('../models/cart');
const Product = require('../Backend/models/product');
const User = require('../models/user');

describe('Cart System', () => {
    let testUser;
    let testProduct;
    let authToken;

    beforeAll(async () => {
        await connectDB();

        // Create test user
        testUser = await User.create({
            name: 'Cart Tester',
            email: 'cart@test.com',
            password: 'test123',
            role: 'buyer'
        });

        // Create test product
        testProduct = await Product.create({
            name: 'Test Shea Butter',
            price: 25.99,
            stock: 10,
            seller: testUser._id
        });

        // Get auth token
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'cart@test.com',
                password: 'test123'
            });
        authToken = res.body.token;
    });

    afterAll(async () => {
        await Cart.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await disconnectDB();
    });

    test('Add item to cart', async () => {
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                productId: testProduct._id,
                quantity: 2
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.items.length).toBe(1);
    });

    test('Prevent over-ordering', async () => {
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                productId: testProduct._id,
                quantity: 999
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});