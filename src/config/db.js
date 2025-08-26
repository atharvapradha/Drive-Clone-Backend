// 📂 backend/config/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // full URL for PostgreSQL
  ssl: {
    rejectUnauthorized: false, // needed for Supabase/Heroku SSL
  },
});

// Test connection
pool.connect()
  .then(client => {
    console.log("✅ PostgreSQL connected via connection pool");
    client.release();
  })
  .catch(err => console.error("❌ PostgreSQL connection error:", err.stack));

module.exports = pool;
