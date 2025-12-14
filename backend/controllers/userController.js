// controllers/userController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ===============================
// Get All Users
// ===============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.emailSetup.findMany({
      include: {
        profile: true,
        tests: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.profile?.username || "Not Set",
      profilePic: user.profile?.profilePic || null,
      status: user.status,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
      testCount: user.tests?.length || 0,
    }));

    res.json({
      success: true,
      data: formattedUsers,
      count: formattedUsers.length,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ===============================
// Get Single User by ID
// ===============================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await prisma.emailSetup.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        tests: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const formattedUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.profile?.username || "Not Set",
      profilePic: user.profile?.profilePic || null,
      status: user.status,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
      tests: user.tests,
      testCount: user.tests?.length || 0,
    };

    res.json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// ===============================
// Update User Status (Activate/Deactivate)
// ===============================
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = parseInt(id);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!status || !["ACTIVE", "DEACTIVATED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be ACTIVE or DEACTIVATED",
      });
    }

    const updatedUser = await prisma.emailSetup.update({
      where: { id: userId },
      data: { status },
      include: {
        profile: true,
      },
    });

    res.json({
      success: true,
      message: `User ${status === "ACTIVE" ? "activated" : "deactivated"} successfully`,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

// ===============================
// Delete User
// ===============================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if user exists
    const user = await prisma.emailSetup.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user (profile and tests will be deleted automatically due to cascade)
    await prisma.emailSetup.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ===============================
// Search Users
// ===============================
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return getAllUsers(req, res);
    }

    const users = await prisma.emailSetup.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query } },
          {
            profile: {
              username: { contains: query, mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        profile: true,
        tests: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.profile?.username || "Not Set",
      profilePic: user.profile?.profilePic || null,
      status: user.status,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
      testCount: user.tests?.length || 0,
    }));

    res.json({
      success: true,
      data: formattedUsers,
      count: formattedUsers.length,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};

// ===============================
// Get User Statistics
// ===============================
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await prisma.emailSetup.count();
    const activeUsers = await prisma.emailSetup.count({
      where: { status: "ACTIVE" },
    });
    const deactivatedUsers = await prisma.emailSetup.count({
      where: { status: "DEACTIVATED" },
    });
    const usersWithProfile = await prisma.userProfile.count();

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        deactivatedUsers,
        usersWithProfile,
        usersWithoutProfile: totalUsers - usersWithProfile,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
    });
  }
};