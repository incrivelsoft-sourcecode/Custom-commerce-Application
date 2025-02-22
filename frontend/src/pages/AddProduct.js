import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/addProduct.css";

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://ecommerence-backend-m674.onrender.com/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      alert("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await axios.post("https://ecommerence-backend-m674.onrender.com/api/products/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Products uploaded successfully!");
      fetchProducts();
    } catch (error) {
      alert("Error uploading products");
      console.error("Upload Error:", error);
    }
  };

  //  Delete Single Product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`https://ecommerence-backend-m674.onrender.com/api/products/${productId}`);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      alert("Error deleting product");
      console.error("Delete Error:", error);
    }
  };

  // Delete All Products
  const deleteAllProducts = async () => {
    if (!window.confirm("Are you sure you want to delete all products?")) return;
    
    try {
      await axios.delete("https://ecommerence-backend-m674.onrender.com/api/products");
      alert("All products deleted successfully!");
      fetchProducts();
    } catch (error) {
      alert("Error deleting all products");
      console.error("Delete All Error:", error);
    }
  };

  return (
    <div className="add-product-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>⬅ Back</button>

      <div className="buttons-container">
        {/* Excel Upload Form */}
        <form onSubmit={handleExcelUpload} className="excel-upload-form">
          <input type="file" accept=".xlsx" onChange={(e) => setExcelFile(e.target.files[0])} />
          <button type="submit">Upload Excel</button>
        </form>
        {/* Delete All Products Button */}
        <button className="delete-all-btn" onClick={deleteAllProducts}>🗑 Delete All Products</button>
      </div>

      {/* Product Table */}
      <div className="product-table">
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>Handle</th>
              <th>Title</th>
              <th>Vendor</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.handle}</td>
                  <td>{product.title}</td>
                  <td>{product.vendor}</td>
                  <td>{product.category}</td>
                  <td>{product.tags.join(", ")}</td>
                  <td>${product.price}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.status}</td>
                  <td>
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="product-image" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddProduct;
