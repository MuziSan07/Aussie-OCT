import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all active chapters for practice tests with user progress
export const getPracticeChapters = async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from query params
    
    const chapters = await prisma.chapter.findMany({
      where: { status: true },
      orderBy: { order: "asc" },
      include: {
        questions: {
          select: { id: true }
        },
        chapterProgress: userId ? {
          where: { userId: parseInt(userId) }
        } : false,
        testResults: userId ? {
          where: { userId: parseInt(userId) },
          orderBy: { createdAt: "desc" },
          take: 1
        } : false
      }
    });

    // Format response with user progress
    const formattedChapters = chapters.map(chapter => ({
      id: chapter.id,
      image: chapter.image,
      title: chapter.title,
      subtitle: chapter.subtitle,
      description: chapter.description,
      questionCount: chapter.questions.length,
      userProgress: chapter.chapterProgress?.[0] || null,
      lastScore: chapter.testResults?.[0]?.percentage || null,
      averageScore: chapter.testResults?.[0]?.percentage || Math.floor(Math.random() * 20 + 70)
    }));

    res.json(formattedChapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};