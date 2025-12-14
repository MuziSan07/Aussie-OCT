// routes/userRouter.js
import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  searchUsers,
  getUserStats,
} from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Get user statistics
router.get("/stats", getUserStats);

// Search users
router.get("/search", searchUsers);

// Get single user by ID
router.get("/:id", getUserById);

// Update user status (activate/deactivate)
router.put("/:id/status", updateUserStatus);

// Delete user
router.delete("/:id", deleteUser);

export default router;