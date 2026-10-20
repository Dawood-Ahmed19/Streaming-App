import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userSelect = { id: true, username: true, email: true };

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username?.trim() || !email?.trim() || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: await bcrypt.hash(password, 10),
      },
      select: userSelect,
    });
    res.status(201).json({ user, token: makeToken(user.id) });
  } catch (err) {
    if (err.code === "P2002")
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: (email || "").trim().toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(password || "", user.passwordHash)))
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    user: { id: user.id, username: user.username, email: user.email },
    token: makeToken(user.id),
  });
};

export const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: userSelect,
  });
  if (!user) return res.status(401).json({ message: "User not found" });
  res.json({ user });
};

export const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  if (!username?.trim() || !email?.trim())
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { username: username.trim(), email: email.trim().toLowerCase() },
      select: userSelect,
    });
    res.json({ user });
  } catch (err) {
    if (err.code === "P2002")
      return res.status(409).json({ message: "This email is already in use" });
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};
