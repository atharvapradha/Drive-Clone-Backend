const express = require("express");
const multer = require("multer");
const supabase = require("../config/supabaseClient");
const { auth } = require("../middleware/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * 📂 Upload File API
 * POST /api/files/upload
 */
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id; // from JWT
    const { folderId } = req.body;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const storagePath = folderId
      ? `${userId}/${folderId}/${Date.now()}-${file.originalname}`
      : `${userId}/${Date.now()}-${file.originalname}`;

    const { data: uploadRes, error: uploadErr } = await supabase.storage
      .from("drive-clone")
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadErr) throw uploadErr;

    const { data: fileMeta, error: metaErr } = await supabase
      .from("files")
      .insert([
        {
          owner_id: userId,
          folder_id: folderId || null,
          name: file.originalname,
          size: file.size,
          format: file.mimetype,
          path: uploadRes.path,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (metaErr) throw metaErr;

    return res.json({
      message: "✅ File uploaded successfully",
      file: fileMeta,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * 🔍 Search Files API
 * GET /api/files/search?q=keyword&page=1&limit=10
 */
router.get("/search", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("files")
      .select("id, name, size, format, created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (q) {
      query = query.textSearch("name", q, {
        type: "websearch",
        config: "english",
      });
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({
      message: "✅ Files fetched",
      results: data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        nextPage: data.length === Number(limit) ? Number(page) + 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * 📑 List Files with Pagination (Lazy Loading support)
 * GET /api/files?page=1&limit=10
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from("files")
      .select("id, name, size, format, created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json({
      message: "✅ Files fetched with pagination",
      results: data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        nextPage: data.length === Number(limit) ? Number(page) + 1 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
