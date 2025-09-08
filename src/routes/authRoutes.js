// src/routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Signup route
router.post("/signup", register);

// Login route
router.post("/login", login);

// Debug route (optional) - helps confirm router is loaded
router.get("/test", (req, res) => {
  res.json({ message: "✅ Auth routes are working" });
});

module.exports = router;
