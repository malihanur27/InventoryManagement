const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to get products" });
  }
});

// Add a product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "All product fields are required"
      });
    }

    // Validate text
    if (typeof name !== "string" || typeof category !== "string") {
      return res.status(400).json({
        message: "Name and category must be text"
      });
    }

    // Validate numbers
    if (
      typeof price !== "number" ||
      typeof quantity !== "number" ||
      price < 0 ||
      quantity < 0
    ) {
      return res.status(400).json({
        message: "Price and quantity must be valid non-negative numbers"
      });
    }

    // Limit text length
    if (name.length > 100 || category.length > 50) {
      return res.status(400).json({
        message: "Product name or category is too long"
      });
    }

    const product = new Product({
      name: name.trim(),
      category: category.trim(),
      price,
      quantity
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(400).json({
      message: "Failed to add product"
    });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {

    // Check whether MongoDB ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const { name, category, price, quantity } = req.body;

    // Validate data
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "All product fields are required"
      });
    }

    if (
      typeof price !== "number" ||
      typeof quantity !== "number" ||
      price < 0 ||
      quantity < 0
    ) {
      return res.status(400).json({
        message: "Price and quantity must be valid non-negative numbers"
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        category: category.trim(),
        price,
        quantity
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    res.status(400).json({
      message: "Failed to update product"
    });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {

    // Check whether MongoDB ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to delete product"
    });
  }
});

module.exports = router;