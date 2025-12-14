// routes/profileRouter.js
import express from "express";
import { getProfile, updateProfile, upload } from "../controllers/profileController.js";

const router = express.Router();

// Get user profile
router.get("/:userId", getProfile);

// Update or create profile
router.post("/:userId", upload.single("profilePic"), updateProfile);

export default router;
