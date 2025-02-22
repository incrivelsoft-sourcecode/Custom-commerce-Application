const Product = require("../models/Product");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelUploadDir = path.join(__dirname, "../uploads/excel/");
if (!fs.existsSync(excelUploadDir)) {
  fs.mkdirSync(excelUploadDir, { recursive: true });
  console.log("Created uploads/excel directory");
}

const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, excelUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const excelUpload = multer({ storage: excelStorage });

exports.uploadProductsFromExcel = async (req, res) => {
  try {
    console.log("Excel Upload Started...");

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log(`File received: ${req.file.originalname}`);

    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      console.log("File not found after upload:", filePath);
      return res.status(500).json({ message: "File upload failed. Try again." });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    if (!sheetNames.length) {
      console.log("No sheets found in Excel file");
      return res.status(400).json({ message: "Invalid Excel file format" });
    }

    const sheet = workbook.Sheets[sheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!data.length) {
      console.log("No data found in the Excel sheet");
      return res.status(400).json({ message: "Excel file is empty or incorrectly formatted" });
    }

    const requiredColumns = ["Handle", "Title", "Vendor"];
    const columnHeaders = Object.keys(data[0] || {});

    const missingColumns = requiredColumns.filter(col => !columnHeaders.includes(col));
    if (missingColumns.length) {
      console.log("Missing required columns:", missingColumns);
      return res.status(400).json({ message: `Missing required columns: ${missingColumns.join(", ")}` });
    }

    const validStatuses = ["active", "draft", "archived"]; // Allowed status values

    const products = data.map((row, index) => {
      const handle = row.Handle?.trim() || `missing-handle-${index}`;
      const title = row.Title?.trim() || "Untitled Product";
      const vendor = row.Vendor?.trim() || "Unknown Vendor";
      const status = row.Status?.toLowerCase() || "active";

      if (!validStatuses.includes(status)) {
        console.log(`Invalid status "${status}" in row ${index + 1}, setting to "active"`);
      }

      return {
        handle,
        title,
        description: row["Body (HTML)"]?.trim() || "No description available",
        vendor,
        category: row["Product Category"]?.trim() || "General",
        tags: row.Tags ? row.Tags.split(",").map(tag => tag.trim()) : [],
        price: parseFloat(row["Variant Price"] || 0),
        costPerItem: parseFloat(row["Cost per item"] || 0),
        stockQuantity: parseInt(row["Variant Inventory Qty"] || 0),
        image: row["Image Src"]?.trim() || "",
        status: validStatuses.includes(status) ? status : "active",
      };
    });

    const filteredProducts = products.filter(p => p !== null);

    if (!filteredProducts.length) {
      console.log("No valid products to insert");
      return res.status(400).json({ message: "No valid products found in Excel file" });
    }

    await Promise.all(
      filteredProducts.map(async (product) => {
        await Product.updateOne(
          { handle: product.handle }, // Find product by handle
          { $set: product }, // Update product
          { upsert: true } // Insert if not found
        );
      })
    );

    fs.unlinkSync(filePath);
    console.log(`${filteredProducts.length} Products processed successfully!`);
    res.json({ message: "Products uploaded successfully!", inserted: filteredProducts.length });

  } catch (error) {
    console.error("Error processing Excel file:", error.message);
    res.status(500).json({ message: "Error uploading products", error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`Product deleted: ${deletedProduct.title}`);
    res.json({ message: "Product deleted successfully!", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    console.log("All products deleted successfully!");
    res.json({ message: "All products deleted successfully!", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting products:", error.message);
    res.status(500).json({ message: "Error deleting products", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`Product updated: ${updatedProduct.title}`);
    res.json({ message: "Product updated successfully!", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

exports.excelUpload = excelUpload;
