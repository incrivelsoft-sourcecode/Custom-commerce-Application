const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true }, // Unique Identifier
  title: { type: String, required: true }, // Product Name
  description: { type: String, default: "" }, // HTML Description
  vendor: { type: String, required: true }, // Brand Name
  category: { type: String, required: true }, // Category
  tags: { type: [String], default: [] }, // Tags for filtering
  price: { type: Number, required: true }, // Selling Price
  costPerItem: { type: Number, default: 0 }, // Cost per Item
  stockQuantity: { type: Number, default: 0 }, // Available Stock
  image: { type: String, default: "" }, // Image URL or File Path
  status: { type: String, enum: ["active", "inactive","draft"], default: "active" }, // Product Status
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
