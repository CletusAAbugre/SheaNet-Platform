const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../models/products");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Product Model Test", () => {
    it("should create & save a product successfully", async () => {
        const productData = {
            name: "Test Product",
            description: "A sample product",
            price: 99.99,
            seller: new mongoose.Types.ObjectId(),
            category: "Electronics"
        };

        const product = new Product(productData);
        const savedProduct = await product.save();

        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.name).toBe(productData.name);
        expect(savedProduct.description).toBe(productData.description);
        expect(savedProduct.price).toBe(productData.price);
        expect(savedProduct.seller).toStrictEqual(productData.seller);
        expect(savedProduct.category).toBe(productData.category);
    });

    it("should fail if required fields are missing", async () => {
        const product = new Product({ description: "Missing required fields" });

        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.name).toBeDefined();
        expect(error.errors.price).toBeDefined();
        expect(error.errors.seller).toBeDefined();
    });
});
