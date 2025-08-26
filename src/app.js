// src/app.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { nanoid } = require("nanoid");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Configure Multer (files go to uploads/)
const upload = multer({ dest: "uploads/" });

// Temporary in-memory storage for shares (replace with DB later)
const files = {};      // { fileId: { filename, path } }
const shareLinks = {}; // { token: { fileId, permission } }

// -------------------- ROUTES --------------------

// ✅ File upload route
app.post("/api/files/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const fileId = nanoid();
  files[fileId] = req.file;

  return res.status(201).json({
    success: true,
    fileId,
    filename: req.file.originalname,
  });
});

// ✅ Generate a share link
app.post("/api/share", (req, res) => {
  const { fileId, permission } = req.body;

  if (!fileId || !files[fileId]) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  const token = nanoid(10);
  shareLinks[token] = { fileId, permission };

  return res.status(201).json({
    success: true,
    shareLink: `/api/share/${token}`,
    token,
  });
});

// ✅ Verify a share link
app.get("/api/share/:token", (req, res) => {
  const { token } = req.params;
  const link = shareLinks[token];

  if (!link) {
    return res.status(404).json({ success: false, message: "Invalid or expired link" });
  }

  return res.status(200).json({
    success: true,
    fileId: link.fileId,
    permission: link.permission,
  });
});

// ------------------------------------------------
module.exports = app;
