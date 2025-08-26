const supabase = require("../config/supabaseClient");
// ✅ Use CommonJS-compatible build of nanoid for Jest
const { nanoid } = require("nanoid");
 
// ✅ Generate a new share link
const createShareLink = async (req, res) => {
  try {
    const { fileId, role, expiresInHours } = req.body;

    if (!fileId || !role) {
      return res.status(400).json({ success: false, error: "fileId and role are required" });
    }

    const token = nanoid(16);
    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await supabase
      .from("shared_links")
      .insert([
        {
          file_id: fileId,
          token,
          role,
          expires_at: expiresAt,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      shareUrl: `https://yourfrontend.com/share/${token}`,
      linkData: data,
    });
  } catch (err) {
    console.error("Error in createShareLink:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Verify a shared link
const verifyShareLink = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, error: "Token is required" });
    }

    const { data, error } = await supabase
      .from("shared_links")
      .select("*")
      .eq("token", token)
      .single();

    if (error) throw error;

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ success: false, error: "Link expired" });
    }

    return res.json({ success: true, linkData: data });
  } catch (err) {
    console.error("Error in verifyShareLink:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Generate a signed URL for secure file access
const generateSignedUrl = async (req, res) => {
  try {
    const { filePath, expiresInSeconds } = req.body;

    if (!filePath) {
      return res.status(400).json({ success: false, error: "filePath is required" });
    }

    const { data, error } = await supabase.storage
      .from("files") // ⚠️ Replace with your actual bucket name
      .createSignedUrl(filePath, expiresInSeconds || 3600);

    if (error) throw error;

    return res.json({ success: true, signedUrl: data.signedUrl });
  } catch (err) {
    console.error("Error in generateSignedUrl:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createShareLink, verifyShareLink, generateSignedUrl };
