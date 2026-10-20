import { Router } from "express";
import {
  signup,
  signin,
  me,
  updateProfile,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, updateProfile);
router.delete("/account", requireAuth, deleteAccount);

export default router;
