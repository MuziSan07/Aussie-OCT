// routes/authRoutes.js
import express from "express";
import { register, login, healthCheck } from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/health", healthCheck);

export default router;
