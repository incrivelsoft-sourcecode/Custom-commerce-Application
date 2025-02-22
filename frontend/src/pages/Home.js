import React from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="container">
        <h1>Welcome to Our eCommerce Store</h1>
        <ProductList />
      </div>
    </div>
  );
};

export default Home;
