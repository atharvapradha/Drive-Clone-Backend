// List Files with Pagination
exports.getFiles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT id, filename, owner_id, created_at 
       FROM files 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM files");

    res.json({
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      files: result.rows,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
};
