const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/products");
const productRoutes = require("../Routes/productRoutes");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);

beforeAll(async () => {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Product API Tests", () => {
    let productId;

    // 🟢 Test: Create a Product
    it("should create a product", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({ name: "Test Product", price: 100 });

        expect(res.status).toBe(201);
        expect(res.body.product).toHaveProperty("_id");
        productId = res.body.product._id;
    });

    // 🟢 Test: Get All Products
    it("should fetch all products", async () => {
        const res = await request(app).get("/api/products");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // 🟢 Test: Get Single Product
    it("should fetch a product by ID", async () => {
        const res = await request(app).get(`/api/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", productId);
    });

    // 🟢 Test: Update a Product
    it("should update a product", async () => {
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .send({ price: 150 });

        expect(res.status).toBe(200);
        expect(res.body.product.price).toBe(150);
    });

    // 🟢 Test: Delete a Product
    it("should delete a product", async () => {
        const res = await request(app).delete(`/api/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Product deleted successfully");
    });
});
