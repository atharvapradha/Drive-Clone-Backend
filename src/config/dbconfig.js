const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

pool.connect()
  .then(() => console.log('✅ Connected to Supabase PostgreSQL'))
  .catch(err => console.error('❌ DB Connection Error:', err));

module.exports = pool;
