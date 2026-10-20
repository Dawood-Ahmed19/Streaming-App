import multer from "multer";
import path from "path";
import fs from "fs";

fs.mkdirSync("uploads", { recursive: true });

export const upload = multer({
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
