import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/productList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load products");
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const categories = ["All Categories", ...new Set(products.map((product) => product.category))];

  const filteredProducts =
    selectedCategory === "All Categories"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="product-container">
      <h2>Our Products</h2>

      {error && <p className="error">{error}</p>}

      <div className="filter-bar">
        <select
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                {product.image && <img src={product.image} alt={product.title} />}
                <h3>{product.title}</h3>
                <p>${product.price}</p>
                <span className="category">{product.category}</span>
              </div>
            ))
          ) : (
            <p className="no-products">No products available in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
