import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get user overview/dashboard data
export const getUserOverview = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const userIdInt = parseInt(userId);

    // Get user info
    const user = await prisma.emailSetup.findUnique({
      where: { id: userIdInt },
      include: {
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Total Simulations (attempted simulation tests)
    const totalSimulations = await prisma.simulationResult.count({
      where: { userId: userIdInt }
    });

    // Completed Chapters (chapters with isCompleted = true)
    const completedChapters = await prisma.chapterProgress.count({
      where: {
        userId: userIdInt,
        isCompleted: true
      }
    });

    // Quiz Score (average percentage from all test results)
    const testResults = await prisma.testResult.findMany({
      where: { userId: userIdInt },
      select: { percentage: true }
    });

    const quizScore = testResults.length > 0
      ? Math.round(testResults.reduce((sum, t) => sum + t.percentage, 0) / testResults.length)
      : 0;

    // Simulation Quiz Score (average from simulation results)
    const simulationResults = await prisma.simulationResult.findMany({
      where: { userId: userIdInt },
      select: { percentage: true }
    });

    const simulationQuizScore = simulationResults.length > 0
      ? Math.round(simulationResults.reduce((sum, s) => sum + s.percentage, 0) / simulationResults.length)
      : 0;

    // Recent Free Practice Tests (last 4 chapter progresses)
    const recentPracticeTests = await prisma.chapterProgress.findMany({
      where: { userId: userIdInt },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      },
      orderBy: { lastAttemptDate: "desc" },
      take: 4
    });

    // Recent Simulation Tests (last 2)
    const recentSimulations = await prisma.simulationResult.findMany({
      where: { userId: userIdInt },
      orderBy: { createdAt: "desc" },
      take: 2
    });

    // Get user achievements
    const achievements = await prisma.achievement.findMany({
      where: { userId: userIdInt },
      orderBy: { earnedAt: "desc" }
    });

    // Total practice tests attempted
    const totalPracticeTests = await prisma.testResult.count({
      where: { userId: userIdInt }
    });

    // Calculate streak (days with activity)
    const recentActivity = await prisma.testResult.findMany({
      where: { userId: userIdInt },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 30
    });

    const activityDates = new Set(
      recentActivity.map(a => a.createdAt.toISOString().split('T')[0])
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.profile?.username || "User",
          profilePic: user.profile?.profilePic,
          createdAt: user.createdAt
        },
        stats: {
          totalSimulations,
          completedChapters,
          quizScore,
          simulationQuizScore,
          totalPracticeTests,
          activeDays: activityDates.size
        },
        recentPracticeTests: recentPracticeTests.map(p => ({
          id: p.id,
          chapterId: p.chapterId,
          chapterTitle: p.chapter.title,
          chapterImage: p.chapter.image,
          progressPercentage: Math.round(p.progressPercentage),
          questionsAttempted: p.questionsAttempted,
          totalQuestions: p.totalQuestions,
          bestScore: p.bestScore ? Math.round(p.bestScore) : null,
          lastAttemptDate: p.lastAttemptDate,
          isCompleted: p.isCompleted
        })),
        recentSimulations: recentSimulations.map(s => ({
          id: s.id,
          score: s.score,
          totalQuestions: s.totalQuestions,
          percentage: Math.round(s.percentage),
          passed: s.passed,
          createdAt: s.createdAt,
          timeSpent: s.timeSpent
        })),
        achievements: achievements.map(a => ({
          id: a.id,
          type: a.type,
          title: a.title,
          description: a.description,
          icon: a.icon,
          earnedAt: a.earnedAt
        }))
      }
    });

  } catch (err) {
    console.error("Error fetching user overview:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all chapters for the user (for practice tests section)
export const getUserChapters = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdInt = parseInt(userId);

    const chapters = await prisma.chapter.findMany({
      where: { status: true },
      include: {
        chapterProgress: {
          where: { userId: userIdInt }
        },
        questions: {
          select: { id: true }
        }
      },
      orderBy: { order: "asc" }
    });

    res.json({
      success: true,
      data: chapters.map(ch => ({
        id: ch.id,
        title: ch.title,
        subtitle: ch.subtitle,
        image: ch.image,
        questionCount: ch.questions.length,
        progress: ch.chapterProgress[0] || null
      }))
    });

  } catch (err) {
    console.error("Error fetching user chapters:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};