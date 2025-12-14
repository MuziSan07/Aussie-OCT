// controllers/adminController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/admin/overview
export const getAdminOverview = async (req, res) => {
  try {
    // 1. Total users
    const totalUsers = await prisma.emailSetup.count();

    // 2. Active users today (based on lastActivity)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const activeUsersToday = await prisma.emailSetup.count({
      where: {
        lastActivity: {
          gte: todayStart,
        },
      },
    });

    // 3. Test counts
    const totalPracticeTests = await prisma.testResult.count();
    const totalSimulationTests = await prisma.simulationResult.count();
    
    // 4. Total chapters
    const totalChapters = await prisma.chapter.count({
      where: { status: true }
    });

    // 5. Recent 5 users with profile & last test
    const recentUsers = await prisma.emailSetup.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        lastActivity: true,
        createdAt: true,
        profile: {
          select: {
            username: true,
            profilePic: true,
          },
        },
        testResults: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            createdAt: true,
            chapter: {
              select: { title: true },
            },
          },
        },
        simulationResults: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            createdAt: true,
          },
        },
      },
    });

    // 6. Recent chapters with question count and average score
    const recentChapters = await prisma.chapter.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        image: true,
        status: true,
        questions: {
          select: { id: true }
        },
        testResults: {
          select: {
            percentage: true
          }
        }
      },
    });

    // Helper: Format "time ago"
    const formatTimeAgo = (date) => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
      if (diffInSeconds < 60) return "just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    };

    // 7. Format users list
    const usersList = recentUsers.map((user) => {
      const lastPractice = user.testResults[0];
      const lastSimulation = user.simulationResults[0];
      const lastTest = lastPractice || lastSimulation;

      return {
        id: user.id,
        name: user.profile?.username || user.email.split("@")[0],
        email: user.email,
        profilePic: user.profile?.profilePic
          ? `http://localhost:5000${user.profile.profilePic.startsWith("/") ? "" : "/"}${user.profile.profilePic}`
          : null,
        status: user.lastActivity ? "Active" : "Inactive",
        lastActivity: user.lastActivity || user.createdAt,
        lastTest: lastPractice
          ? `Practice Test - ${lastPractice.chapter?.title || "Unknown Chapter"}`
          : lastSimulation
          ? "Simulation Test"
          : "No test yet",
        timeAgo: lastTest ? formatTimeAgo(lastTest.createdAt) : "Never",
      };
    });

    // 8. Format chapters list with average scores
    const chaptersFormatted = recentChapters.map((chapter) => {
      // Calculate average score for this chapter
      const testResults = chapter.testResults || [];
      const averageScore = testResults.length > 0
        ? Math.round(testResults.reduce((sum, test) => sum + test.percentage, 0) / testResults.length)
        : 0;

      return {
        id: chapter.id,
        title: chapter.title,
        subtitle: chapter.subtitle,
        image: chapter.image,
        status: chapter.status,
        questionCount: chapter.questions.length,
        averageScore: averageScore
      };
    });

    // 9. Send response
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsersToday,
        totalPracticeTests,
        totalSimulationTests,
        totalChapters,
        usersTodayCount: activeUsersToday,
        usersList,
        recentChapters: chaptersFormatted,
      },
    });
  } catch (err) {
    console.error("Admin overview error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Optional: Close Prisma on shutdown (good practice)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});