// chapterRoutes.js
import express from "express";
import { 
  getChapters, 
  getChapterById, 
  startQuiz, 
  updateChapter, 
  createChapter,
  deleteChapter,
} from "../controllers/chapterController.js";

import multer from "multer";

const router = express.Router();

// ----------------------
// Multer Setup
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ----------------------
// Routes
// ----------------------

// Create chapter (NOW WITH FILE UPLOAD)
router.post("/", upload.single("image"), createChapter);

// List all chapters
router.get("/", getChapters);

// Get chapter details
router.get("/:id", getChapterById);

// Start quiz for a chapter
router.post("/:id/quiz", startQuiz);

// Update chapter
// Delete a chapter
router.delete("/:id", deleteChapter);

router.put("/:id", upload.single("image"), updateChapter);

export default router;
