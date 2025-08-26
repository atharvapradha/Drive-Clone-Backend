const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const url = process.env.SUPABASE_URL;
// ⚠️ For backend, prefer SERVICE_ROLE for admin DB/storage ops
const key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/ANON_KEY in .env");
}

const supabase = createClient(url, key);

module.exports = supabase;
