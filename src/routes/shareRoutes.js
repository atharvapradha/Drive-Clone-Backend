const express = require("express");
const {
  createShareLink,
  verifyShareLink,
  generateSignedUrl,
} = require("../controllers/shareController");

const router = express.Router();

// Create a new share link
// POST /api/share
router.post("/", createShareLink);

// Verify a shared link (token-based)
// GET /api/share/verify/:token
router.get("/verify/:token", verifyShareLink);

// Generate a signed URL for direct access (download/view)
// POST /api/share/signed-url
router.post("/signed-url", generateSignedUrl);

module.exports = router;
