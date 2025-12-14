// backend/controllers/QuizController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET Quiz Questions for a Chapter (with range)
export const getQuizQuestions = async (req, res) => {
  try {
    const { chapterId, skip = 0, take = 10 } = req.query;

    if (!chapterId) {
      return res.status(400).json({ message: "chapterId is required" });
    }

    const where = {
      chapterId: parseInt(chapterId),
      status: true,
      testType: "FREE", // Change to handle PAID later
    };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: { options: true },
        orderBy: { id: "asc" },
        skip: parseInt(skip),
        take: parseInt(take),
      }),
      prisma.question.count({ where }),
    ]);

    res.json({ questions, total });
  } catch (err) {
    console.error("Quiz questions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};