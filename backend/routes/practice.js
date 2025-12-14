import express from "express";
import { getPracticeChapters } from "../controllers/practiceController.js";

const router = express.Router();

// GET all active chapters
router.get("/", getPracticeChapters);

export default router;