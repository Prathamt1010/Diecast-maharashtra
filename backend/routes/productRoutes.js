const express = require("express");

const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Get all products
router.get("/", getProducts);

// Create product
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createProduct
);

// Update product
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  authMiddleware,
  deleteProduct
);

module.exports = router;