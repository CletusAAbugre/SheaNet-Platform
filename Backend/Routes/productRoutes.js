// This script defines Routes for products

const express = require("express");
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");  // Fixed variable name
const router = express.Router();

// Apply authMiddleware correctly by calling it
router.post("/", authMiddleware(['admin']), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware(['admin']), updateProduct);
router.delete("/:id", authMiddleware(['admin']), deleteProduct);

module.exports = router;