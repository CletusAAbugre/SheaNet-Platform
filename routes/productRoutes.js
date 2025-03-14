// This script defines routes for products

const express = require("express");
const {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} = require("../controllers/productController");
const authMiddliware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/Product", authMiddliware, createProduct);
router.get("/Product", getAllProducts, getProductById);
router.put("/Product", authMiddliware, updateProduct);
router.delete("/Product", authMiddliware, deleteProduct);

module.exports = router;