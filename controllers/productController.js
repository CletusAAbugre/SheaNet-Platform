/*
This script helps manage product in the database
*/

const Product = require("../models/products");

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({message:"Product created successfully", product: newProduct});
    } catch (error) {
        res.status(500).json({error:"Error creating product"});
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({error:"Error fetching products"});
    }
};

// Get a single product by id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({error:"Product not found"});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({error:"Error fetching product"});
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: True});
        if (!updateProduct) {
            return res.status(404).json({error:"Product not found"});
        }
        res.status(200).json({messge: "Product updated successfully", product: updateProduct});
    } catch (error) {
        res.status(500).json({error:"Error updating product"});
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({error:"Product not found"});
        }
        res.status(200).json({message: "Product deleted successfully",  product: deletedProduct});
    } catch (error) {
        res.status(500).json({error:"Error deleting product"});
    }
};
