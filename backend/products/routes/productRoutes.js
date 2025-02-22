const express = require("express");
const { 
  getProducts, 
  uploadProductsFromExcel, 
  deleteAllProducts, 
  deleteProductById,
  excelUpload, 

} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/upload-excel", excelUpload.single("file"), uploadProductsFromExcel);
router.delete("/", deleteAllProducts);  // Delete all products
router.delete("/:id", deleteProductById); // Delete a single product by ID

module.exports = router;
