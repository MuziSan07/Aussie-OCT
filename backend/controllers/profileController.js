// controllers/profileController.js
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// ---------------- Multer config ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/profile/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

// ---------------- Get Profile ----------------
export const getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, status: true, lastActivity: true } },
      },
    });

    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    res.json({ success: true, data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Update/Create Profile ----------------
export const updateProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const { username, phone } = req.body;
    const profilePic = req.file ? `/uploads/profile/${req.file.filename}` : undefined;

    const existingProfile = await prisma.userProfile.findUnique({ where: { userId } });

    if (existingProfile) {
      // Update
      const updated = await prisma.userProfile.update({
        where: { userId },
        data: { username, phone, profilePic },
      });
      return res.json({ success: true, message: "Profile updated", data: updated });
    } else {
      // Create
      const created = await prisma.userProfile.create({
        data: { userId, username, phone, profilePic },
      });
      return res.json({ success: true, message: "Profile created", data: created });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
