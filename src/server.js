// src/server.js
const express = require("express");
const app = require("./app");
const { createClient } = require("@supabase/supabase-js");

// ✅ Load environment variables
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// ✅ Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Test DB connection
(async () => {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    console.log("✅ Supabase connected successfully!");
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
  }
})();

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const shareRoutes = require("./routes/shareRoutes");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/share", shareRoutes);

// ✅ Start server only when run directly (not during Jest tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app; // ✅ Export app for Supertest
