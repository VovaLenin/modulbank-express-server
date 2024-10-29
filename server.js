const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));

// Путь к директории с HLS файлами
const hlsDirectory = path.join(__dirname, "hls");

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Эндпоинт для получения корневой страницы
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Эндпоинт для раздачи HLS файлов
app.use("/hls", express.static(hlsDirectory));

// Эндпоинт для получения .m3u8 файла
app.get("/playlist", (req, res) => {
  const playlistPath = path.join(hlsDirectory, "test-video.m3u8");

  if (fs.existsSync(playlistPath)) {
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.sendFile(playlistPath);
  } else {
    res.status(404).send("Playlist not found");
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
