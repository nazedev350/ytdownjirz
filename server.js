const express = require("express");
const cors = require("cors");
const path = require("path");
const { ytmp3, ytmp4, extractVideoId } = require("./api/downloader");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Validate YouTube URL middleware
function validateUrl(req, res, next) {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, error: "URL tidak boleh kosong." });
  }
  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    return res.status(400).json({ success: false, error: "Masukkan URL YouTube yang valid." });
  }
  const id = extractVideoId(url);
  if (!id) {
    return res.status(400).json({ success: false, error: "Video ID tidak ditemukan dari URL ini." });
  }
  next();
}

// POST /api/mp3 — Download MP3
app.post("/api/mp3", validateUrl, async (req, res) => {
  const { url } = req.body;
  try {
    const result = await ytmp3(url);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mp4 — Download MP4
app.post("/api/mp4", validateUrl, async (req, res) => {
  const { url, quality = "720" } = req.body;
  const allowedQualities = ["360", "480", "720", "1080"];
  if (!allowedQualities.includes(String(quality))) {
    return res.status(400).json({ success: false, error: "Kualitas tidak valid. Pilih: 360, 480, 720, atau 1080." });
  }
  try {
    const result = await ytmp4(url, quality);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Fallback to index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
