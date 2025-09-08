// src/routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Signup & Login routes
router.post("/signup", register);
router.post("/login", login);

module.exports = router;
