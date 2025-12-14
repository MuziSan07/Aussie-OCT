// backend/routes/quiz.js
import express from "express";
import { getQuizQuestions } from "../controllers/QuizController.js";

const router = express.Router();

// GET quiz questions for a chapter
router.get("/", getQuizQuestions);

export default router;