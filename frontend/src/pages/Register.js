import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For error messages
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://ecommerence-backend-m674.onrender.com/api/users/register", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        alert("Registered Successfully! Now login.");
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>

      <div className="register-box">
        <h2>Create Account</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <button type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
