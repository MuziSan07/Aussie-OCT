import express from "express";
import { getUserOverview, getUserChapters } from "../controllers/overviewController.js";

const router = express.Router();

// Get user overview/dashboard
router.get("/:userId", getUserOverview);

// Get all chapters for user
router.get("/:userId/chapters", getUserChapters);

export default router;