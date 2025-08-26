const supabase = require("../supabaseClient");

// Get file & role from token
const getFileAndRole = async (token) => {
  const { data: link, error } = await supabase
    .from("shared_links")
    .select("file_id, role, expires_at")
    .eq("token", token)
    .single();

  if (error || !link) throw new Error("Invalid or expired link");

  // check expiry
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    throw new Error("Link expired");
  }

  return link;
};

module.exports = { getFileAndRole };
