import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

fs.mkdirSync("uploads", { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) =>
      cb(
        null,
        `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`,
      ),
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("video/")
      ? cb(null, true)
      : cb(new Error("Only video files are allowed")),
});

const include = { uploader: { select: { username: true } } };

const format = ({ filePath, uploader, ...v }) => ({
  ...v,
  fileUrl: filePath,
  uploader: uploader.username,
});

const router = Router();

router.get("/", async (req, res) => {
  const { q, source, uploader } = req.query;

  const videos = await prisma.video.findMany({
    where: {
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { uploader: { username: { contains: q, mode: "insensitive" } } },
        ],
      }),
      ...(source && source !== "all" && { source }),
      ...(uploader &&
        uploader !== "all" && { uploader: { username: uploader } }),
    },
    include,
    orderBy: { createdAt: "desc" },
  });

  res.json({ videos: videos.map(format) });
});

router.get("/mine", requireAuth, async (req, res) => {
  const videos = await prisma.video.findMany({
    where: { uploaderId: req.userId },
    include,
    orderBy: { createdAt: "desc" },
  });
  res.json({ videos: videos.map(format) });
});

router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  const {
    title,
    description = "",
    source,
    link = null,
    thumbnail = null,
  } = req.body;

  if (!title?.trim())
    return res.status(400).json({ message: "Title is required" });
  if (!["youtube", "twitch", "local", "link"].includes(source))
    return res.status(400).json({ message: "Invalid source" });
  if (source === "local" && !req.file)
    return res.status(400).json({ message: "Please choose a video file" });
  if (source !== "local" && !link)
    return res.status(400).json({ message: "Please paste a video link" });

  const video = await prisma.video.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      source,
      link,
      thumbnail,
      filePath: req.file ? `/uploads/${req.file.filename}` : null,
      uploaderId: req.userId,
    },
    include,
  });

  res.status(201).json({ video: format(video) });
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const video = await prisma.video.findFirst({
      where: { id: req.params.id, uploaderId: req.userId },
    });
    if (!video) return res.status(404).json({ message: "Video not found" });

    await prisma.video.delete({ where: { id: video.id } });

    if (video.filePath)
      fs.unlink(path.join("uploads", path.basename(video.filePath)), () => {});

    res.json({ ok: true });
  } catch {
    res.status(404).json({ message: "Video not found" });
  }
});

export default router;
