import express from "express";
import { getRandomQuestions } from "../controllers/stimulationController.js";

const router = express.Router();

// GET /stimulation-test?limit=20
router.get("/", getRandomQuestions);

export default router;
