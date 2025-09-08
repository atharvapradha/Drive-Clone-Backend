require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

(async () => {
  const { data, error } = await supabase.from("test_table").select("*").limit(1);
  if (error) console.error("❌ Supabase query failed:", error.message);
  else console.log("✅ Supabase connection working:", data);
})();
