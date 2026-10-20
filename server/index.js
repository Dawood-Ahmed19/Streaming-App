import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import videoRoutes from "./routes/video.route.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || "Something went wrong" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`),
);
