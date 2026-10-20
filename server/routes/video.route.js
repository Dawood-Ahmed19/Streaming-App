import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getVideos,
  getMyVideos,
  createVideo,
  deleteVideo,
} from "../controllers/video.controller.js";

const router = Router();

router.get("/", getVideos);
router.get("/mine", requireAuth, getMyVideos);
router.post("/", requireAuth, upload.single("file"), createVideo);
router.delete("/:id", requireAuth, deleteVideo);

export default router;
