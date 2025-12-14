// backend/routes/question.js
import express from "express";
import multer from "multer";
import path from "path";
// backend/routes/question.js
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  getQuestionCount,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
const router = express.Router();

// Multer: for optional audio upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "audio-" + unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const types = /mp3|wav|ogg|m4a/;
    const ext = types.test(path.extname(file.originalname).toLowerCase());
    const mime = types.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Audio files only (mp3, wav, ogg, m4a)"));
  },
});

// Routes
router.post("/", upload.single("audio"), createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.get("/count", getQuestionCount); // For range selector
router.put("/:id", upload.single("audio"), updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;