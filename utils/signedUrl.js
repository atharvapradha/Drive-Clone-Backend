// backend/utils/signedUrl.js
const jwt = require("jsonwebtoken");

const SECRET = process.env.SIGNED_URL_SECRET || "supersecretkey"; // store in .env

// Generate signed URL token
const generateSignedUrl = (fileId, role, expiresIn = "1h") => {
  const token = jwt.sign({ fileId, role }, SECRET, { expiresIn });
  return token;
};

// Verify signed URL token
const verifySignedUrl = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null; // invalid or expired
  }
};

module.exports = { generateSignedUrl, verifySignedUrl };
