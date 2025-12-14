import express from "express";
import {
  getFlaggedQuestions,
  toggleFlag,
  updateFlagNote,
  removeFlag
} from "../controllers/flaggedController.js";

const router = express.Router();

// Get all flagged questions for a user
router.get("/:userId", getFlaggedQuestions);

// Toggle flag on question
router.post("/toggle", toggleFlag);

// Update note on flagged question
router.put("/note/:bookmarkId", updateFlagNote);

// Remove flag
router.delete("/:bookmarkId", removeFlag);

export default router;