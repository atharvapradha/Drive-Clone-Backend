const request = require("supertest");
const path = require("path");
const app = require("../app");

describe("Share API Tests", () => {
  let fileId;

  beforeAll(async () => {
    const filePath = path.join(__dirname, "dummy.txt"); // ✅ ensures correct absolute path

    const res = await request(app)
      .post("/api/files/upload")
      .attach("file", filePath);

    fileId = res.body.fileId;
  });

  it("should generate a share link", async () => {
    const res = await request(app)
      .post("/api/share")
      .send({ fileId, permission: "view" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("shareLink");
  });

  it("should verify a share link", async () => {
    const shareRes = await request(app)
      .post("/api/share")
      .send({ fileId, permission: "view" });

    const token = shareRes.body.token;

    const verifyRes = await request(app).get(`/api/share/${token}`);
    expect(verifyRes.statusCode).toBe(200);
    expect(verifyRes.body).toHaveProperty("fileId");
  });
});
