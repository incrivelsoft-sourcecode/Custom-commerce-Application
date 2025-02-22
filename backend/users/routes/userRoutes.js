const express = require("express");
const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controllers/userController");

const router = express.Router();

//  Register & Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
