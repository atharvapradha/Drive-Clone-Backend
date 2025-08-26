// src/middleware/auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    // Get token from headers
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded; // { id, email }

    // Continue to next middleware/route
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { auth };
