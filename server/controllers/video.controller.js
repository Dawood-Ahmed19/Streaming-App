import path from "path";
import fs from "fs";
import { prisma } from "../db.js";

const include = { uploader: { select: { username: true } } };

const format = ({ filePath, uploader, ...v }) => ({
  ...v,
  fileUrl: filePath,
  uploader: uploader.username,
});

const removeFile = (filePath) => {
  if (filePath)
    fs.unlink(path.join("uploads", path.basename(filePath)), () => {});
};

export const getVideos = async (req, res) => {
  const { q, source, uploader } = req.query;

  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: { uploaderId: req.userId },
      include,
      orderBy: { createdAt: "desc" },
    });
    res.json({ videos: videos.map(format) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createVideo = async (req, res) => {
  const {
    title,
    description = "",
    source,
    link = null,
    thumbnail = null,
  } = req.body;

  const fail = (status, message) => {
    if (req.file) removeFile(`/uploads/${req.file.filename}`);
    return res.status(status).json({ message });
  };

  if (!title?.trim()) return fail(400, "Title is required");
  if (!["youtube", "twitch", "local", "link"].includes(source))
    return fail(400, "Invalid source");
  if (source === "local" && !req.file)
    return fail(400, "Please choose a video file");
  if (source !== "local" && !link)
    return fail(400, "Please paste a video link");

  try {
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
  } catch (err) {
    console.error(err);
    fail(500, "Something went wrong");
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await prisma.video.findFirst({
      where: { id: req.params.id, uploaderId: req.userId },
    });
    if (!video) return res.status(404).json({ message: "Video not found" });

    await prisma.video.delete({ where: { id: video.id } });
    removeFile(video.filePath);

    res.json({ ok: true });
  } catch {
    res.status(404).json({ message: "Video not found" });
  }
};
