const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use("/api/users", require("./users/routes/userRoutes"));
app.use("/api/products", require("./products/routes/productRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
